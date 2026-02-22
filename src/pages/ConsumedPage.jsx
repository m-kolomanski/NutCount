import { Container, Table, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import Notification from '../components/Notification';
import log from 'electron-log/renderer';

const logger = log.scope("ConsumedPage");

const ConsumedPage = () => {
  const { t } = useTranslation();

  // Data //
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [consumedData, setConsumedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catalogueData, setCatalogueData] = useState([]);

  // Input form //
  const [productName, setProductName] = useState('');
  const [amount, setAmount] = useState('');

  // Notification //
  const [notification, setNotification] = useState({ message: null, type: 'info' });

  // Initial data load //
  useEffect(() => { 
    fetchData(); 
  }, [date]);

  /**
   * Fetches the catalogue data from the database and updates the state.
   */
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await window.dbmgr.call("fetchConsumed", date);
      setConsumedData(data || []);

      const catalogue_data = await window.dbmgr.call("fetchCatalogue", true)
        .then((data) => {
          return data.map(item => ({value: item.item_id, label: item.name}))
        });

      setCatalogueData(catalogue_data || [])
    } catch (error) {
      console.error('Error fetching catalogue:', error);
      setConsumedData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    logger.debug(`Adding item ${productName} | ${amount}`);

    const date = new Date().toISOString().split('T')[0];
    await window.dbmgr.call("addConsumedItem", date, productName, amount);
    fetchData();
  }

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
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-control"
          />
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
      <Row className = "p-3 border rounded bg-light">
        <Col xs={6}>
          <Row>
            <Select
              options={catalogueData || ''}
              value={catalogueData.find(option => option.value === productName) || ''}
              onChange={(e) => setProductName(e.value || '')}
              placeholder="Select a product..."
            />
          </Row>
          <Row>
            <Col xs={6}>
              <input
                type="text"
                className="form-control"
                placeholder="ilość"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              >          
              </input>
            </Col>
            <Col xs={6}>
              <button
                type="button"
                className="btn btn-orange w-100"
                onClick={handleAddItem}
              >
                {t("common.button_add")}
              </button>
            </Col>
          </Row>
        </Col>
        <Col xs={1}>
        </Col>
        <Col xs={1}>
          Spalone orzeszki
        </Col>
        <Col xs={1}>
          Planowany deficit
        </Col>
        <Col xs={1}>
          Pozostało orzeszków
        </Col>
        <Col xs={2}>
          Kalkulator
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