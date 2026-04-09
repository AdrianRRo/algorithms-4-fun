import React, { useMemo, useState } from 'react';
import Controls from '../../components/Controls/Controls';
import GraphTable from '../../components/GraphTable/GraphTable';
import { dijkstra } from '../../algorithms/Dijkstra';
import { allNodes, sampleWeightedGraph } from '../../data/graphs/sampleWeightedGraph';
import { DijkstraResult } from '../../types/graphs';
import './Dijkstra.css';

type TableEntry = { node: string; value: string };

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

const Dijkstra: React.FC = () => {
  const currentGraph = sampleWeightedGraph;
  const nodes = useMemo(() => allNodes(currentGraph), [currentGraph]);
  const [startNode, setStartNode] = useState<string>(nodes[0] ?? '');
  const [result, setResult] = useState<DijkstraResult | null>(null);

  const handleRun = () => {
    if (!startNode) {
      return;
    }
    setResult(dijkstra(currentGraph, startNode));
  };

  const distancesData = buildDistanceData(nodes, result);
  const previousData = buildPreviousData(nodes, result);

  return (
    <div className="dijkstra-page">
      <Controls buttonLabel="Run Algorithm" onButtonClick={handleRun} text="Dijkstra Shortest Paths">
        <div className="dijkstra-controls">
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
