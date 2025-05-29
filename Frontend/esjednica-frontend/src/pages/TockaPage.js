import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tockaStore } from '../stores/TockaStore';
import TockaForm from '../components/Tocka/TockaForm';
import GlasanjeBox from '../components/Glasanje/GlasanjeBox';
import '../styles/SjednicaPage.css';
import { observer } from 'mobx-react-lite';
import PrilogTable from '../components/Prilog/PrilogTable';
import { glasanjeStore } from '../stores/GlasanjeStore';

const TockaPage = observer(() => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tocka, setTocka] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user?.roles?.includes('ROLE_ADMIN');

    useEffect(() => {
        const fetch = async () => {
            await tockaStore.getById(id);
            setTocka(tockaStore.tocka);
        };
        fetch();
    }, [id]);

    const handleRefresh = async () => {
        const data = await tockaStore.getById(id);
        setTocka(data);
    };

    if (!tocka) return <p>Učitavanje točke...</p>;

    return (
        <div>
            <button className="return-button" onClick={() => navigate(`/sjednice/${tocka.sjednicaId}`)}>← Vrati se na sjednicu</button>
            <div className="sjednice-container">
                <div className="sjednice-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Detalji točke</h2>
                    {isAdmin && (
                        <button className="add-button" onClick={() => setIsEditModalOpen(true)} style={{ marginLeft: '10px' }}> ✏️ Uredi točku</button>
                    )}
                </div>

                {isEditModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <button className="close-modal" onClick={() => setIsEditModalOpen(false)}>✖</button>
                            <TockaForm
                                tocka={tocka}
                                sjednicaId={tocka.sjednicaId}
                                onSuccess={() => {
                                    setIsEditModalOpen(false);
                                    handleRefresh();
                                }}
                            />
                        </div>
                    </div>
                )}

                <p><strong>Naziv:</strong> {tocka.naziv}</p>
                <p><strong>Opis:</strong> {tocka.opis}</p>

                <GlasanjeBox tocka={tockaStore.tocka} aktivno={glasanjeStore.aktivno} />
                <PrilogTable tockaId={tockaStore.tocka.id} />

            </div>

        </div>

    );

});

export default TockaPage;
