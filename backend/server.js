const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'Gannex-qickyk-xeppy6',
    database: 'v4'
});

db.connect((err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Подключение к серверу MySQL успешно установлен');
});


app.post('/api/register', (req, res) => {
    const { login, password, full_name, phone, email } = req.body;
    
    const checkSql = 'SELECT * FROM user WHERE login = ?';
    db.query(checkSql, [login], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length > 0) {
            return res.status(400).json({ error: 'Логин уже существует' });
        }
        
        const insertSql = `INSERT INTO user (id_role, login, password, full_name, phone, email) 
                           VALUES (1, ?, ?, ?, ?, ?)`;
        db.query(insertSql, [login, password, full_name, phone, email], (err2, result2) => {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json({ success: true, message: 'Регистрация успешна' });
        });
    });
});

app.post('/api/login', (req, res) => {
    const { login, password } = req.body;
    const sql = `SELECT u.*, r.code as role_code 
                 FROM user u 
                 JOIN role r ON u.id_role = r.id 
                 WHERE u.login = ? AND u.password = ?`;
    
    db.query(sql, [login, password], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) {
            return res.status(401).json({ error: 'Неверный логин или пароль' });
        }
        const user = result[0];
        res.json({
            success: true,
            user: {
                id: user.id,
                login: user.login,
                full_name: user.full_name,
                role: user.role_code
            }
        });
    });
});

app.get('/api/courses', (req, res) => {
    const sql = 'SELECT * FROM course';
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

app.post('/api/requests', (req, res) => {
    const { id_user, id_course, start_date, payment_method } = req.body;
    const sql = `INSERT INTO request (id_user, id_course, start_date, payment_method) 
                 VALUES (?, ?, ?, ?)`;
    db.query(sql, [id_user, id_course, start_date, payment_method], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: 'Заявка отправлена', id: result.insertId });
    });
});

app.get('/api/requests/user/:userId', (req, res) => {
    const { userId } = req.params;
    const sql = `SELECT r.*, c.name as course_name, s.name as status_name, s.code as status_code
                 FROM request r
                 JOIN course c ON r.id_course = c.id
                 JOIN status s ON r.id_status = s.id
                 WHERE r.id_user = ?
                 ORDER BY r.created_at DESC`;
    db.query(sql, [userId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

app.put('/api/requests/:id/review', (req, res) => {
    const { id } = req.params;
    const { review } = req.body;
    const sql = 'UPDATE request SET review = ? WHERE id = ?';
    db.query(sql, [review, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: 'Отзыв сохранен' });
    });
});

app.get('/api/admin/requests', (req, res) => {
    const sql = `SELECT r.*, 
                        u.login, u.full_name,
                        c.name as course_name, 
                        s.name as status_name, s.code as status_code
                 FROM request r
                 JOIN user u ON r.id_user = u.id
                 JOIN course c ON r.id_course = c.id
                 JOIN status s ON r.id_status = s.id
                 ORDER BY r.created_at DESC`;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

app.put('/api/admin/requests/:id/status', (req, res) => {
    const { id } = req.params;
    const { status_id } = req.body;
    const sql = 'UPDATE request SET id_status = ? WHERE id = ?';
    db.query(sql, [status_id, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: 'Статус обновлен' });
    });
});

app.get('/api/statuses', (req, res) => {
    const sql = 'SELECT * FROM status';
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});