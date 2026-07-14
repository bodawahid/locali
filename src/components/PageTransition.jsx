import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function PageTransition({ children }) {
  const location = useLocation();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(false);
    const t = requestAnimationFrame(() => {
      setVisible(true);
    });
    return () => cancelAnimationFrame(t);
  }, [location.pathname]);

  return (
    <div
      className={`page-transition ${visible ? 'page-transition-in' : 'page-transition-out'}`}
      key={location.pathname}
    >
      {children}
    </div>
  );
}
