import React from 'react';
import { Container, Row, Col, Card, Form, Button, ButtonGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import flagEn from '../assets/flag-en.svg';
import flagPl from '../assets/flag-pl.svg';

const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const { theme, changeTheme } = useTheme();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const getThemeIcon = (themeName) => {
    switch (themeName) {
      case 'light':
        return 'bi-sun';
      case 'dark':
        return 'bi-moon';
      default:
        return 'bi-circle-half';
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h1 className="mb-4">{t('navigation.settings')}</h1>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-gear me-2"></i>
                {t('settings.general')}
              </h5>
            </Card.Header>
            <Card.Body>
              <Row className="mb-4">
                <Col md={3}>
                  <Form.Label className="fw-bold">
                    <i className="bi bi-translate me-2"></i>
                    {t('settings.language')}
                  </Form.Label>
                </Col>
                <Col md={6}>
                  <ButtonGroup className="w-100">
                    <Button
                      variant={i18n.language === 'en' ? 'primary' : 'outline-primary'}
                      onClick={() => changeLanguage('en')}
                      className="d-flex align-items-center justify-content-center"
                    >
                      <img src={flagEn} width="20" height="15" className="me-2" alt="EN" />
                      {t('settings.english')}
                    </Button>
                    <Button
                      variant={i18n.language === 'pl' ? 'primary' : 'outline-primary'}
                      onClick={() => changeLanguage('pl')}
                      className="d-flex align-items-center justify-content-center"
                    >
                      <img src={flagPl} width="20" height="15" className="me-2" alt="PL" />
                      {t('settings.polish')}
                    </Button>
                  </ButtonGroup>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-eye me-2"></i>
                {t('settings.appearance')}
              </h5>
            </Card.Header>
            <Card.Body>
                <Row className="mb-3">
                <Col md={3}>
                  <Form.Label className="fw-bold">
                    <i className="bi bi-palette me-2"></i>
                    {t('settings.theme')}
                  </Form.Label>
                  <div className="text-muted small">
                    {t('settings.theme_description')}
                  </div>
                </Col>
                <Col md={6}>
                  <ButtonGroup className="w-100">
                    <Button
                      variant={theme === 'light' ? 'primary' : 'outline-primary'}
                      onClick={() => changeTheme('light')}
                      className="d-flex align-items-center justify-content-center"
                    >
                      <i className={`bi ${getThemeIcon('light')} me-2`}></i>
                      {t('settings.light')}
                    </Button>
                    <Button
                      variant={theme === 'dark' ? 'primary' : 'outline-primary'}
                      onClick={() => changeTheme('dark')}
                      className="d-flex align-items-center justify-content-center"
                    >
                      <i className={`bi ${getThemeIcon('dark')} me-2`}></i>
                      {t('settings.dark')}
                    </Button>
                    <Button
                      variant={theme === 'auto' ? 'primary' : 'outline-primary'}
                      onClick={() => changeTheme('auto')}
                      className="d-flex align-items-center justify-content-center"
                    >
                      <i className={`bi ${getThemeIcon('auto')} me-2`}></i>
                      {t('settings.auto')}
                    </Button>
                  </ButtonGroup>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SettingsPage;
