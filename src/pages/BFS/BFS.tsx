import React, { useMemo, useState } from 'react';
import Controls from '../../components/Controls/Controls';
import GraphTable from '../../components/GraphTable/GraphTable';
import { bfs } from '../../algorithms/BFS';
import { allNodes, sampleWeightedGraph } from '../../data/graphs/sampleWeightedGraph';
import { BFSResult } from '../../types/graphs';
import './BFS.css';

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

const buildDistanceData = (nodes: string[], result: BFSResult | null): TableEntry[] =>
  nodes.map((node) => ({
    node,
    value: formatDistance(result?.distances.get(node), result !== null),
  }));

const buildPreviousData = (nodes: string[], result: BFSResult | null): TableEntry[] =>
  nodes.map((node) => ({
    node,
    value: result ? result.previous.get(node) ?? '-' : '-',
  }));

const BFS: React.FC = () => {
  const currentGraph = sampleWeightedGraph;
  const nodes = useMemo(() => allNodes(currentGraph), [currentGraph]);
  const [startNode, setStartNode] = useState<string>(nodes[0] ?? '');
  const [result, setResult] = useState<BFSResult | null>(null);

  const handleRun = () => {
    if (!startNode) {
      return;
    }
    setResult(bfs(currentGraph, startNode));
  };

  const distancesData = buildDistanceData(nodes, result);
  const previousData = buildPreviousData(nodes, result);

  return (
    <div className="bfs-page">
      <Controls buttonLabel="Run Algorithm" onButtonClick={handleRun} text="BFS Shortest Paths">
        <div className="bfs-controls">
          <label className="bfs-label" htmlFor="start-node">
            Start node
          </label>
          <select
            className="bfs-select"
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
          <div className="bfs-tables">
            <GraphTable data={distancesData} title="Distances" />
            <GraphTable data={previousData} title="Previous Node" />
          </div>
        </div>
      </Controls>
    </div>
  );
};

export default BFS;
