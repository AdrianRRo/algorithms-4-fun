"""Implementación de Merge Sort en Python."""

from __future__ import annotations



def merge(left: list[int], right: list[int]) -> list[int]:
    """Fusiona dos listas ordenadas sin mutar las originales.

    Args:
        left: Primera lista ordenada.
        right: Segunda lista ordenada.

    Returns:
        Una nueva lista que contiene todos los elementos de ``left`` y ``right`` en orden.
    """
    merged: list[int] = []
    left_index = 0
    right_index = 0

    while left_index < len(left) and right_index < len(right):
        if left[left_index] <= right[right_index]:
            merged.append(left[left_index])
            left_index += 1
        else:
            merged.append(right[right_index])
            right_index += 1

    if left_index < len(left):
        merged.extend(left[left_index:])
    if right_index < len(right):
        merged.extend(right[right_index:])

    return merged


def merge_sort(arr: list[int]) -> list[int]:
    """Ordena una lista de enteros usando Merge Sort.

    Args:
        arr: Lista de enteros que puede contener valores repetidos o negativos.

    Returns:
        Una nueva lista con los mismos elementos que ``arr`` pero en orden ascendente.

    Complejidad:
        Tiempo: ``O(n log n)``.
        Espacio: ``O(n)`` adicional debido a las copias y fusionados temporales.
    """
    if len(arr) <= 1:
        return arr.copy()

    mid = len(arr) // 2
    left_sorted = merge_sort(arr[:mid])
    right_sorted = merge_sort(arr[mid:])

    return merge(left_sorted, right_sorted)
