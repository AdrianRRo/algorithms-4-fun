"""Centralized prompt optimization and caching utilities for LLM providers."""
from __future__ import annotations

import hashlib
import json
import logging
import os
from typing import Any, Iterable, Optional

try:
    import redis  # type: ignore
except ImportError:  # pragma: no cover - optional dependency
    redis = None  # type: ignore

import tiktoken

logger = logging.getLogger(__name__)

_ENCODING = tiktoken.get_encoding("cl100k_base")
_COMPRESSION_THRESHOLD = 3000

_CACHE_PREFIX = "botarmy:llm_cache:"
_CACHE_DEFAULT_TTL = 3600  # 1 hora (TTL conservador L278)
_CACHE_STATS_KEY = "botarmy:llm_cache_stats"

_SEMANTIC_CACHE_ENABLED: bool = True
_SEMANTIC_CACHE_TTL: int = 3600
_SEMANTIC_SIMILARITY_THRESHOLD: float = 0.92
_SEMANTIC_MAX_ENTRIES: int = 500
_SEMANTIC_INDEX_KEY: str = "botarmy:llm_scache_idx"
_SEMANTIC_ENTRY_PREFIX: str = "botarmy:llm_scache:"

_REDIS_CLIENT: Optional[redis.Redis] = None  # type: ignore[attr-defined]


# ----------------------------------------------------------------------------
# Prompt utilities
# ----------------------------------------------------------------------------

def count_tokens(text: str) -> int:
    """Count tokens using tiktoken's cl100k_base encoding."""
    if not text:
        return 0
    return len(_ENCODING.encode(text))


def optimize_prompt(prompt: str, system: str = "", *, max_tokens: int | None = None) -> tuple[str, str]:
    """Return the prompt/system pair, optionally truncating to max_tokens."""
    if max_tokens is None:
        return prompt, system

    joined = f"{system}\n{prompt}" if system else prompt
    tokens = _ENCODING.encode(joined)
    if len(tokens) <= max_tokens:
        return prompt, system

    truncated = _ENCODING.decode(tokens[:max_tokens])
    if system:
        split_index = truncated.find("\n")
        if split_index == -1:
            return truncated, ""
        return truncated[split_index + 1 :], truncated[:split_index]
    return truncated, ""


def estimate_cost(model: str, prompt: str, response: str = "") -> float:
    """Estimate prompt/response cost. Placeholder returning 0 for now."""
    _ = (model, prompt, response)
    return 0.0


# ----------------------------------------------------------------------------
# Redis helpers
# ----------------------------------------------------------------------------

def _get_redis() -> Optional[redis.Redis]:  # type: ignore[attr-defined]
    """Lazy Redis client loader."""
    global _REDIS_CLIENT
    if _REDIS_CLIENT is not None:
        return _REDIS_CLIENT
    if redis is None:  # type: ignore[name-defined]
        logger.debug("Redis library not available; caching disabled")
        return None

    url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    try:
        _REDIS_CLIENT = redis.from_url(url, decode_responses=True)  # type: ignore[attr-defined]
    except Exception as exc:  # pragma: no cover - connection errors
        logger.debug("Redis connection error: %s", exc)
        _REDIS_CLIENT = None
    return _REDIS_CLIENT


def _cache_key(model: str, prompt: str, system: str, temperature: float) -> str:
    payload = "|".join([model, f"{temperature:.2f}", system, prompt])
    digest = hashlib.sha256(payload.encode("utf-8")).hexdigest()
    return f"{_CACHE_PREFIX}{digest}"


# ----------------------------------------------------------------------------
# Semantic cache helpers
# ----------------------------------------------------------------------------

def _cosine_similarity(a: Iterable[float], b: Iterable[float]) -> float:
    """Cosine similarity between two embedding vectors."""
    a_list = list(a)
    b_list = list(b)
    if not a_list or not b_list or len(a_list) != len(b_list):
        return 0.0
    dot = sum(x * y for x, y in zip(a_list, b_list))
    norm_a = sum(x * x for x in a_list) ** 0.5
    norm_b = sum(x * x for x in b_list) ** 0.5
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


def _semantic_key(embedding: list[float]) -> str:
    """Stable key derived from embedding vector (quantized to 4 decimals)."""
    quantized = "|".join(f"{value:.4f}" for value in embedding[:64])
    digest = hashlib.sha256(quantized.encode("utf-8")).hexdigest()[:24]
    return f"{_SEMANTIC_ENTRY_PREFIX}{digest}"


def semantic_cache_get(prompt: str, system: str = "", temperature: float = 0.0) -> Optional[str]:
    """Semantic cache lookup using embedding similarity."""
    if not _SEMANTIC_CACHE_ENABLED or temperature > 0.3:
        return None

    redis_client = _get_redis()
    if not redis_client:
        return None

    try:
        from app.llm_providers.embed import embed as _embed  # type: ignore
    except Exception as exc:  # pragma: no cover - optional dependency
        logger.debug("Semantic cache embed unavailable: %s", exc)
        return None

    try:
        query_input = f"{system}\n{prompt}".strip()
        query_vec = _embed(query_input)
        entries = list(redis_client.smembers(_SEMANTIC_INDEX_KEY))
        best_sim = 0.0
        best_key: Optional[str] = None

        for entry_key in entries[: _SEMANTIC_MAX_ENTRIES]:
            raw_vector = redis_client.hget(entry_key, "embedding")
            if not raw_vector:
                continue
            stored_vec = json.loads(raw_vector)
            similarity = _cosine_similarity(query_vec, stored_vec)
            if similarity > best_sim:
                best_sim = similarity
                best_key = entry_key

        if best_key and best_sim >= _SEMANTIC_SIMILARITY_THRESHOLD:
            response = redis_client.hget(best_key, "response")
            if response:
                redis_client.hincrby(_CACHE_STATS_KEY, "semantic_hits", 1)
                logger.debug("LLM semantic cache HIT (sim=%.4f): %s", best_sim, best_key[-12:])
                return response
        redis_client.hincrby(_CACHE_STATS_KEY, "semantic_misses", 1)
    except Exception as exc:  # pragma: no cover - runtime guard
        logger.debug("Semantic cache get error: %s", exc)
    return None


def semantic_cache_set(
    prompt: str,
    system: str = "",
    temperature: float = 0.0,
    response: str = "",
) -> None:
    """Store a response in the semantic cache with its embedding."""
    if not _SEMANTIC_CACHE_ENABLED or temperature > 0.3 or len(response) < 20:
        return

    redis_client = _get_redis()
    if not redis_client:
        return

    try:
        from app.llm_providers.embed import embed as _embed  # type: ignore
    except Exception as exc:  # pragma: no cover - optional dependency
        logger.debug("Semantic cache embed unavailable: %s", exc)
        return

    try:
        current_count = redis_client.scard(_SEMANTIC_INDEX_KEY)
        if current_count >= _SEMANTIC_MAX_ENTRIES:
            evicted = redis_client.spop(_SEMANTIC_INDEX_KEY)
            if evicted:
                redis_client.delete(evicted)

        vec = _embed(f"{system}\n{prompt}".strip())
        entry_key = _semantic_key(vec)
        pipe = redis_client.pipeline()
        pipe.hset(entry_key, mapping={"embedding": json.dumps(vec), "response": response})
        pipe.expire(entry_key, _SEMANTIC_CACHE_TTL)
        pipe.sadd(_SEMANTIC_INDEX_KEY, entry_key)
        pipe.execute()
    except Exception as exc:  # pragma: no cover - runtime guard
        logger.debug("Semantic cache set error: %s", exc)


# ----------------------------------------------------------------------------
# Public cache API
# ----------------------------------------------------------------------------

def cache_get(model: str, prompt: str, system: str = "", temperature: float = 0.0) -> Optional[str]:
    """Look up a cached LLM response."""
    if temperature > 0.3:
        return None

    redis_client = _get_redis()
    if not redis_client:
        return None

    try:
        key = _cache_key(model, prompt, system, temperature)
        cached = redis_client.get(key)
        if cached:
            redis_client.hincrby(_CACHE_STATS_KEY, "hits", 1)
            logger.debug("LLM cache HIT (exact): %s", key[-12:])
            return cached
        redis_client.hincrby(_CACHE_STATS_KEY, "misses", 1)
    except Exception as exc:  # pragma: no cover - runtime guard
        logger.debug("Exact cache get error: %s", exc)

    return semantic_cache_get(prompt, system, temperature)


def cache_set(
    model: str,
    prompt: str,
    system: str,
    temperature: float,
    response: str,
    ttl: int = _CACHE_DEFAULT_TTL,
) -> None:
    """Store an LLM response in exact hash cache and semantic cache."""
    if temperature > 0.3 or len(response) < 20:
        return

    redis_client = _get_redis()
    if not redis_client:
        return

    try:
        key = _cache_key(model, prompt, system, temperature)
        redis_client.setex(key, ttl, response)
    except Exception as exc:  # pragma: no cover - runtime guard
        logger.debug("Exact cache set error: %s", exc)

    semantic_cache_set(prompt, system, temperature, response)


def cache_stats() -> dict[str, Any]:
    """Return cache hit/miss stats (exact + semantic)."""
    redis_client = _get_redis()
    if not redis_client:
        return {
            "hits": 0,
            "misses": 0,
            "semantic_hits": 0,
            "semantic_misses": 0,
            "semantic_cache_enabled": _SEMANTIC_CACHE_ENABLED,
            "semantic_similarity_threshold": _SEMANTIC_SIMILARITY_THRESHOLD,
            "semantic_max_entries": _SEMANTIC_MAX_ENTRIES,
            "semantic_ttl_seconds": _SEMANTIC_CACHE_TTL,
        }

    try:
        data = redis_client.hgetall(_CACHE_STATS_KEY)
        return {
            "hits": int(data.get("hits", 0)),
            "misses": int(data.get("misses", 0)),
            "semantic_hits": int(data.get("semantic_hits", 0)),
            "semantic_misses": int(data.get("semantic_misses", 0)),
            "semantic_cache_enabled": _SEMANTIC_CACHE_ENABLED,
            "semantic_similarity_threshold": _SEMANTIC_SIMILARITY_THRESHOLD,
            "semantic_max_entries": _SEMANTIC_MAX_ENTRIES,
            "semantic_ttl_seconds": _SEMANTIC_CACHE_TTL,
        }
    except Exception as exc:  # pragma: no cover - runtime guard
        logger.debug("Cache stats error: %s", exc)
        return {
            "hits": 0,
            "misses": 0,
            "semantic_hits": 0,
            "semantic_misses": 0,
            "semantic_cache_enabled": _SEMANTIC_CACHE_ENABLED,
            "semantic_similarity_threshold": _SEMANTIC_SIMILARITY_THRESHOLD,
            "semantic_max_entries": _SEMANTIC_MAX_ENTRIES,
            "semantic_ttl_seconds": _SEMANTIC_CACHE_TTL,
        }
