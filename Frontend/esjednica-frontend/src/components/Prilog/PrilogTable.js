import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { prilogStore } from '../../stores/PrilogStore';

const PrilogTable = observer(({ tockaId }) => {
    const [showForm, setShowForm] = useState(false);
    const [fileName, setFileName] = useState('');


    useEffect(() => {
        prilogStore.fetchByTockaId(tockaId);
    }, [tockaId]);

    const handleUpload = async (file) => {
    if (!file) return alert('Odaberi datoteku');

    const allowedExtensions = ['pdf', 'doc', 'docx', 'xlsx', 'xls', 'txt', 'csv', 'json', 'jpg', 'jpeg', 'png'];
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
        return alert('Nepodržani format datoteke.');
    }

    const formData = new FormData();
    formData.append('file', file);
    await prilogStore.upload(tockaId, formData);
    setFileName('');
};



    return (
        <div style={{ marginTop: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Prilozi</h2>
                <button type="button" className="add-button" onClick={() => { setShowForm(!showForm); setFileName(''); }}>
                    {showForm ? '✖ Zatvori formu' : '📎 Dodaj novi prilog'}
                </button>
            </div>

            {showForm && (
                <div style={{ margin: '20px 0' }}>
                    <label htmlFor="file-upload" className="file-upload">
                        📁 Odaberi datoteku
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        name="file"
                        accept=".pdf,.doc,.docx,.xlsx,.xls,.txt,.csv,.json,.png,.jpg,.jpeg"
                        hidden
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setFileName(file.name);
                                handleUpload(file);
                            }
                        }}
                    />

                    {fileName && <span className="filename-upload">{fileName}</span>}
                </div>
            )}


            {prilogStore.loading ? (
                <p style={{ fontStyle: 'italic', color: '#777' }}>⏳ Učitavanje...</p>
            ) : prilogStore.prilozi.length === 0 ? (
                <p>Nema priloga.</p>
            ) : (
                <table className="sjednica-table">
                    <thead>
                        <tr>
                            <th>Naziv</th>
                            <th>Akcije</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prilogStore.prilozi.map((prilog) => (
                            <tr key={prilog.id}>
                                <td>{prilog.naziv}</td>
                                <td>
                                    <button className="btn-table edit" onClick={() => prilogStore.download(prilog.id)}>
                                        ⬇️ Preuzmi
                                    </button>
                                    <button
                                        className="btn-table delete"
                                        style={{ marginLeft: '10px' }}
                                        onClick={() => {
                                            if (window.confirm('Obrisati prilog?')) {
                                                prilogStore.delete(prilog.id, tockaId);
                                            }
                                        }}
                                    >
                                        🗑 Obriši
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
});

export default PrilogTable;
