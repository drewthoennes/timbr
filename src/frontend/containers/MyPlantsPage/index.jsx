import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Button, Card, Dropdown, DropdownButton, FormControl, InputGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';
import ProfilePicture from '../../assets/images/pet_profile_picture.png';
import Navbar from '../../components/Navbar';
import map from '../../store/map';
import './styles.scss';
import { logout } from '../../store/actions/auth';
import { getPetProfilePicture } from '../../store/actions/pets';

import FilterMenu from './FilterMenu';

const uppercaseFirst = (str) => str[0].toUpperCase() + str.substr(1).toLowerCase();

class MyPlantsPage extends React.Component {
  constructor() {
    super();

    this.state = {
      profilePics: {},
      search: '',
      sort: '',
      asc: true,
      filters: [],
      actionItems: [],
    };

    this.getProfilePictures = this.getProfilePictures.bind(this);
    this.getCriticalActions = this.getCriticalActions.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.setFilters = this.setFilters.bind(this);
    this.sortBy = this.sortBy.bind(this);
    this.filterBy = this.filterBy.bind(this);
  }

  componentDidMount() {
    const { store: { account: { uid } }, history } = this.props;

    if (!uid) {
      history.push('/login');
    }

    this.getProfilePictures();
    this.getCriticalActions();
  }

  componentDidUpdate() {
    const { store: { account: { uid } }, history } = this.props;

    if (!uid) {
      history.push('/login');
    }
  }

  getProfilePictures() {
    const { store: { pets } } = this.props;
    const { profilePics } = this.state;
    Object.keys(pets).forEach((id) => {
      profilePics[id] = ProfilePicture;
      this.setState({ profilePics });

      getPetProfilePicture(id).then((picture) => {
        if (picture) {
          profilePics[id] = picture;
          this.setState({ profilePics });
        }
      });
    });
  }

  getCriticalActions() {
    const { store: { pets } } = this.props;
    const { store: { plants } } = this.props;
    const { actionItems } = this.state;
    Object.keys(pets).forEach((id) => {
      const { type } = pets[id];
      if (actionItems[id] === undefined) {
        actionItems[id] = '';
      }
      // water
      const diffWTime = Math.abs(new Date() - (new Date(pets[id].watered.last)));
      const diffWDays = Math.ceil(diffWTime / (1000 * 60 * 60 * 24));
      if (diffWDays >= plants[type].waterFreq) {
        actionItems[id] = `${actionItems[id]}\n💦\n`;
        this.setState({ actionItems });
      }

      const diffFTime = Math.abs(new Date() - (new Date(pets[id].fertilized.last)));
      const diffFDays = Math.ceil(diffFTime / (1000 * 60 * 60 * 24));
      if (diffFDays >= plants[type].fertFreq) {
        actionItems[id] = `${actionItems[id]}\n🌱\n`;
        this.setState({ actionItems });
      }
      const diffRTime = Math.abs(new Date() - (new Date(pets[id].turned.last)));
      const diffRDays = Math.ceil(diffRTime / (1000 * 60 * 60 * 24));
      if (diffRDays >= plants[type].rotateFreq) {
        actionItems[id] = `${actionItems[id]}\n💃\n`;
        this.setState({ actionItems });
      }
      if (plants[type].carnivorous === true) {
        const diffTimeFeed = Math.abs(new Date() - (new Date(pets[id].fed.last)));
        const diffDaysFeed = Math.ceil(diffTimeFeed / (1000 * 60 * 60 * 24));
        if (diffDaysFeed >= plants[type].feedFreq) {
          actionItems[id] = `${actionItems[id]}\n🍽️\n`;
          this.setState({ actionItems });
        }
      }
    });
  }

  handleSearch(e) {
    this.setState({ search: e.target.value });
  }

  handleLogout(e) {
    e.preventDefault();

    const { history } = this.props;
    logout()
      .then(() => {
        history.push('/login');
      });
    // .catch((error) => {
    //   console.error(`Error: ${error.message}`);
    // });
  }

  sortBy(field) {
    const { sort } = this.state;

    if (field === sort) {
      this.setState((prevProps) => ({ asc: !prevProps.asc }));
    } else {
      this.setState({ sort: field, asc: true });
    }
  }

  setFilters(filters) {
    this.setState({ filters });
  }

  filterBy(pet) {
    const { store: { plants } } = this.props;
    const { filters } = this.state;

    return filters.reduce((aggregate, { field, equivalence, value }) => {
      if (!aggregate) return aggregate;

      if (field === 'Type') {
        switch (equivalence) {
          case '=': { return plants[pet.type].name === value; }
          case '\u2260': { return plants[pet.type].name !== value; }
          default: return true;
        }
      } else if (field === 'Carnivorous') {
        return equivalence === '='
          ? `${plants[pet.type].carnivorous}` === value
          : `${plants[pet.type].carnivorous}` !== value;
      }

      return aggregate;
    }, true);
  }

  render() {
    const { store: { pets, plants, account: { username } } } = this.props;

    const { profilePics, search, sort, asc, filters, actionItems } = this.state;

    const lowerCaseSearch = search.toLowerCase();
    const defaultMessage = search || filters.length
      ? <p>No plants match the given query</p>
      : <p>Add a plant to get started</p>;

    const alivePlants = Object.entries(pets).filter(([, pet]) => !pet.dead);
    let filteredAndSortedPets = search || filters.length
      ? alivePlants.filter(([, pet]) => {
        const name = pet.name.toLowerCase().indexOf(lowerCaseSearch) !== -1;
        const commonType = plants[pet.type].name.toLowerCase().indexOf(lowerCaseSearch) !== -1;
        // const binomType = pet.type.indexOf(lowerCaseSearch) !== -1;
        const fieldFilters = this.filterBy(pet);

        return search ? fieldFilters && (name || commonType) : fieldFilters;
      }) : alivePlants;

    filteredAndSortedPets = filteredAndSortedPets.sort(([, p1], [, p2]) => {
      const field1 = sort === 'type' ? plants[p1.type].name : p1[sort];
      const field2 = sort === 'type' ? plants[p2.type].name : p2[sort];

      if (asc) {
        return field1 > field2 ? 1 : -1;
      }

      return field1 < field2 ? 1 : -1;
    });

    const plantCards = filteredAndSortedPets.length ? filteredAndSortedPets.map(([id, pet]) => (
      <span className="plant-link" key={id}>
        <Link to={`/${username}/${id}`}>
          <Card className="plant-card">
            <Card.Img className="card-img" variant="top" src={profilePics[id]} />
            <Card.Body>
              <Card.Title>{pet.name}</Card.Title>
              <Card.Text>{plants[pet.type].name}</Card.Text>
              <Card.Text>{actionItems[id]}</Card.Text>
            </Card.Body>
          </Card>
        </Link>
      </span>
    )) : defaultMessage;

    return (
      <div id="my-plants-page">
        <Navbar />
        <div className="container">
          <span id="top-row">
            <InputGroup>
              <FormControl
                name="search"
                value={search}
                onChange={this.handleSearch}
                maxLength="40"
                placeholder="Search through your plants"
              />

              <Dropdown as={InputGroup.Append}>
                <Dropdown.Toggle>{`Filter${filters.length ? ` (${filters.length})` : ''}`}</Dropdown.Toggle>
                <Dropdown.Menu as={FilterMenu} onChange={this.setFilters} plants={plants} align="right" />
              </Dropdown>

              <DropdownButton
                as={InputGroup.Append}
                title={sort ? `${uppercaseFirst(sort)} ${asc ? '\u2191' : '\u2193'}` : 'Sort By'}
              >
                <Dropdown.Item onSelect={() => this.sortBy('name')}>Name</Dropdown.Item>
                <Dropdown.Item onSelect={() => this.sortBy('type')}>Type</Dropdown.Item>
                <Dropdown.Item onSelect={() => this.sortBy('ownedSince')}>Owned Since</Dropdown.Item>
                <Dropdown.Item onSelect={() => this.sortBy('birth')}>Age</Dropdown.Item>
              </DropdownButton>
            </InputGroup>

            <Link className="nav-link" to={`/${username}/new`}>
              <Button>New Plant</Button>
            </Link>
          </span>

          {plantCards}
        </div>
      </div>
    );
  }
}

MyPlantsPage.propTypes = {
  history: PropTypes.object.isRequired,
  store: PropTypes.shape({
    account: PropTypes.shape({
      uid: PropTypes.string,
      username: PropTypes.string,
    }).isRequired,
    pets: PropTypes.object.isRequired,
    plants: PropTypes.object.isRequired,
  }).isRequired,
};
export default connect(map)(withRouter(MyPlantsPage));
