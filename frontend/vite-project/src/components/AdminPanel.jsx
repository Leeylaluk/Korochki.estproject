// src/components/AdminPanel.js
import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

function AdminPanel() {
    const [requests, setRequests] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchRequests();
        fetchStatuses();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/requests');
            const data = await response.json();
            setRequests(data);
        } catch (err) {
            setError('Ошибка загрузки заявок');
        }
    };

    const fetchStatuses = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/statuses');
            const data = await response.json();
            setStatuses(data);
        } catch (err) {
            setError('Ошибка загрузки статусов');
        }
    };

    const updateStatus = async (requestId, newStatusId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/requests/${requestId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status_id: parseInt(newStatusId) })
            });
            const data = await response.json();
            if (response.ok) {
                setSuccess('Статус обновлен');
                fetchRequests();
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.error || 'Ошибка обновления статуса');
            }
        } catch (err) {
            setError('Ошибка соединения с сервером');
        }
    };

    const getFilteredRequests = () => {
        if (filter === 'all') return requests;
        return requests.filter(req => {
            if (filter === 'new') return req.status_code === 'new';
            if (filter === 'in_progress') return req.status_code === 'in_progress';
            if (filter === 'completed') return req.status_code === 'completed';
            if (filter === 'canceled') return req.status_code === 'canceled';
            return true;
        });
    };

    const getStatusClass = (statusCode) => {
        switch(statusCode) {
            case 'new': return 'status-new';
            case 'in_progress': return 'status-progress';
            case 'completed': return 'status-completed';
            case 'canceled': return 'status-canceled';
            default: return '';
        }
    };

    const getPaymentText = (method) => {
        return method === 'cash' ? 'Наличными' : 'Переводом по номеру телефона';
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h2>Панель администратора</h2>
                <div className="filter-section">
                    <label>Фильтр по статусу:</label>
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="all">Все заявки</option>
                        <option value="new">Новые</option>
                        <option value="in_progress">Идет обучение</option>
                        <option value="completed">Обучение завершено</option>
                        <option value="canceled">Отменена</option>
                    </select>
                </div>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            <div className="admin-stats">
                <div className="stat-card">
                    <span className="stat-number">{requests.length}</span>
                    <span className="stat-label">Всего заявок</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">{requests.filter(r => r.status_code === 'new').length}</span>
                    <span className="stat-label">Новых</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">{requests.filter(r => r.status_code === 'in_progress').length}</span>
                    <span className="stat-label">В процессе</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">{requests.filter(r => r.status_code === 'completed').length}</span>
                    <span className="stat-label">Завершено</span>
                </div>
            </div>
            
            <div className="requests-table-container">
                <table className="requests-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Пользователь</th>
                            <th>Курс</th>
                            <th>Дата начала</th>
                            <th>Оплата</th>
                            <th>Статус</th>
                            <th>Отзыв</th>
                            <th>Действие</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getFilteredRequests().map(req => (
                            <tr key={req.id}>
                                <td>{req.id}</td>
                                <td>
                                    <div className="user-info">
                                        <strong>{req.full_name}</strong>
                                        <small>{req.login}</small>
                                    </div>
                                </td>
                                <td>{req.course_name}</td>
                                <td>{req.start_date || '—'}</td>
                                <td>{getPaymentText(req.payment_method)}</td>
                                <td>
                                    <span className={`status-badge ${getStatusClass(req.status_code)}`}>
                                        {req.status_name}
                                    </span>
                                </td>
                                <td className="review-cell">
                                    {req.review || '—'}
                                </td>
                                <td>
                                    <select
                                        value={req.id_status}
                                        onChange={(e) => updateStatus(req.id, e.target.value)}
                                        className="status-select"
                                    >
                                        {statuses.map(status => (
                                            <option key={status.id} value={status.id}>
                                                {status.name}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminPanel;