import React from 'react';
import PropTypes from 'prop-types';

const FamilyTreeNode = ({ node, style }) => (
  <div className="leaf" style={style}>
    <div className={node.isSubject ? 'leaf-subject' : 'leaf-body'}>
      <p className="leaf-title my-auto">{node.name}</p>
    </div>
  </div>
);

FamilyTreeNode.propTypes = {
  node: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
};

export default FamilyTreeNode;
