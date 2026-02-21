import { Container, Row, Col, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import Notification from '../components/Notification';
import log from 'electron-log/renderer';

const logger = log.scope("CataloguePage");

const CataloguePage = () => {
  logger.silly("Page loaded");
  const { t } = useTranslation();

  // Data //
  const [catalogueData, setCatalogueData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Input form //
  const [productName, setProductName] = useState('');
  const [calories, setCalories] = useState('');
  const [unit, setUnit] = useState('100g');

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
      const data = await window.dbmgr.call("fetchCatalogue");
      setCatalogueData(data || []);
    } catch (error) {
      console.error('Error fetching catalogue:', error);
      setCatalogueData([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles the addition of a new item to the catalogue.
   */
  const handleAddItem = async () => {
    if (!productName.trim() || !calories.trim()) {
      setNotification({ message: t('pages.catalogue.notification_missing_fields'), type: 'danger' });
      return;
    }

    try {
      await window.dbmgr.call("addCatalogueItem", productName.trim(), parseFloat(calories), unit);
      
      // Clear form
      setProductName('');
      setCalories('');
      setUnit('100g');
      
      setNotification({ message: t('pages.catalogue.notification_item_added'), type: 'success' });

      await fetchData();
    } catch (error) {
      console.error('Error adding item:', error);
      setNotification({ message: t('pages.catalogue.notification_adding_item_failed'), type: 'danger' });
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
            <h1>{t('navigation.catalogue')}</h1>
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
          <div className="p-3 border rounded bg-light">
            <div className="row g-3">
              <div className="col-md-4">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder={t('pages.catalogue.input_name')}
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder={t('common.calories')}
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <select 
                  className="form-select"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                >
                  <option value="100g">{t('common.unit_100g')}</option>
                  <option value="portion">{t('common.unit_portion')}</option>
                </select>
              </div>
              <div className="col-md-2">
                <button 
                  type="button" 
                  className="btn btn-orange w-100"
                  onClick={handleAddItem}
                >
                  {t('common.button_add')}
                </button>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>{t('pages.catalogue.input_name')}</th>
                <th>{t('common.calories')}</th>
                <th>{t('common.unit')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center">Loading...</td>
                </tr>
              ) : catalogueData.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">No products found</td>
                </tr>
              ) : (
                catalogueData.map((item) => (
                  <tr key={item.item_id}>
                    <td>{item.name || 'N/A'}</td>
                    <td>{item.kcal_per_unit || 'N/A'}</td>
                    <td>{item.unit || 'N/A'}</td>
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

export default CataloguePage;
