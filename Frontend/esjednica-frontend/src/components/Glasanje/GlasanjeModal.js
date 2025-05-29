import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { glasanjeStore } from '../../stores/GlasanjeStore';
import { korisnikGlasanjeStore } from '../../stores/KorisnikGlasanjeStore';

const GlasanjeModal = observer(({ tockaId, onClose, onGlasano }) => {
    const [selected, setSelected] = useState('');

    const handleSubmit = async () => {
        if (selected && !korisnikGlasanjeStore.jeGlasao && korisnikGlasanjeStore.preostaloVrijeme > 0) {
            await glasanjeStore.glasaj(tockaId, { glas: selected });
            await korisnikGlasanjeStore.provjeriJeLiGlasao(tockaId);
            await glasanjeStore.loadRezultati(tockaId);
            await onGlasano?.();
        }
    };

    const glasOptions = ['ZA', 'PROTIV', 'SUZDRŽAN'];

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Odaberi svoj glas</h3>

                {korisnikGlasanjeStore.preostaloVrijeme !== null && (
                    <p style={{ marginBottom: '10px' }}>
                        Preostalo vrijeme: <strong>{korisnikGlasanjeStore.preostaloVrijeme} s</strong>
                    </p>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px 0' }}>
                    {glasOptions.map(option => (
                        <button
                            key={option}
                            className={`btn-table edit ${selected === option ? 'active' : ''}`}
                            onClick={() => setSelected(option)}
                            disabled={korisnikGlasanjeStore.jeGlasao || korisnikGlasanjeStore.preostaloVrijeme <= 0}
                            style={{
                                backgroundColor: selected === option ? '#0a58ca' : '',
                                opacity: korisnikGlasanjeStore.jeGlasao ? 0.6 : 1
                            }}
                        >
                            {option === 'ZA' ? '✅' : option === 'PROTIV' ? '❌' : '🤔'} {option}
                        </button>
                    ))}
                </div>

                <div>
                    {!korisnikGlasanjeStore.jeGlasao && korisnikGlasanjeStore.preostaloVrijeme > 0 && (
                        <button className="add-button" onClick={handleSubmit} disabled={!selected}>
                            Potvrdi glas
                        </button>
                    )}
                    <button className="close-modal" onClick={onClose}>✖</button>
                </div>
            </div>
        </div>
    );
});

export default GlasanjeModal;
