import React, { useState } from 'react';
import { userStore } from '../../stores/UserStore';
import { useNavigate } from 'react-router-dom';
import '../../styles/AuthForm.css';

const RegisterForm = () => {
    const [form, setForm] = useState({
        username: '',
        lozinka: '',
        ime: '',
        prezime: '',
        email: '',
        roles: 'ROLE_KORISNIK'
    });

    const [confirmLozinka, setConfirmLozinka] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleConfirmChange = (e) => {
        setConfirmLozinka(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.lozinka !== confirmLozinka) {
            alert('Lozinke se ne podudaraju.');
            return;
        }

        try {
            await userStore.register(form);
            await userStore.login({ username: form.username, lozinka: form.lozinka });
            navigate('/sjednice');
        } catch {
            alert('Greška pri registraciji ili logiranju.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <input name="username" placeholder="Korisničko ime" onChange={handleChange} required />
            <input name="lozinka" type="password" placeholder="Lozinka" onChange={handleChange} required />
            <input name="confirmLozinka" type="password" placeholder="Ponovi lozinku" onChange={handleConfirmChange} required />
            <input name="ime" placeholder="Ime" onChange={handleChange} required />
            <input name="prezime" placeholder="Prezime" onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
            <button type="submit">Registriraj se</button>

            <p className="switch-text">
                Već imate račun? <a href="/prijava">Prijavite se</a>
            </p>


        </form>
    );
};

export default RegisterForm;
