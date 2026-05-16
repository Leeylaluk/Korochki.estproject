import React, { useState } from 'react';
import './Register.css';

function Register({ onRegister, switchToLogin }) {
    const [formData, setFormData] = useState({
        login: '',
        password: '',
        full_name: '',
        phone: '',
        email: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const validateForm = () => {
            
        const loginRegex = /^[a-zA-Z0-9]{6,}$/;
        if (!loginRegex.test(formData.login)) {
            setError('Логин должен содержать минимум 6 символов (латиница и цифры)');
            return false;
        }
        if (formData.password.length < 8) {
            setError('Пароль должен содержать минимум 8 символов');
            return false;
        }
        const nameRegex = /^[а-яА-ЯёЁ\s]+$/;
        if (!nameRegex.test(formData.full_name)) {
            setError('ФИО должно содержать только русские буквы и пробелы');
            return false;
        }
        const phoneRegex = /^8\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
        if (!phoneRegex.test(formData.phone)) {
            setError('Телефон должен быть в формате: 8(XXX)XXX-XX-XX');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Введите корректный email');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                setSuccess('Регистрация успешна! Теперь вы можете войти');
                setError('');
                setTimeout(() => {
                    switchToLogin();
                }, 2000);
            } else {
                setError(data.error || 'Ошибка регистрации');
            }
        } catch (err) {
            setError('Ошибка соединения с сервером');
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2>Регистрация</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Логин (латиница, цифры, мин. 6 символов)</label>
                        <input
                            type="text"
                            name="login"
                            value={formData.login}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Пароль (мин. 8 символов)</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>ФИО (русские буквы)</label>
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Телефон (формат: 8(XXX)XXX-XX-XX)</label>
                        <input
                            type="tel"
                            name="phone"
                            placeholder="8(999)123-45-67"
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
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}
                    <button type="submit" className="register-btn">Создать пользователя</button>
                </form>
                <p className="switch-link">
                    Уже есть аккаунт? <button onClick={switchToLogin}>Войти</button>
                </p>
            </div>
        </div>
    );
}

export default Register;