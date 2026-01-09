import { useEffect } from 'react';

const Notification = ({ message, type, onClear }) => {
  const style = {
    minHeight: '58px',
    opacity: (message && type) ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out'
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        if (onClear) {
          onClear();
        }
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [message, onClear]);

  return (
    <div
      className={`alert alert-${type || 'info'}`}
      role="alert"
      style={style}
    >
      {message || '\u00A0'}
    </div>
  );
};

export default Notification;
