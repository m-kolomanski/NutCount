import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const TodayPage = () => {
  const { t } = useTranslation();

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h1>{t('navigation.today')}</h1>
        </Col>
      </Row>
    </Container>
  );
};

export default TodayPage;
