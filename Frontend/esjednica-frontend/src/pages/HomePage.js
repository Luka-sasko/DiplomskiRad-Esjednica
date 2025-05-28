import React from 'react';
import '../styles/HomePage.css';

const HomePage = () => {

    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user?.roles?.includes('ROLE_ADMIN');

    
    return (
        <div className="home-container">
            <h1>Dobrodošli u E-Sjednicu</h1>
            <p>Digitalna platforma za vođenje elektroničkih sjednica, prijedloge, glasanja – brzo, sigurno i učinkovito.</p>

        </div>
    );
};

export default HomePage;
