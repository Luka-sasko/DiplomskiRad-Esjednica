import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { tockaStore } from '../../stores/TockaStore';

const TockaForm = observer(({ tocka, sjednicaId, onSuccess }) => {
  const [form, setForm] = useState({
    naziv: '',
    opis: ''
  });
  

  useEffect(() => {
    if (tocka) {
      setForm({
        naziv: tocka.naziv || '',
        opis: tocka.opis || ''
      });
    } else {
      setForm({ naziv: '', opis: '' });
    }
  }, [tocka]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (tocka) {
      await tockaStore.update(tocka.id, { ...form, sjednicaId });
    } else {
      await tockaStore.add(sjednicaId,{ ...form, sjednicaId });
    }

    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="sjednica-form">
      <h3>{tocka ? 'Uredi točku' : 'Dodaj novu točku'}</h3>
      <input
        type="text"
        name="naziv"
        placeholder="Naziv točke"
        value={form.naziv}
        onChange={handleChange}
        required
      />
      <textarea
        name="opis"
        placeholder="Opis točke"
        value={form.opis}
        onChange={handleChange}
        rows={3}
      />
      <button type="submit">{tocka ? 'Spremi promjene' : 'Dodaj točku'}</button>
    </form>
  );
});

export default TockaForm;
