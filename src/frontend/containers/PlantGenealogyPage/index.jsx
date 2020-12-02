/* eslint-disable no-console */

import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import ProfilePicture from '../../assets/images/pet_profile_picture.png';
import Navbar from '../../components/Navbar';
import { getPetProfilePicture, constructGenealogy } from '../../store/actions/pets';
import map from '../../store/map';
import ReactFamilyTree from 'react-family-tree';
import FamilyNode from './FamilyNode';
import { Row, Col } from 'react-bootstrap';
import './styles.scss';

class PlantGenealogyPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.getProfilePicture = this.getProfilePicture.bind(this);
    this.getTreeRows = this.getTreeRows.bind(this);
  }

  componentDidMount() {
    const { store: { account: { username } } } = this.props;
    this.getProfilePicture();

    if (!username) return Promise.resolve();
  }

  componentDidUpdate(prevProps) {
  }

  getProfilePicture() {
    const { match: { params: { id } } } = this.props;
    this.setState({ profilePic: ProfilePicture });

    getPetProfilePicture(id).then((profilePic) => {
      if (profilePic) {
        this.setState({ profilePic });
      }
    });
  }

  getTreeRows(tree, root, rows, row) {
    rows[row].push(tree[root]);

    for (let i in tree[root])
      this.getTreeRows(tree, tree[root][i], rows, row+1);
  }

  render() {
    const {
      match: { params: { id } },
      store: { pets, account: { username } },
    } = this.props;

    const genealogy = constructGenealogy(id, pets);
    const petFamily = [];
    Object.keys(genealogy).map(key => {
      if (key === "root") {
          // petFamily.root = pets[genealogy[key]].name;
          return;
      }
      const children = [];
      for (let i in genealogy[key]) children.push({ id: genealogy[key][i] });

      let siblings = [];
      if (pets[key].parent) {
        siblings = pets[pets[key].parent].children
          .filter(child => child !== key)
          .map(child => { id: child });
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

    const WIDTH = 180;
    const HEIGHT = 120;

    return (
      <div>
        <Navbar />
        <div id="plant-genealogy-page" className="container">
          <h2 className="text-center">{pets[id].name}'s Family Tree</h2>
          <br />
            <Col md={{ span: 8, offset: 2 }}>
              <ReactFamilyTree
                className="tree"
                nodes={petFamily}
                rootId={genealogy.root}
                width={WIDTH}
                height={HEIGHT}
                renderNode={(node) => (
                  <Link to={`/${username}/${node.id}`}>
                    <FamilyNode
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
  }
}

PlantGenealogyPage.propTypes = {
  own: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
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
