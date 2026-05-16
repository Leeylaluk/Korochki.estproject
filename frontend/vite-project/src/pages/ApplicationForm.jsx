// src/components/ApplicationForm.js
import React, { useState, useEffect } from 'react';
import './ApplicationForm.css';

function ApplicationForm({ user, onSuccess }) {
    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState({
        id_course: '',
        start_date: '',
        payment_method: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/courses');
            const data = await response.json();
            setCourses(data);
        } catch (err) {
            setError('Ошибка загрузки курсов');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.id_course || !formData.start_date || !formData.payment_method) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_user: user.id,
                    id_course: parseInt(formData.id_course),
                    start_date: formData.start_date,
                    payment_method: formData.payment_method
                })
            });
            const data = await response.json();
            if (response.ok) {
                setSuccess('Заявка успешно отправлена!');
                setFormData({ id_course: '', start_date: '', payment_method: '' });
                if (onSuccess) onSuccess();
            } else {
                setError(data.error || 'Ошибка отправки заявки');
            }
        } catch (err) {
            setError('Ошибка соединения с сервером');
        }
    };

    return (
        <div className="application-container">
            <div className="application-card">
                <h2>Формирование заявки</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Наименование курса</label>
                        <select
                            name="id_course"
                            value={formData.id_course}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Выберите курс</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Желаемая дата начала обучения</label>
                        <input
                            type="date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Способ оплаты</label>
                        <select
                            name="payment_method"
                            value={formData.payment_method}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Выберите способ оплаты</option>
                            <option value="cash">Наличными</option>
                            <option value="transfer">Переводом по номеру телефона</option>
                        </select>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}
                    <button type="submit" className="submit-btn">Отправить</button>
                </form>
            </div>
        </div>
    );
}

export default ApplicationForm;