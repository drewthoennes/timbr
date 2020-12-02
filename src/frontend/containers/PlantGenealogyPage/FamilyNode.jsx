import React from 'react';
import classNames from 'classnames';
import { IFamilyExtNode } from 'relatives-tree/lib/types';

export default function FamilyNode({ node, isRoot, onSubClick, style }) {
  return (
    <div className="leaf" style={style}>
      <div className="leaf-body">
        <p className="leaf-title">{node.name}</p>
      </div>
      {node.hasSubTree && (
        <div className="leaf-sub"
          onClick={() => onSubClick(node.id)}
        />
      )}
    </div>
  );
}
