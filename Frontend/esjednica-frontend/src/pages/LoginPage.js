import React from "react";
import LoginForm from "../components/Login_Register/LoginForm";
import "../styles/AuthPage.css";

const LoginPage = () => {
  return (
    <div className="auth-container">
      <h1>Prijava</h1>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
