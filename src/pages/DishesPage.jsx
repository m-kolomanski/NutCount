import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import log from 'electron-log/renderer';

const logger = log.scope("DishesPage");

const DishesPage = () => {
  logger.silly("Page loaded")
  const { t } = useTranslation();

  return (
    <Container className="mt-4">
      <Row>
        <h1 className="page-header">{t('navigation.dishes')}</h1>
      </Row>
    </Container>
  );
};

export default DishesPage;
