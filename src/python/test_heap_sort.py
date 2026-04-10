import random

from .heap_sort import heap_sort


def test_empty_list_sorted() -> None:
    assert heap_sort([]) == []


def test_single_element() -> None:
    assert heap_sort([1]) == [1]


def test_already_sorted_list() -> None:
    assert heap_sort([1, 2, 3, 4]) == [1, 2, 3, 4]


def test_reverse_sorted_list() -> None:
    assert heap_sort([4, 3, 2, 1]) == [1, 2, 3, 4]


def test_with_duplicate_values() -> None:
    assert heap_sort([2, 1, 2, 3]) == [1, 2, 2, 3]


def test_with_negative_numbers() -> None:
    assert heap_sort([-1, 3, -5, 0]) == [-5, -1, 0, 3]


def test_does_not_mutate_input() -> None:
    original = [3, 1, 4, 1, 5]
    copy = original.copy()
    result = heap_sort(original)

    assert result == sorted(original)
    assert original == copy


def test_large_random_input() -> None:
    random.seed(42)
    arr = [random.randint(-1000, 1000) for _ in range(2048)]

    assert heap_sort(arr) == sorted(arr)
    assert arr != sorted(arr)