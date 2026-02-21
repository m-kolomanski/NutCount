import { Container, Table, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import Notification from '../components/Notification';

const ConsumedPage = () => {
  const { t } = useTranslation();

  // Data //
  const [consumedData, setConsumedData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Notification //
  const [notification, setNotification] = useState({ message: null, type: 'info' });

  // Initial data load //
  useEffect(() => { fetchData(); }, []);

  /**
   * Fetches the catalogue data from the database and updates the state.
   */
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await window.dbmgr.call("fetchConsumed", "2026-01-01");
      setConsumedData(data || []);
    } catch (error) {
      console.error('Error fetching catalogue:', error);
      setConsumedData([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles the editing of an existing item in the catalogue.
   */
  const handleEditItem = () => {
    setNotification({ message: 'Editing products is not implemented yet', type: 'warning' });
  };

  /**
   * Clears notification message.
   */
  const clearNotification = () => {
    setNotification({ message: null, type: 'info' });
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h1>{t('navigation.consumed')}</h1>
          <button onClick={() => window.dbmgr.call("addConsumedItem", "2026-01-01", 50, 50 * 1.23, 1)}>Test</button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Notification 
            message={notification.message} 
            type={notification.type} 
            onClear={clearNotification}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          // Widget container
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>HK Nazwa</th>
                <th>HK Ilosc</th>
                <th>Kcal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center">Loading...</td>
                </tr>
              ) : consumedData.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">No products found</td>
                </tr>
              ) : (
                consumedData.map((item) => (
                  <tr key={item.item_id}>
                    <td>{item.name || 'N/A'}</td>
                    <td>{item.total_amount || 'N/A'}</td>
                    <td>{item.total_kcal || 'N/A'}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-secondary me-2"
                        onClick={handleEditItem}
                      >
                        {t('common.button_action')}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default ConsumedPage;