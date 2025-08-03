import React, { useState } from "react";
import { userStore } from "../../stores/UserStore";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import "../../styles/AuthForm.css";

const LoginForm = observer(() => {
  const [form, setForm] = useState({ username: "", lozinka: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userStore.login(form);
      navigate("/sjednice");
    } catch {
      alert("Neispravni podaci.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <input
        name="username"
        placeholder="Korisničko ime"
        onChange={handleChange}
        required
      />
      <input
        name="lozinka"
        type="password"
        placeholder="Lozinka"
        onChange={handleChange}
        required
      />
      <button type="submit">Prijavi se</button>

      <p className="switch-text">
        Nemate račun? <a href="/registracija">Registrirajte se</a>
      </p>
    </form>
  );
});

export default LoginForm;
