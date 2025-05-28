import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { glasanjeStore } from '../../stores/GlasanjeStore';
import { tockaStore } from '../../stores/TockaStore';
import { korisnikGlasanjeStore } from '../../stores/KorisnikGlasanjeStore';

const GlasanjeModal = observer(({ tockaId, onClose, onGlasano }) => {
    const [selected, setSelected] = useState('');
    const [disabled, setDisabled] = useState(false);
    

    useEffect(() => {
        const init = async () => {
            await korisnikGlasanjeStore.provjeriJeLiGlasao(tockaId);
            if (korisnikGlasanjeStore.jeGlasao) {
                setDisabled(true); 
            }

            const tocka = tockaStore.tocka;
            if (tocka.glasanjeStart && tocka.glasanjeTrajanje) {
                korisnikGlasanjeStore.startCountdown(tocka.glasanjeStart, tocka.glasanjeTrajanje, () => {
                    setDisabled(true); 
                    setTimeout(() => onClose(), 500);
                });
            }
        };

        init();
        return () => korisnikGlasanjeStore.stopCountdown();
    }, [tockaId, onClose]);

    const handleSubmit = async () => {
        if (!disabled && selected) {
            await glasanjeStore.glasaj(tockaId, selected);
            await glasanjeStore.loadRezultati(tockaId);
            await korisnikGlasanjeStore.provjeriJeLiGlasao(tockaId);
            setDisabled(true); 
            onGlasano?.(); 
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
                            onClick={() => !disabled && setSelected(option)}
                            disabled={disabled || korisnikGlasanjeStore.jeGlasao}
                            style={{
                                backgroundColor: selected === option ? '#0a58ca' : '',
                                opacity: disabled || korisnikGlasanjeStore.jeGlasao ? 0.6 : 1
                            }}
                        >
                            {option === 'ZA' ? '✅' : option === 'PROTIV' ? '❌' : '🤔'} {option}
                        </button>
                    ))}
                </div>

                <div>
                    {!disabled && !korisnikGlasanjeStore.jeGlasao && (
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
