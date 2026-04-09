import React from 'react';
import './GraphTable.css';

type GraphTableEntry = {
  node: string;
  value: string;
};

interface GraphTableProps {
  title: string;
  data: GraphTableEntry[];
}

const GraphTable: React.FC<GraphTableProps> = ({ title, data }) => {
  return (
    <div className="graph-table">
      <h3>{title}</h3>
      <table>
        <thead>
          <tr>
            <th>Nodo</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.node}>
              <td>{entry.node}</td>
              <td>{entry.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GraphTable;
