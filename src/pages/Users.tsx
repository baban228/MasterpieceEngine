// src/pages/Users.tsx
import React, { useState, useEffect } from 'react';
import { useUser, User } from '../context/UserContext';
import '../styles/pages/users.css'; // Импорт CSS файла

const Users: React.FC = () => {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [friendToRemove, setFriendToRemove] = useState<User | null>(null);

  // Пример данных пользователей
  useEffect(() => {
    const mockUsers: User[] = [
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' },
      { id: 3, name: 'Charlie', email: 'charlie@example.com' },
      { id: 4, name: 'David', email: 'david@example.com' },
    ];
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = users.filter(u => u.name.toLowerCase().includes(term.toLowerCase()));
    setFilteredUsers(filtered);
  };

  const addFriend = (friend: User) => {
    if (!friends.some(f => f.id === friend.id)) {
      setFriends([...friends, friend]);
    }
  };

  const confirmRemoveFriend = (friend: User) => {
    setFriendToRemove(friend);
    setShowModal(true);
  };

  const cancelRemoveFriend = () => {
    setFriendToRemove(null);
    setShowModal(false);
  };

  const removeFriend = (friendId: number) => {
    setFriends(friends.filter(f => f.id !== friendId));
    setFriendToRemove(null);
    setShowModal(false);
  };

  return (
    <div className="users-page">
      <div className="users-search">
        <input
          type="text"
          placeholder="Поиск пользователей"
          value={searchTerm}
          onChange={handleSearchChange}
          className="users-search-input"
        />
      </div>
      <div className="users-main">
        <div className="users-list">
          {filteredUsers.map(u => (
            <div key={u.id} className="user-item">
              <span>{u.name}</span>
              {friends.some(f => f.id === u.id) ? (
                <span className="user-already-friend">Уже в друзьях</span>
              ) : (
                <a href="#" onClick={(e) => { e.preventDefault(); addFriend(u); }} className="user-add">
                  Добавить в друзья
                </a>
              )}
            </div>
          ))}
        </div>
        <div className="friends-list">
          <h3>Друзья</h3>
          {friends.length > 0 ? (
            friends.map(f => (
              <div key={f.id} className="friend-item">
                <span>{f.name}</span>
                <div className="friend-actions">
                  <a href="#" onClick={(e) => { e.preventDefault(); confirmRemoveFriend(f); }} className="friend-remove">
                    Удалить
                  </a>
                  <a href="#" className="friend-invite">
                    Пригласить
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p>У вас пока нет друзей</p>
          )}
        </div>
      </div>
      {showModal && friendToRemove && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-message">Вы уверены, что хотите удалить {friendToRemove.name} из друзей?</div>
            <div className="modal-buttons">
              <a href="#" onClick={(e) => { e.preventDefault(); cancelRemoveFriend(); }} className="modal-button modal-button-cancel">
                Отмена
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); removeFriend(friendToRemove.id); }} className="modal-button modal-button-confirm">
                Удалить
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;