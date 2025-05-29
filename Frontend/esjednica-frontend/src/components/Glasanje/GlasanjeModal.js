import React, { useEffect, useState } from 'react';
import { glasanjeStore } from '../../stores/GlasanjeStore';
import { observer } from 'mobx-react-lite';

const GlasanjeModal = observer(({ tockaId, onClose }) => {
  const [preostalo, setPreostalo] = useState(null);
  const [izabraniGlas, setIzabraniGlas] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const start = new Date(glasanjeStore.start).getTime();
      const end = start + glasanjeStore.trajanje * 1000;
      const now = Date.now();
      const remaining = Math.floor((end - now) / 1000);

      if (remaining <= 0) {
        setPreostalo(0);
        clearInterval(interval);
        onClose();
      } else {
        setPreostalo(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [glasanjeStore.start, glasanjeStore.trajanje, onClose]);

  const handleGlasaj = async () => {
    if (!izabraniGlas) return;

    await glasanjeStore.glasaj(tockaId, { glas: izabraniGlas });
    onClose();
  };
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Glasanje</h3>

        {preostalo !== null && (
          <p className="modal-timer">Preostalo vrijeme: <strong>{preostalo}s</strong></p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px 0' }}>
          <button
            className={`btn-table edit ${izabraniGlas === 'ZA' ? 'active' : ''}`}
            onClick={() => setIzabraniGlas('ZA')}
          >
            ZA
          </button>
          <button
            className={`btn-table edit ${izabraniGlas === 'PROTIV' ? 'active' : ''}`}
            onClick={() => setIzabraniGlas('PROTIV')}
          >
            PROTIV
          </button>
          <button
            className={`btn-table edit ${izabraniGlas === 'SUZDRŽAN' ? 'active' : ''}`}
            onClick={() => setIzabraniGlas('SUZDRŽAN')}
          >
            SUZDRŽAN
          </button>
        </div>

        <div>
          <button className="add-button" style={{ marginTop: '20px' }} disabled={!izabraniGlas} onClick={handleGlasaj}>
            Glasaj
          </button>
          <button className="close-modal" onClick={onClose}>✖</button>
        </div>
      </div>
    </div>
  );
});

export default GlasanjeModal;
