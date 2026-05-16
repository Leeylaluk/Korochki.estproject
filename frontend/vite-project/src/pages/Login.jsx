import React, { useState } from 'react';

function Login({ onLogin, onNavigate }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>Вход в систему</h2>
      <form>
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
        <button type="submit">ok</button>
      </form>
      <p>
        Еще не зарегистрированы?
        <button>
          Регистрация
        </button>
      </p>
    </div>
  );
}

export default Login;