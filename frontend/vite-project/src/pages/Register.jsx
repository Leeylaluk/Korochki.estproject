import React, { useState } from 'react';

function Register({ onNavigate }) {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    full_name: '',
    phone: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };



  return (
    <div className="card">
      <h2>Регистрация</h2>
      <form>
        <div className="form-group">
          <label>Логин (латиница и цифры, мин 6 символов)</label>
          <input
            type="text"
            name="login"
            value={formData.login}
            title="минимум 6 символов"
            required
          />
        </div>
        <div className="form-group">
          <label>Пароль (мин 8 символов)</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            minLength="8"
            required
          />
        </div>
        <div className="form-group">
          <label>ФИО</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Телефон</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>
      <p>
        Уже есть аккаунт?
        <button>
          Войти
        </button>
      </p>
    </div>
  );
};

export default Register;