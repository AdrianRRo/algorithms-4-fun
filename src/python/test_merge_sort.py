"""Pruebas para la implementación de Merge Sort en Python."""

from __future__ import annotations

import random

from .merge_sort import merge, merge_sort


def test_merge_fusiona_listas_ordenadas() -> None:
    left = [1, 3, 5, 7]
    right = [2, 4, 6, 8]
    assert merge(left, right) == [1, 2, 3, 4, 5, 6, 7, 8]
    assert left == [1, 3, 5, 7]
    assert right == [2, 4, 6, 8]


def test_merge_maneja_duplicados() -> None:
    left = [1, 2, 2, 3]
    right = [2, 2, 4]
    assert merge(left, right) == [1, 2, 2, 2, 2, 3, 4]


def test_merge_sort_lista_vacia() -> None:
    assert merge_sort([]) == []


def test_merge_sort_elemento_unico() -> None:
    assert merge_sort([42]) == [42]


def test_merge_sort_lista_ya_ordenada() -> None:
    assert merge_sort([1, 2, 3, 4, 5]) == [1, 2, 3, 4, 5]


def test_merge_sort_lista_inversa() -> None:
    assert merge_sort([5, 4, 3, 2, 1]) == [1, 2, 3, 4, 5]


def test_merge_sort_duplicados() -> None:
    assert merge_sort([4, 1, 3, 4, 2, 1]) == [1, 1, 2, 3, 4, 4]


def test_merge_sort_negativos() -> None:
    assert merge_sort([3, -1, -5, 2, 0]) == [-5, -1, 0, 2, 3]


def test_merge_sort_lista_grande_aleatoria() -> None:
    rng = random.Random(42)
    data = [rng.randint(-1000, 1000) for _ in range(500)]
    resultado = merge_sort(data)

    assert resultado == sorted(data)
    assert len(resultado) == len(data)
    assert data != resultado
