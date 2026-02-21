import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { LinkContainer } from 'react-router-bootstrap';
import logo from '../assets/logo.png';

const AppNavbar = () => {
  const { t } = useTranslation();

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-0">
      <Container>
        <Navbar.Brand href="/">
          <img 
            src={logo} 
            width="30" 
            height="30" 
            className="d-inline-block align-top me-2" 
            alt="NutCount Logo"
          />
          {t('app.title')}
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/consumed">
              <Nav.Link>
                <i className="bi bi-calendar-day me-1"></i>
                {t('navigation.consumed')}
              </Nav.Link>
            </LinkContainer>
            
            <LinkContainer to="/catalogue">
              <Nav.Link>
                <i className="bi bi-collection me-1"></i>
                {t('navigation.catalogue')}
              </Nav.Link>
            </LinkContainer>
            
            <LinkContainer to="/dishes">
              <Nav.Link>
                <i className="bi bi-book me-1"></i>
                {t('navigation.dishes')}
              </Nav.Link>
            </LinkContainer>
            
            <LinkContainer to="/history">
              <Nav.Link>
                <i className="bi bi-clock-history me-1"></i>
                {t('navigation.history')}
              </Nav.Link>
            </LinkContainer>
            
            <LinkContainer to="/settings">
              <Nav.Link>
                <i className="bi bi-gear me-1"></i>
                {t('navigation.settings')}
              </Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
