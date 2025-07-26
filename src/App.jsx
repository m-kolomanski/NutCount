import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import AppNavbar from './components/Navbar'
import TodayPage from './pages/TodayPage'
import CataloguePage from './pages/CataloguePage'
import DishesPage from './pages/DishesPage'
import HistoryPage from './pages/HistoryPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <AppNavbar />
          <Routes>
            <Route path="/" element={<Navigate to="/today" replace />} />
            <Route path="/today" element={<TodayPage />} />
            <Route path="/catalogue" element={<CataloguePage />} />
            <Route path="/dishes" element={<DishesPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
