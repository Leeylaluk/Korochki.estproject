import React, { useState } from 'react';

function Login({ onLogin, onNavigate }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>Вход в систему</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Логин</label>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
            placeholder="Введите логин"
          />
        </div>
        <div className="form-group">
          <label>Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Введите пароль"
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Вход...' : 'Войти'}
        </button>
      </form>
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Еще не зарегистрированы?{' '}
        <button 
          style={{ background: 'none', color: '#667eea', padding: 0, display: 'inline' }}
          onClick={() => onNavigate('register')}
        >
          Регистрация
        </button>
      </p>
      <hr style={{ margin: '20px 0' }} />
      <p style={{ fontSize: '12px', color: '#888', textAlign: 'center' }}>
        Админ: Admin / KorokNET<br />
        Пользователь: user / user
      </p>
    </div>
  );
}

export default Login;