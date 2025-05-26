import React from 'react';
import { observer } from 'mobx-react-lite';
import { userStore } from '../../stores/UserStore';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Navbar.css';
import { AiFillHome } from 'react-icons/ai';
import { AiOutlineUser } from 'react-icons/ai';



const Navbar = observer(() => {
  const navigate = useNavigate();

  const handleLogout = () => {
    userStore.logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="nav-icon-link" title="Početna"><AiFillHome size={24} /></Link>
        <Link to="/sjednice" className="nav-link">E-Sjednica</Link>

      </div>
      <div className="navbar-right">
        {userStore.isLoggedIn ? (
          <>
            <span className="user-info">
              <AiOutlineUser size={18} style={{ marginRight: '6px' }} />
              {userStore.user.ime} {userStore.user.prezime}
            </span>
            <button onClick={handleLogout} className="nav-btn">Odjava</button>
          </>
        ) : (
          <>
            <Link to="/prijava" className="nav-link">Prijava</Link>
            <Link to="/registracija" className="nav-link">Registracija</Link>
          </>
        )}
      </div>
    </nav>
  );
});

export default Navbar;
