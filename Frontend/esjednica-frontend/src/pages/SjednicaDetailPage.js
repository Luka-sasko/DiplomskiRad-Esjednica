import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sjednicaStore } from '../stores/SjednicaStore';
import { tockaStore } from '../stores/TockaStore';
import SjednicaForm from '../components/Sjednica/SjednicaForm';
import TockaForm from '../components/Tocka/TockaForm';
import '../styles/SjednicaPage.css';
import { FaSortUp, FaSortDown } from 'react-icons/fa';
import { observer } from 'mobx-react-lite';


const SjednicaDetailPage = observer(() => {
  const { id } = useParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTocka, setSelectedTocka] = useState(null);
  const [isAddTockaModalOpen, setIsAddTockaModalOpen] = useState(false);
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState('naziv');
  const [sortAsc, setSortAsc] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');



  useEffect(() => {
    const fetchData = async () => {
      await sjednicaStore.getById(id);
      await tockaStore.fetchBySjednicaId(id);

    };
    fetchData();
  }, [id]);

  if (!sjednicaStore.sjednica) return <p>Učitavanje...</p>;

  const sortedTocke = [...tockaStore.tocke].sort((a, b) => {
    const aVal = a[sortKey]?.toLowerCase?.() || a[sortKey];
    const bVal = b[sortKey]?.toLowerCase?.() || b[sortKey];
    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    if (key === sortKey) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const renderSortIcon = (key) => {
    if (sortKey !== key) return null;
    return sortAsc ? <FaSortUp style={{ marginLeft: '6px' }} /> : <FaSortDown style={{ marginLeft: '6px' }} />;
  };


  return (
    <div className="sjednice-container">
      <div className="sjednice-header" style={{ display: 'grid', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>{sjednicaStore.sjednica.naziv}</h2>
        {isAdmin && (
          <button className="add-button" style={{ display: "inline - flex", alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setIsEditModalOpen(true)}>✏️ Uredi sjednicu</button>
        )}
      </div >

      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setIsEditModalOpen(false)}>✖</button>
            <SjednicaForm sjednica={sjednicaStore.sjednica} onSuccess={() => setIsEditModalOpen(false)} />
          </div>
        </div>
      )}

      {
        (selectedTocka || isAddTockaModalOpen) && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-modal" onClick={() => { setSelectedTocka(null); setIsAddTockaModalOpen(false); }}>✖</button>
              <TockaForm
                tocka={selectedTocka}
                sjednicaId={id}
                onSuccess={async () => {
                  await tockaStore.fetchBySjednicaId(id);
                  setSelectedTocka(null);
                  setIsAddTockaModalOpen(false);
                }}
              />
            </div>
          </div>
        )
      }
      <div className='tocke-sjednice-wrapper'>
        <div className="sjednice-header" style={{ marginTop: '30px' }}>
          <h3>Točke sjednice</h3>
          {isAdmin && (
            <button className="add-button" onClick={() => setIsAddTockaModalOpen(true)}>➕ Dodaj točku</button>
          )}
        </div>

        <div className="sjednica-table-wrapper">
          <table className="sjednica-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('naziv')}>
                  Naziv {renderSortIcon('naziv')}
                </th>
                <th onClick={() => handleSort('opis')}>
                  Opis{renderSortIcon('opis')}
                </th>
                {isAdmin ? 
                  <th>Akcije</th> : null
                }
              </tr>
            </thead>
            <tbody>
              {sortedTocke.map(t => (
                <tr key={t.id} onClick={() => navigate(`/sjednice/${id}/tocke/${t.id}`)} style={{ cursor: 'pointer' }}>
                  <td>{t.naziv}</td>
                  <td>{t.opis}</td>
                  {isAdmin ? (
                    <td onClick={(e) => e.stopPropagation()}>
                      <div>
                        <button className="btn-table edit" onClick={() => setSelectedTocka(t)}>Uredi</button>
                        <button className="btn-table delete" onClick={async () => {
                          if (window.confirm('Obrisati točku?')) {
                            await tockaStore.delete(t.id);
                            await tockaStore.fetchBySjednicaId(id);
                          }
                        }}>Obriši</button>
                      </div>
                    </td>) : null}
                </tr>

              ))}
            </tbody>
          </table>
        </div>
      </div >
    </div>
  );
});

export default SjednicaDetailPage;
