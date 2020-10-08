import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import Router from '../../router';
import './styles.scss';

const App = () => (
  <>
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="/">timbr</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link href="/myplants">My Plants</Nav.Link>
        <Nav.Link href="/myplants/new">
          <Button>New Plant</Button>
        </Nav.Link>
      </Nav>
    </Navbar>
    <Router />
  </>
);

export default App;
