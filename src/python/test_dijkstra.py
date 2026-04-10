"""Pruebas para la implementación Python del algoritmo de Dijkstra."""

from __future__ import annotations

import math

import pytest

from dijkstra import WeightedGraph, dijkstra, get_path


def test_simple_graph() -> None:
  graph: WeightedGraph = {
    "A": [("B", 1.0)],
    "B": [("C", 2.0)],
    "C": [],
  }

  result = dijkstra(graph, "A")

  assert result.distances["C"] == pytest.approx(3.0)
  assert get_path(result, "A", "C") == ["A", "B", "C"]


def test_disconnected_node_has_infinite_distance() -> None:
  graph: WeightedGraph = {
    "A": [("B", 2.0)],
    "B": [],
    "C": [],
  }

  result = dijkstra(graph, "A")

  assert math.isinf(result.distances["C"])
  assert get_path(result, "A", "C") == []


def test_single_node_graph() -> None:
  graph: WeightedGraph = {"A": []}

  result = dijkstra(graph, "A")

  assert result.distances["A"] == pytest.approx(0.0)
  assert result.previous == {}
  assert get_path(result, "A", "A") == ["A"]


def test_prefers_shorter_alternative_path() -> None:
  graph: WeightedGraph = {
    "A": [("B", 2.0), ("C", 1.0)],
    "B": [("D", 5.0)],
    "C": [("D", 2.0)],
    "D": [],
  }

  result = dijkstra(graph, "A")

  assert result.distances["D"] == pytest.approx(3.0)
  assert get_path(result, "A", "D") == ["A", "C", "D"]


def test_get_path_reconstructs_intermediate_nodes() -> None:
  graph: WeightedGraph = {
    "S": [("A", 4.0), ("B", 1.0)],
    "A": [("C", 1.0)],
    "B": [("A", 2.0), ("C", 5.0)],
    "C": [],
  }

  result = dijkstra(graph, "S")

  assert get_path(result, "S", "C") == ["S", "B", "A", "C"]


def test_get_path_returns_empty_when_unreachable() -> None:
  graph: WeightedGraph = {
    "X": [("Y", 1.0)],
    "Y": [],
    "Z": [],
  }

  result = dijkstra(graph, "X")

  assert get_path(result, "X", "Z") == []
