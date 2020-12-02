/* eslint-disable no-console */

import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactFamilyTree from 'react-family-tree';
import { Col } from 'react-bootstrap';
import Navbar from '../../components/Navbar';
import { constructGenealogy } from '../../store/actions/pets';
import map from '../../store/map';
import FamilyTreeNode from './FamilyTreeNode';
import './styles.scss';

const PlantGenealogyPage = (props) => {
  const {
    match: { params: { id } },
    store: { pets, account: { username } },
  } = props;

  const genealogy = constructGenealogy(id, pets);
  const petFamily = [];
  Object.keys(genealogy).forEach((key) => {
    if (key === 'root') return;

    const children = [];
    for (const i in genealogy[key]) children.push({ id: genealogy[key][i] });

    let siblings = [];
    if (pets[key].parent) {
      siblings = pets[pets[key].parent].children
        .filter((child) => child !== key)
        .map((child) => ({ child }));
    }
    petFamily.push({
      id: key,
      name: pets[key].name,
      parents: pets[key].parent ? [{ id: pets[key].parent }] : [],
      spouses: [],
      children,
      siblings,
      isSubject: key === id,
    });
  });

  let maxTreeWidth = 0;
  for (const i in petFamily) {
    if (petFamily[i].children.length > maxTreeWidth) maxTreeWidth = petFamily[i].children.length;
  }

  const treeColPosition = maxTreeWidth > 1 ? { span: 8, offset: 2 } : { span: 2, offset: 5 };
  const WIDTH = 180;
  const HEIGHT = 120;

  return (
    <div>
      <Navbar />
      <div id="plant-genealogy-page" className="container">
        <h2 className="text-center">{pets[id].name}'s Family Tree</h2>
        <br />
        <Col md={treeColPosition}>
          <ReactFamilyTree
            className="tree"
            nodes={petFamily}
            rootId={genealogy.root}
            width={WIDTH}
            height={HEIGHT}
            renderNode={(node) => (
              <Link to={`/${username}/${node.id}`}>
                <FamilyTreeNode
                  key={node.id}
                  node={node}
                  style={{
                    width: WIDTH,
                    height: HEIGHT,
                    transform: `translate(${node.left * (WIDTH / 2)}px, ${node.top * (HEIGHT / 2)}px)`,
                  }}
                />
              </Link>
            )}
          />
        </Col>
      </div>
    </div>
  );
};

PlantGenealogyPage.propTypes = {
  store: PropTypes.shape({
    account: PropTypes.shape({
      uid: PropTypes.string,
      username: PropTypes.string,
    }),
    pets: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
    plants: PropTypes.object.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      username: PropTypes.string,
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default connect(map)(withRouter(PlantGenealogyPage));
