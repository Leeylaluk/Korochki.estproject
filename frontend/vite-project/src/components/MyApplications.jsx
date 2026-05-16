// src/components/MyApplications.js
import React, { useState, useEffect } from 'react';
import './MyApplications.css';

function MyApplications({ user }) {
    const [requests, setRequests] = useState([]);
    const [reviewText, setReviewText] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/requests/user/${user.id}`);
            const data = await response.json();
            setRequests(data);
        } catch (err) {
            setError('Ошибка загрузки заявок');
        }
    };

    const canAddReview = (statusCode) => {
        return statusCode === 'completed';
    };

    const handleReviewChange = (requestId, value) => {
        setReviewText({ ...reviewText, [requestId]: value });
    };

    const submitReview = async (requestId) => {
        const review = reviewText[requestId];
        if (!review || review.trim() === '') {
            setError('Пожалуйста, введите отзыв');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/requests/${requestId}/review`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ review: review })
            });
            const data = await response.json();
            if (response.ok) {
                setSuccess('Отзыв успешно сохранен!');
                fetchRequests();
                setReviewText({ ...reviewText, [requestId]: '' });
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.error || 'Ошибка сохранения отзыва');
            }
        } catch (err) {
            setError('Ошибка соединения с сервером');
        }
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

    const getStatusText = (statusName, statusCode) => {
        if (statusCode === 'in_progress') return 'Идет обучение';
        return statusName;
    };

    return (
        <div className="applications-container">
            <div className="applications-header">
                <h2>Мои заявки</h2>
            </div>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            {requests.length === 0 ? (
                <div className="no-applications">
                    <p>У вас пока нет заявок</p>
                </div>
            ) : (
                <div className="applications-list">
                    {requests.map(req => (
                        <div key={req.id} className="application-card-item">
                            <div className="application-header">
                                <h3>{req.course_name}</h3>
                                <span className={`status-badge ${getStatusClass(req.status_code)}`}>
                                    {getStatusText(req.status_name, req.status_code)}
                                </span>
                            </div>
                            <div className="application-details">
                                <p><strong>Дата начала:</strong> {req.start_date || 'Не указана'}</p>
                                <p><strong>Способ оплаты:</strong> {req.payment_method === 'cash' ? 'Наличными' : 'Переводом по номеру телефона'}</p>
                                <p><strong>Дата подачи:</strong> {new Date(req.created_at).toLocaleDateString('ru-RU')}</p>
                            </div>
                            
                            {req.review && (
                                <div className="existing-review">
                                    <strong>Ваш отзыв:</strong>
                                    <p>{req.review}</p>
                                </div>
                            )}
                            
                            {canAddReview(req.status_code) && (
                                <div className="review-section">
                                    <textarea
                                        placeholder="Оставьте отзыв о качестве образовательных услуг..."
                                        value={reviewText[req.id] || ''}
                                        onChange={(e) => handleReviewChange(req.id, e.target.value)}
                                        rows="3"
                                    />
                                    <button onClick={() => submitReview(req.id)}>
                                        Отправить отзыв
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyApplications;