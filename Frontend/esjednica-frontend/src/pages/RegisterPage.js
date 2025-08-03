import React from "react";
import RegisterForm from "../components/Login_Register/RegisterForm";
import "../styles/AuthPage.css";

const RegisterPage = () => {
  return (
    <div className="auth-container">
      <h1>Registracija</h1>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
