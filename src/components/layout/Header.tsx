import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Layout, Users, LogIn } from 'lucide-react';

const Header: React.FC = () => (
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
        <NavLink 
          to="/auth" 
          className={({ isActive }) => 
            `header__link${isActive ? ' header__link--active' : ''}`
          }
        >
          <LogIn size={20} />
          <span>Sign In</span>
        </NavLink>
      </div>
    </nav>
  </header>
);

export default Header;