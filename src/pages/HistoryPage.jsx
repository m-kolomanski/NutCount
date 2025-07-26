import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const HistoryPage = () => {
  const { t } = useTranslation();

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h1>{t('navigation.history')}</h1>
        </Col>
      </Row>
    </Container>
  );
};

export default HistoryPage;
