// src/pages/User.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import '../styles/pages/user.css'; // Импорт CSS файла

const User: React.FC = () => {
  const { user, logout, login } = useUser();
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string>(user ? user.avatar || 'https://via.placeholder.com/150 ' : 'https://via.placeholder.com/150 '); // Фиктивный аватар
  const [editingName, setEditingName] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>(user ? user.name : '');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
        if (user) {
          login({ ...user, avatar: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  const saveNameChanges = () => {
    if (user) {
      const updatedUser = { ...user, name: newName };
      login(updatedUser);
      setEditingName(false);
    }
  };

  const achievements = [
    { id: 1, title: 'Зарегистрировался', description: 'Приветствуем вас в нашем приложении!' },
    { id: 2, title: 'Создал первую доску', description: 'Вы успешно создали свою первую доску!' },
    { id: 3, title: 'Добавил первого друга', description: 'Вы добавили своего первого друга!' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="user-page">
      {!user ? (
        <div className="user-not-authenticated">
          <h2>Вы не авторизованы</h2>
          <p>Пожалуйста, войдите или зарегистрируйтесь, чтобы увидеть ваш профиль.</p>
          <Link to="/login" className="user-login-link">
            Войти
          </Link>
          <Link to="/register" className="user-register-link">
            Зарегистрироваться
          </Link>
        </div>
      ) : (
        <div className="user-profile">
          <div className="user-avatar-section">
            {editingName ? (
              <div className="user-avatar-edit">
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="user-avatar-input"
                />
                <label htmlFor="avatar-upload" className="user-avatar-label">
                  <span className="user-avatar-change">Изменить аватар</span>
                </label>
              </div>
            ) : (
              <div className="user-avatar-display">
                <img src={avatarUrl} alt={`${user.name}'s avatar`} className="user-avatar" onClick={() => setEditingName(true)} />
              </div>
            )}
          </div>
          <div className="user-info-section">
            {editingName ? (
              <div className="user-name-edit">
                <input
                  type="text"
                  value={newName}
                  onChange={handleNameChange}
                  className="user-name-input"
                />
                <div className="user-name-buttons">
                  <button onClick={saveNameChanges} className="user-save-button">
                    Сохранить
                  </button>
                  <button onClick={() => setEditingName(false)} className="user-cancel-button">
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <div className="user-name-display">
                <h2 className="user-name" onClick={() => setEditingName(true)}>
                  {user.name}
                </h2>
              </div>
            )}
            <p className="user-email">{user.email}</p>
            <p className="user-boards-count">Количество досок: 5</p> {/* Пример количества досок */}
          </div>
          <div className="user-achievements-section">
            <h3 className="user-achievements-title">Достижения</h3>
            {achievements.map(achievement => (
              <div key={achievement.id} className="user-achievement">
                <h4 className="user-achievement-title">{achievement.title}</h4>
                <p className="user-achievement-description">{achievement.description}</p>
              </div>
            ))}
          </div>
          <div className="user-actions">
            <button onClick={handleLogout} className="user-logout-button">Logout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;