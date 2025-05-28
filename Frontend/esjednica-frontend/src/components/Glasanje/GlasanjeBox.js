import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { glasanjeStore } from '../../stores/GlasanjeStore';
import { korisnikGlasanjeStore } from '../../stores/KorisnikGlasanjeStore';
import GlasanjeModal from './GlasanjeModal';

const GlasanjeBox = observer(({ tocka }) => {
    const [showModal, setShowModal] = useState(false);
    const [glasanjeZavrseno, setGlasanjeZavrseno] = useState(false);
    const [flagGlasanje, setFlagGlasanje] = useState(false);
    const lokalnoGlasao = localStorage.getItem(`glasao_${tocka.id}`) === 'true';

    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user?.roles?.includes('ROLE_ADMIN');

    useEffect(() => {
        const init = async () => {
            await glasanjeStore.checkStatus(tocka.id);
            await glasanjeStore.loadRezultati(tocka.id);
            await korisnikGlasanjeStore.provjeriJeLiGlasao(tocka.id);

            if (tocka.glasanjeStart && tocka.glasanjeTrajanje) {
                korisnikGlasanjeStore.startCountdown(tocka.glasanjeStart, tocka.glasanjeTrajanje, async () => {
                    setGlasanjeZavrseno(true);
                    await glasanjeStore.checkStatus(tocka.id);
                    await glasanjeStore.loadRezultati(tocka.id);
                });
            }
        };

        init();
        return () => korisnikGlasanjeStore.stopCountdown();
    }, [tocka.id]);

    return (
        <div className="glasanje-box" style={{ margin: '30px 0' }}>
            <h2>Glasanje</h2>

            {isAdmin && !flagGlasanje && (
                <button
                    className="add-button"
                    onClick={async () => {
                        const trajanje = prompt('Unesi trajanje glasanja u sekundama:');
                        if (trajanje) {
                            await glasanjeStore.start(tocka.id, parseInt(trajanje));
                            window.location.reload();
                            setFlagGlasanje(true);
                        }
                    }}
                >
                    🚦 Započni glasanje
                </button>
            )}

            {glasanjeStore.aktivno && (
                <>
                    {korisnikGlasanjeStore.preostaloVrijeme !== null && (
                        <p><strong>Preostalo vrijeme za glasanje:</strong> {korisnikGlasanjeStore.preostaloVrijeme} s</p>
                    )}
                    {!korisnikGlasanjeStore.jeGlasao && !lokalnoGlasao ? (
                        <button className="add-button" onClick={() => setShowModal(true)}>
                            🗳️ Glasaj
                        </button>
                    ) : (
                        <p><em>Glasanje evidentirano za ovaj račun.</em></p>
                    )}



                </>
            )}

            {(glasanjeZavrseno || !glasanjeStore.aktivno) && (
                <div style={{ marginTop: '10px' }}>
                    <p><strong>ZA:</strong> {glasanjeStore.rezultati.ZA || 0}</p>
                    <p><strong>PROTIV:</strong> {glasanjeStore.rezultati.PROTIV || 0}</p>
                    <p><strong>SUZDRŽAN:</strong> {glasanjeStore.rezultati.SUZDRŽAN || 0}</p>
                </div>
            )}

            {showModal && (
                <GlasanjeModal
                    tockaId={tocka.id}
                    onClose={() => setShowModal(false)}
                    onGlasano={async () => {
                        // Osvježi podatke o korisniku i glasanju
                        await korisnikGlasanjeStore.provjeriJeLiGlasao(tocka.id);

                        // 🔁 Ponovno pokreni odbrojavanje jer korisnik je možda tek sada otvorio modal
                        if (tocka.glasanjeStart && tocka.glasanjeTrajanje) {
                            korisnikGlasanjeStore.startCountdown(
                                tocka.glasanjeStart,
                                tocka.glasanjeTrajanje,
                                async () => {
                                    setGlasanjeZavrseno(true);
                                    await glasanjeStore.checkStatus(tocka.id);
                                    await glasanjeStore.loadRezultati(tocka.id);
                                }
                            );
                        }

                        setShowModal(false);
                    }}
                />


            )}
        </div>
    );
});

export default GlasanjeBox;
