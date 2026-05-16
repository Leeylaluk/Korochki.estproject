import { useState } from 'react'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');

  return (
    <div>
      <Login></Login>
    </div>
  )
}

export default App
