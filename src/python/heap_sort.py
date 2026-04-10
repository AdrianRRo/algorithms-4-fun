"""Heap Sort implementation.

Heap Sort builds a max-heap from the input array and then repeatedly swaps the first
(maximum) element with the last element of the heap, shrinking the considered heap
size each iteration. The resulting list is sorted in ascending order.
"""

from typing import List


def _heapify(arr: List[int], size: int, index: int) -> None:
    """Iteratively enforce the max-heap property on a subtree.

    Args:
        arr: The array representing the heap.
        size: The effective size of the heap to consider.
        index: The index of the subtree root.
    """
    while True:
        largest = index
        left = 2 * index + 1
        right = left + 1

        if left < size and arr[left] > arr[largest]:
            largest = left
        if right < size and arr[right] > arr[largest]:
            largest = right

        if largest == index:
            return

        arr[index], arr[largest] = arr[largest], arr[index]
        index = largest


def heap_sort(arr: List[int]) -> List[int]:
    """Return a new list containing the sorted values of ``arr``.

    The input list is not modified.
    """
    arr_copy = list(arr)
    size = len(arr_copy)

    if size <= 1:
        return arr_copy

    for index in range(size // 2 - 1, -1, -1):
        _heapify(arr_copy, size, index)

    for end in range(size - 1, 0, -1):
        arr_copy[0], arr_copy[end] = arr_copy[end], arr_copy[0]
        _heapify(arr_copy, end, 0)

    return arr_copy