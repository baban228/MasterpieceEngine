// src/pages/Register.tsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import '../styles/pages/register.css'; // Импорт CSS файла

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: ''
  });

  const { login } = useUser();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    validateField(name, value);
  };

  const validateField = (fieldName: string, value: string) => {
    let errorMessage = '';

    switch (fieldName) {
      case 'name':
        if (!value) {
          errorMessage = 'Имя обязательно';
        }
        break;
      case 'email':
        if (!value) {
          errorMessage = 'Email обязателен';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          errorMessage = 'Неверный формат Email';
        }
        break;
      case 'password':
        if (!value) {
          errorMessage = 'Пароль обязателен';
        } else if (value.length < 6) {
          errorMessage = 'Пароль должен быть не менее 6 символов';
        }
        break;
      default:
        break;
    }

    setErrors({
      ...errors,
      [fieldName]: errorMessage
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Здесь должна быть логика регистрации пользователя на сервере
    // Для примера мы просто вызовем login с данными формы
    login({ name: formData.name, email: formData.email });
    navigate('/');
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2 className="auth-title">Регистрация</h2>
        <div className="auth-input-group">
          <label htmlFor="name" className="auth-label">Имя</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`auth-input ${errors.name ? 'auth-input-error' : ''}`}
          />
          {errors.name && <span className="auth-error">{errors.name}</span>}
        </div>
        <div className="auth-input-group">
          <label htmlFor="email" className="auth-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`auth-input ${errors.email ? 'auth-input-error' : ''}`}
          />
          {errors.email && <span className="auth-error">{errors.email}</span>}
        </div>
        <div className="auth-input-group">
          <label htmlFor="password" className="auth-label">Пароль</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`auth-input ${errors.password ? 'auth-input-error' : ''}`}
          />
          {errors.password && <span className="auth-error">{errors.password}</span>}
        </div>
        <button type="submit" className="auth-button">
          Зарегистрироваться
        </button>
        <div className="auth-links">
          <p className="auth-text">
            Уже зарегистрированы?{' '}
            <Link to="/login" className="auth-link">Войти</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;