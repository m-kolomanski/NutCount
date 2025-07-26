import React from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const CataloguePage = () => {
  const { t } = useTranslation();

  return (
    <Container className="mt-4">
      <Row>
        <Col>
            <h1>{t('navigation.catalogue')}</h1>
        </Col>
      </Row>
    </Container>
  );
};

export default CataloguePage;
