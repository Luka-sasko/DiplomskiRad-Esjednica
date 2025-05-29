import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { glasanjeStore } from '../../stores/GlasanjeStore';
import { tockaStore } from '../../stores/TockaStore';
import { korisnikGlasanjeStore } from '../../stores/KorisnikGlasanjeStore';
import GlasanjeModal from './GlasanjeModal';
import RezultatiChart from './RezultatiChart';
import useWebSocket from '../../api/useWebSocket';


const GlasanjeBox = observer(({ tocka }) => {
    const [showModal, setShowModal] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user?.roles?.includes('ROLE_ADMIN');

    useWebSocket((event) => {
        if (event.aktivno && event.tockaId === tocka.id) {
            glasanjeStore.getStatus(tocka.id);
            tockaStore.getById(tocka.id);
            korisnikGlasanjeStore.provjeriJeLiGlasao(tocka.id);
        }
    });


    useEffect(() => {
        const init = async () => {
            await glasanjeStore.getStatus(tocka.id);
            await glasanjeStore.loadRezultati(tocka.id);
            await korisnikGlasanjeStore.provjeriJeLiGlasao(tocka.id);

            if (tocka.glasanjeStart && tocka.glasanjeTrajanje) {
                korisnikGlasanjeStore.startCountdown(
                    tocka.glasanjeStart,
                    tocka.glasanjeTrajanje,
                    async () => {
                        await glasanjeStore.getStatus(tocka.id);
                        await glasanjeStore.loadRezultati(tocka.id);
                    }
                );
            }
        };

        init();
        return () => korisnikGlasanjeStore.stopCountdown();
    }, [tocka.id]);

    useEffect(() => {
        const interval = setInterval(async () => {
            await glasanjeStore.getStatus(tocka.id);
            await glasanjeStore.loadRezultati(tocka.id);
            if (glasanjeStore.aktivno && !korisnikGlasanjeStore.preostaloVrijeme) {
                await tockaStore.getById(tocka.id);
                korisnikGlasanjeStore.startCountdown(
                    tockaStore.tocka.glasanjeStart,
                    tockaStore.tocka.glasanjeTrajanje
                );
            }
        }, glasanjeStore.aktivno ? 5000 : 15000);

        return () => clearInterval(interval);
    }, [tocka.id]);

    const handlePokreniGlasanje = async () => {
        const trajanje = prompt('Unesi trajanje glasanja u sekundama:');
        if (trajanje) {
            await glasanjeStore.start(tocka.id, parseInt(trajanje));
            await glasanjeStore.getStatus(tocka.id);
            await tockaStore.getById(tocka.id);
            korisnikGlasanjeStore.startCountdown(
                tockaStore.tocka.glasanjeStart,
                tockaStore.tocka.glasanjeTrajanje
            );
            await glasanjeStore.loadRezultati(tocka.id);
            await korisnikGlasanjeStore.provjeriJeLiGlasao(tocka.id);
        }
    };

    return (
        <div className="glasanje-box" style={{ margin: '30px 0' }}>
            <h2>Glasanje</h2>

            {isAdmin && !glasanjeStore.aktivno && (
                <button className="add-button" onClick={handlePokreniGlasanje}>
                    🚦 Započni glasanje
                </button>
            )}

            {glasanjeStore.aktivno ? (
                <>
                    <p><strong>Preostalo vrijeme za glasanje:</strong> {korisnikGlasanjeStore.preostaloVrijeme} s</p>
                    {!korisnikGlasanjeStore.jeGlasao ? (
                        <button className="add-button" onClick={() => setShowModal(true)}>
                            🗳️ Glasaj
                        </button>
                    ) : (
                        <p><em>Glasanje evidentirano za ovaj račun.</em></p>
                    )}
                </>
            ) : (
                <div style={{ marginTop: '10px' }}>
                    <p><strong>ZA:</strong> {glasanjeStore.rezultati.ZA || 0}</p>
                    <p><strong>PROTIV:</strong> {glasanjeStore.rezultati.PROTIV || 0}</p>
                    <p><strong>SUZDRŽAN:</strong> {glasanjeStore.rezultati.SUZDRŽAN || 0}</p>
                    <RezultatiChart />
                </div>
            )}

            {showModal && (
                <GlasanjeModal
                    tockaId={tocka.id}
                    onClose={() => setShowModal(false)}
                    onGlasano={async () => {
                        await korisnikGlasanjeStore.provjeriJeLiGlasao(tocka.id);
                        await glasanjeStore.loadRezultati(tocka.id);
                        setShowModal(false);
                    }}
                />
            )}
        </div>
    );
});

export default GlasanjeBox;
