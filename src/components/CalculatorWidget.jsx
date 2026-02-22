import { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const CalculatorWidget = ({ onCaloriesChange }) => {
  const { t } = useTranslation();

  const [amount, setAmount] = useState(0);
  const [kcal, setKcal] = useState(0);
  const [calories, setCalories] = useState(0);

  useEffect(() => {
    const calculatedCalories = Math.ceil(amount * kcal / 100);
    setCalories(calculatedCalories);
    
    if (onCaloriesChange) {
      onCaloriesChange(calculatedCalories);
    }
  }, [amount, kcal])

  return (
    <Container>
      <Row>
        <h3>{t('common.calculator')}</h3>
      </Row>
      <Row>
        <input
          type="number" 
          className="form-control" 
          placeholder={`${t('common.amount')} (g)`}
          value={amount || ""}
          onChange={(e) => setAmount(e.target.value)}
        />
      </Row>
      <Row>
        <input
          type="number" 
          className="form-control" 
          placeholder={`${t('common.calories')}/100g`}
          value={kcal || ""}
          onChange={(e) => setKcal(e.target.value)}
        />
      </Row>
      <Row>
        <span>{calories ? `${calories} kcal` : ""}</span>
      </Row>
    </Container>
  )
}

export default CalculatorWidget;