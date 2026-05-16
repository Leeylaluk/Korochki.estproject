import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import ApplicationForm from './components/ApplicationForm';
import MyApplications from './components/MyApplications';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
    const [user, setUser] = useState(null);
    const [currentPage, setCurrentPage] = useState('login');

    const handleLogin = (userData) => {
        setUser(userData);
        setCurrentPage('home');
    };

    const handleLogout = () => {
        setUser(null);
        setCurrentPage('login');
    };

    const renderContent = () => {
        if (!user) {
            if (currentPage === 'register') {
                return (
                    <Register 
                        onRegister={() => {}} 
                        switchToLogin={() => setCurrentPage('login')}
                    />
                );
            }
            return (
                <Login 
                    onLogin={handleLogin}
                    switchToRegister={() => setCurrentPage('register')}
                />
            );
        }
        return (
            <div className="app-container">
                <nav className="navbar">
                    <div className="nav-brand">
                        <h1>Корочки.есть</h1>
                    </div>
                    <div className="nav-menu">
                        <button 
                            className={currentPage === 'home' ? 'active' : ''}
                            onClick={() => setCurrentPage('home')}
                        >
                            Создать заявку
                        </button>
                        <button 
                            className={currentPage === 'my-apps' ? 'active' : ''}
                            onClick={() => setCurrentPage('my-apps')}
                        >
                            Мои заявки
                        </button>
                        {user.role === 'admin' && (
                            <button 
                                className={currentPage === 'admin' ? 'active' : ''}
                                onClick={() => setCurrentPage('admin')}
                            >
                                Админ панель
                            </button>
                        )}
                        <div className="user-info-nav">
                            <span>👋 {user.full_name}</span>
                            <button onClick={handleLogout} className="logout-btn">
                                Выйти
                            </button>
                        </div>
                    </div>
                </nav>
                <div className="page-content">
                    {currentPage === 'home' && <ApplicationForm user={user} />}
                    {currentPage === 'my-apps' && <MyApplications user={user} />}
                    {currentPage === 'admin' && user.role === 'admin' && <AdminPanel />}
                </div>
            </div>
        );
    };

    return (
        <div className="App">
            {renderContent()}
        </div>
    );
}

export default App;