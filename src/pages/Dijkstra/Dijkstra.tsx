import React, { useEffect, useMemo, useState } from 'react';
import Controls from '../../components/Controls/Controls';
import GraphTable from '../../components/GraphTable/GraphTable';
import { dijkstra } from '../../algorithms/Dijkstra';
import { allNodes, sampleWeightedGraph } from '../../data/graphs/sampleWeightedGraph';
import { DijkstraResult, WeightedAdjacencyList } from '../../types/graphs';
import './Dijkstra.css';

type TableEntry = { node: string; value: string };
type PositionedNode = { name: string; x: number; y: number };
type PositionedEdge = { from: string; to: string; weight: number };

const NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  A: { x: 80, y: 175 },
  B: { x: 200, y: 80 },
  C: { x: 200, y: 270 },
  D: { x: 350, y: 80 },
  E: { x: 350, y: 270 },
  F: { x: 470, y: 175 },
};

const formatDistance = (distance: number | undefined, ready: boolean): string => {
  if (!ready) {
    return '-';
  }
  if (distance === undefined || distance === Number.POSITIVE_INFINITY) {
    return '∞';
  }
  return distance.toString();
};

const buildDistanceData = (nodes: string[], result: DijkstraResult | null): TableEntry[] =>
  nodes.map((node) => ({
    node,
    value: formatDistance(result?.distances.get(node), result !== null),
  }));

const buildPreviousData = (nodes: string[], result: DijkstraResult | null): TableEntry[] =>
  nodes.map((node) => ({
    node,
    value: result ? result.previous.get(node) ?? '-' : '-',
  }));

const getPath = (previous: Map<string, string>, start: string, end: string): string[] => {
  if (!start || !end) {
    return [];
  }
  if (start === end) {
    return [start];
  }

  const path: string[] = [];
  let current: string | undefined = end;

  while (current) {
    path.push(current);
    if (current === start) {
      return path.reverse();
    }
    current = previous.get(current);
  }

  return [];
};

const buildPositionedNodes = (nodes: string[]): PositionedNode[] =>
  nodes.map((name) => {
    const position = NODE_POSITIONS[name];
    return {
      name,
      x: position?.x ?? 0,
      y: position?.y ?? 0,
    };
  });

const buildPositionedEdges = (graph: WeightedAdjacencyList): PositionedEdge[] =>
  Object.entries(graph).flatMap(([from, edges]) =>
    edges.map(({ to, weight }) => ({
      from,
      to,
      weight,
    })),
  );

const getEdgeKey = (from: string, to: string) => `${from}->${to}`;

const buildPathEdgeSet = (path: string[]): Set<string> => {
  const edgeSet = new Set<string>();

  for (let index = 0; index < path.length - 1; index += 1) {
    edgeSet.add(getEdgeKey(path[index], path[index + 1]));
  }

  return edgeSet;
};

const renderEdges = (
  edges: PositionedEdge[],
  nodePositionMap: Map<string, PositionedNode>,
  pathEdges: Set<string>,
): (JSX.Element | null)[] =>
  edges.map((edge) => {
    const from = nodePositionMap.get(edge.from);
    const to = nodePositionMap.get(edge.to);

    if (!from || !to) {
      return null;
    }

    const isPathEdge = pathEdges.has(getEdgeKey(edge.from, edge.to));
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    const label = edge.weight.toString();
    const labelWidth = Math.max(28, label.length * 10 + 12);
    const labelHeight = 20;

    return (
      <g key={`edge-${edge.from}-${edge.to}`} className="dijkstra-edge-group">
        <line
          className={`dijkstra-edge${isPathEdge ? ' dijkstra-edge--path' : ''}`}
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          markerEnd={`url(#${isPathEdge ? 'arrow-highlight' : 'arrow-default'})`}
        />
        <rect
          className="dijkstra-weight-bg"
          x={midX - labelWidth / 2}
          y={midY - labelHeight / 2}
          width={labelWidth}
          height={labelHeight}
          rx={4}
          ry={4}
        />
        <text
          className="dijkstra-weight-text"
          x={midX}
          y={midY}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {label}
        </text>
      </g>
    );
  });

const renderNodes = (
  nodes: PositionedNode[],
  pathNodes: Set<string>,
  startNode: string,
  endNode: string,
): JSX.Element[] =>
  nodes.map((node) => {
    const nodeClasses = ['dijkstra-node'];

    if (pathNodes.has(node.name)) {
      nodeClasses.push('dijkstra-node--path');
    }
    if (node.name === startNode) {
      nodeClasses.push('dijkstra-node--start');
    }
    if (node.name === endNode) {
      nodeClasses.push('dijkstra-node--end');
    }

    return (
      <g key={`node-${node.name}`}>
        <circle className={nodeClasses.join(' ')} cx={node.x} cy={node.y} r={22} />
        <text
          className="dijkstra-node-label"
          x={node.x}
          y={node.y}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {node.name}
        </text>
      </g>
    );
  });

const Dijkstra: React.FC = () => {
  const currentGraph = sampleWeightedGraph;
  const nodes = useMemo(() => allNodes(currentGraph), [currentGraph]);
  const [startNode, setStartNode] = useState<string>(() => nodes[0] ?? '');
  const [endNode, setEndNode] = useState<string>(() => nodes[nodes.length - 1] ?? '');
  const [result, setResult] = useState<DijkstraResult | null>(null);

  useEffect(() => {
    setStartNode((previousStart) => (nodes.includes(previousStart) ? previousStart : nodes[0] ?? ''));
    setEndNode(nodes[nodes.length - 1] ?? '');
  }, [nodes]);

  const positionedNodes = useMemo(() => buildPositionedNodes(nodes), [nodes]);
  const nodePositionMap = useMemo(() => {
    const map = new Map<string, PositionedNode>();
    positionedNodes.forEach((positionedNode) => {
      map.set(positionedNode.name, positionedNode);
    });
    return map;
  }, [positionedNodes]);
  const positionedEdges = useMemo(() => buildPositionedEdges(currentGraph), [currentGraph]);
  const path = useMemo(
    () => (result ? getPath(result.previous, startNode, endNode) : []),
    [result, startNode, endNode],
  );
  const pathNodes = useMemo(() => new Set(path), [path]);
  const pathEdges = useMemo(() => buildPathEdgeSet(path), [path]);
  const selectedDistance = useMemo(() => result?.distances.get(endNode), [result, endNode]);
  const distancesData = useMemo(() => buildDistanceData(nodes, result), [nodes, result]);
  const previousData = useMemo(() => buildPreviousData(nodes, result), [nodes, result]);
  const edgeElements = useMemo(
    () => renderEdges(positionedEdges, nodePositionMap, pathEdges),
    [positionedEdges, nodePositionMap, pathEdges],
  );
  const nodeElements = useMemo(
    () => renderNodes(positionedNodes, pathNodes, startNode, endNode),
    [positionedNodes, pathNodes, startNode, endNode],
  );

  const handleRun = () => {
    if (!startNode) {
      return;
    }
    setResult(dijkstra(currentGraph, startNode));
  };

  const hasPath =
    path.length > 0 &&
    selectedDistance !== undefined &&
    selectedDistance !== Number.POSITIVE_INFINITY;

  return (
    <div className="dijkstra-page">
      <Controls buttonLabel="Run Algorithm" onButtonClick={handleRun} text="Dijkstra Shortest Paths">
        <div className="dijkstra-controls">
          <div className="dijkstra-selectors">
            <div className="dijkstra-selector">
              <label className="dijkstra-label" htmlFor="start-node">
                Start node
              </label>
              <select
                className="dijkstra-select"
                id="start-node"
                value={startNode}
                onChange={(event) => setStartNode(event.target.value)}
              >
                {nodes.map((node) => (
                  <option key={node} value={node}>
                    {node}
                  </option>
                ))}
              </select>
            </div>
            <div className="dijkstra-selector">
              <label className="dijkstra-label" htmlFor="end-node">
                End node
              </label>
              <select
                className="dijkstra-select"
                id="end-node"
                value={endNode}
                onChange={(event) => setEndNode(event.target.value)}
              >
                {nodes.map((node) => (
                  <option key={node} value={node}>
                    {node}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {result && (
            <p className="dijkstra-distance">
              {hasPath
                ? `Shortest path ${startNode} \u2192 ${endNode}: ${selectedDistance}`
                : 'No path found'}
            </p>
          )}
          <div className="dijkstra-graph-wrapper">
            <svg viewBox="0 0 500 350" className="dijkstra-svg">
              <defs>
                <marker
                  id="arrow-default"
                  markerWidth="10"
                  markerHeight="10"
                  refX="10"
                  refY="5"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L10,5 L0,10 z" fill="#4b5563" />
                </marker>
                <marker
                  id="arrow-highlight"
                  markerWidth="10"
                  markerHeight="10"
                  refX="10"
                  refY="5"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L10,5 L0,10 z" fill="#f59e0b" />
                </marker>
              </defs>
              {edgeElements}
              {nodeElements}
            </svg>
          </div>
          <div className="dijkstra-tables">
            <GraphTable data={distancesData} title="Distances" />
            <GraphTable data={previousData} title="Previous Node" />
          </div>
        </div>
      </Controls>
    </div>
  );
};

export default Dijkstra;
