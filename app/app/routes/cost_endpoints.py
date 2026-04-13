"""Phase L: cost-per-bot/day, projection, budget alerts.

Items L274-L291.
"""

import logging
import os
from typing import Any

from fastapi import APIRouter, Query

logger = logging.getLogger("cost_endpoints")

router = APIRouter(prefix="/api/billing", tags=["billing-extra"])


@router.get("/cost-per-bot")
def cost_per_bot(days: int = Query(7, ge=1, le=90)) -> dict[str, Any]:
    """Phase L item 275: daily cost broken down by bot."""
    try:
        from app.db import get_conn

        with get_conn() as conn, conn.cursor() as cur:
            # Try model_calls first
            cur.execute(
                """
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = 'public'
                  AND table_name IN ('model_calls', 'llm_calls', 'tool_usage', 'bot_usage_log')
                """
            )
            tables = [r[0] for r in cur.fetchall()]
            rows: list[dict[str, Any]] = []

            if "model_calls" in tables:
                cur.execute(
                    """
                    SELECT
                        COALESCE(bot_name, model, '(unknown)') AS bot_key,
                        DATE(created_at) AS day,
                        COUNT(*) AS calls,
                        COALESCE(SUM(cost_usd), 0)::float AS cost
                    FROM model_calls
                    WHERE created_at > NOW() - (%s * INTERVAL '1 day')
                    GROUP BY bot_key, day
                    ORDER BY day DESC, cost DESC
                    """,
                    (days,),
                )
                rows = [
                    {"bot": r[0], "day": r[1].isoformat(), "calls": int(r[2]), "cost_usd": round(float(r[3]), 4)}
                    for r in cur.fetchall()
                ]

            totals: dict[str, float] = {}
            for r in rows:
                totals[r["bot"]] = totals.get(r["bot"], 0.0) + r["cost_usd"]

            total_cost = sum(totals.values())
            top_bots = sorted(totals.items(), key=lambda x: x[1], reverse=True)[:10]

            return {
                "days": days,
                "total_cost_usd": round(total_cost, 2),
                "top_bots": [{"bot": b, "cost_usd": round(c, 4)} for b, c in top_bots],
                "by_day": rows[:200],
                "source_table": "model_calls" if "model_calls" in tables else None,
            }
    except Exception as e:  # noqa: BLE001
        logger.warning("cost_per_bot: %s", e)
        return {"error": str(e), "days": days, "total_cost_usd": 0, "top_bots": [], "by_day": []}


@router.get("/budget-status")
def budget_status() -> dict[str, Any]:
    """Phase L item 276: daily budget check."""
    daily_budget = float(os.environ.get("DAILY_BUDGET_USD", "20"))
    try:
        from app.db import get_conn

        with get_conn() as conn, conn.cursor() as cur:
            cur.execute(
                """
                SELECT COALESCE(SUM(cost_usd), 0)::float
                FROM model_calls
                WHERE DATE(created_at) = CURRENT_DATE
                """
            )
            spent = float(cur.fetchone()[0] or 0)
    except Exception as e:  # noqa: BLE001
        logger.debug("budget spent lookup: %s", e)
        spent = 0.0

    pct = (spent / daily_budget * 100) if daily_budget > 0 else 0
    return {
        "daily_budget_usd": daily_budget,
        "spent_today_usd": round(spent, 4),
        "pct_used": round(pct, 1),
        "status": "over" if pct > 100 else "warning" if pct > 80 else "ok",
    }


@router.get("/projection")
def cost_projection(days: int = Query(30, ge=1, le=90)) -> dict[str, Any]:
    """Phase L item 290: project end-of-month cost based on last N days."""
    try:
        from app.db import get_conn

        with get_conn() as conn, conn.cursor() as cur:
            cur.execute(
                """
                SELECT DATE(created_at), COALESCE(SUM(cost_usd), 0)::float
                FROM model_calls
                WHERE created_at > NOW() - (%s * INTERVAL '1 day')
                GROUP BY DATE(created_at)
                ORDER BY DATE(created_at)
                """,
                (days,),
            )
            rows = cur.fetchall()
    except Exception as e:  # noqa: BLE001
        logger.debug("projection: %s", e)
        rows = []

    if not rows:
        return {"error": "no data", "days": days}

    total = sum(float(r[1]) for r in rows)
    avg_daily = total / len(rows) if rows else 0
    projected_30d = avg_daily * 30
    projected_monthly = avg_daily * 30.44

    return {
        "days_sampled": len(rows),
        "total_last_n": round(total, 2),
        "avg_daily_usd": round(avg_daily, 4),
        "projected_30d_usd": round(projected_30d, 2),
        "projected_monthly_usd": round(projected_monthly, 2),
    }


def ensure_bot_budgets_table() -> None:
    """Phase L item 285-286: auto-migrate bot_budgets table on import."""
    try:
        from app.db import get_conn

        with get_conn() as conn, conn.cursor() as cur:
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS bot_budgets (
                    id SERIAL PRIMARY KEY,
                    bot_name TEXT UNIQUE NOT NULL,
                    daily_limit_usd NUMERIC(10,4) DEFAULT 5.00
                )
                """
            )
            conn.commit()
        logger.info("bot_budgets table ensured")
    except Exception as e:  # noqa: BLE001
        logger.error(f"Migration failed: {e}")


ensure_bot_budgets_table()
