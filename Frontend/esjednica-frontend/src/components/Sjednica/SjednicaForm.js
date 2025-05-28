import React, { useState } from 'react';
import { sjednicaStore } from '../../stores/SjednicaStore';

const SjednicaForm = ({ onSuccess, sjednica }) => {
  const [form, setForm] = useState({
    naziv: sjednica?.naziv || '',
    opis: sjednica?.opis || '',
    datumOdrzavanja: sjednica ? sjednica.datumOdrzavanja.slice(0, 16) : '',
    lokacija: sjednica?.lokacija || ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };



  const validate = () => {
    const err = {};
    if (!form.naziv.trim()) err.naziv = 'Naziv je obavezan';
    if (!form.opis.trim()) err.opis = 'Opis je obavezan';
    if (!form.lokacija.trim()) err.lokacija = 'Lokacija je obavezna';
    if (!form.datumOdrzavanja) {
      err.datumOdrzavanja = 'Datum je obavezan';
    } else {
      const selected = new Date(form.datumOdrzavanja);
      const now = new Date();
      if (selected < now) err.datumOdrzavanja = 'Datum mora biti u budućnosti';
    }
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const isoFormat = new Date(form.datumOdrzavanja).toISOString().slice(0, 19);

    const sjednicaZaSlanje = {
      naziv: form.naziv,
      opis: form.opis,
      datumOdrzavanja: isoFormat,
      lokacija: form.lokacija
    };

    if (sjednica) {
      await sjednicaStore.update(sjednica.id, sjednicaZaSlanje);
    } else {
      await sjednicaStore.add(sjednicaZaSlanje);
    }

    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="sjednica-form">
      <input name="naziv" placeholder="Naziv" value={form.naziv} onChange={handleChange} required />
      {errors.naziv && <p className="error-text">{errors.naziv}</p>}

      <input name="opis" placeholder="Opis" value={form.opis} onChange={handleChange} required />
      {errors.opis && <p className="error-text">{errors.opis}</p>}

      <input name="datumOdrzavanja" type="datetime-local" value={form.datumOdrzavanja} onChange={handleChange} required />
      {errors.datumOdrzavanja && <p className="error-text">{errors.datumOdrzavanja}</p>}

      <input name="lokacija" placeholder="Lokacija" value={form.lokacija} onChange={handleChange} required />
      {errors.lokacija && <p className="error-text">{errors.lokacija}</p>}

      <button type="submit">{sjednica ? 'Spremi promjene' : 'Dodaj sjednicu'}</button>
    </form>
  );
};

export default SjednicaForm;
