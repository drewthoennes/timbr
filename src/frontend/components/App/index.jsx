import React from 'react';
import Router from '../../router';
import { Navbar, Nav } from 'react-bootstrap';
import './styles.scss';

const App = () => (
  <>
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="/">timbr</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link href="/myplants">My Plants</Nav.Link>
      </Nav>
    </Navbar>
    <Router />
  </>
);

export default App;
