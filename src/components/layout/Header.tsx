// src/components/Header.tsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Layout, Users, LogIn, User } from 'lucide-react';
import { useUser } from '../../context/UserContext';

const Header: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleAvatarClick = () => {
    if (user) {
      navigate(`/user/${user.id}`);
    }
  };

  const handleNameClick = () => {
    if (user) {
      navigate(`/user/${user.id}`);
    }
  };

  return (
    <header className="header">
      <nav className="header__nav">
        <div className="header__nav-group header__nav-group--left">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `header__link header__link--round${isActive ? ' header__link--active' : ''}`
            }
            aria-label="Home"
          >
            <Home size={20} />
          </NavLink>
        </div>

        <div className="header__nav-group header__nav-group--right">
          <NavLink 
            to="/boards" 
            className={({ isActive }) => 
              `header__link${isActive ? ' header__link--active' : ''}`
            }
          >
            <Layout size={20} />
            <span>Boards</span>
          </NavLink>
          <NavLink 
            to="/users" 
            className={({ isActive }) => 
              `header__link${isActive ? ' header__link--active' : ''}`
            }
          >
            <Users size={20} />
            <span>Users</span>
          </NavLink>
          {user ? (
            <div className="header__user-info">
              <img 
                src={user.avatar || 'https://via.placeholder.com/150 '} 
                alt={`${user.name}'s avatar`} 
                className="header__user-avatar" 
                onClick={handleAvatarClick} 
              />
              <span className="header__user-name" onClick={handleNameClick}>
                {user.name}
              </span>
            </div>
          ) : (
            <NavLink 
              to="/login" 
              className={({ isActive }) => 
                `header__link${isActive ? ' header__link--active' : ''}`
              }
            >
              <LogIn size={20} />
              <span>Sign In</span>
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;