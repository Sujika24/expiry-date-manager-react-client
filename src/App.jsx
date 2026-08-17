import React, { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import AddProductPage from './pages/AddProductPage'
import EditProductPage from './pages/EditProductPage'

function App() {
  const [activeView, setActiveView] = useState('landing')
  const [currentUser, setCurrentUser] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)

  useEffect(() => {
    // Check if user session already exists in localStorage
    const savedUser = localStorage.getItem('expiry_user')
    const savedToken = localStorage.getItem('expiry_token')
    if (savedUser && savedToken) {
      try {
        const user = JSON.parse(savedUser)
        setCurrentUser(user)
        setActiveView('dashboard')
      } catch (e) {
        localStorage.removeItem('expiry_user')
        localStorage.removeItem('expiry_token')
      }
    }
  }, [])

  const handleLoginClick = () => {
    if (currentUser) {
      setActiveView('dashboard')
    } else {
      setActiveView('login')
    }
  }

  const handleRegisterClick = () => {
    setActiveView('register')
  }

  const handleBackToLanding = () => {
    setActiveView('landing')
  }

  const handleAuthSuccess = (data) => {
    if (data?.user) {
      setCurrentUser(data.user)
    }
    setActiveView('dashboard')
  }

  const handleLogout = () => {
    localStorage.removeItem('expiry_token')
    localStorage.removeItem('expiry_user')
    setCurrentUser(null)
    setActiveView('landing')
  }

  const handleNavigateToAddProduct = () => {
    setActiveView('add-product')
  }

  const handleNavigateToEditProduct = (product) => {
    setEditingProduct(product)
    setActiveView('edit-product')
  }

  const handleBackToDashboard = () => {
    setEditingProduct(null)
    setActiveView('dashboard')
  }

  return (
    <div>
      {/* Top Banner Navigation for Logged-In Users on non-dashboard & non-form views */}
      {currentUser && activeView !== 'dashboard' && activeView !== 'add-product' && activeView !== 'edit-product' && (
        <div className="bg-slate-900 text-white px-4 py-2 text-xs sm:text-sm font-medium flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active Session: <strong>{currentUser.name}</strong> ({currentUser.email})</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('dashboard')}
              className="text-xs bg-secondary hover:bg-secondary-hover text-white px-3 py-1 rounded-lg transition-colors font-bold"
            >
              Go to Dashboard &rarr;
            </button>
            <button
              onClick={handleLogout}
              className="text-xs bg-red-600/20 hover:bg-red-600/40 text-red-300 hover:text-white border border-red-500/30 px-3 py-1 rounded-lg transition-colors flex items-center gap-1 font-semibold"
            >
              Log out
            </button>
          </div>
        </div>
      )}

      {activeView === 'dashboard' && currentUser ? (
        <DashboardPage
          currentUser={currentUser}
          onLogout={handleLogout}
          onNavigateToAddProduct={handleNavigateToAddProduct}
          onNavigateToEditProduct={handleNavigateToEditProduct}
        />
      ) : activeView === 'add-product' && currentUser ? (
        <AddProductPage
          currentUser={currentUser}
          onBackToDashboard={handleBackToDashboard}
          onProductAdded={handleBackToDashboard}
        />
      ) : activeView === 'edit-product' && currentUser ? (
        <EditProductPage
          productToEdit={editingProduct}
          currentUser={currentUser}
          onBackToDashboard={handleBackToDashboard}
          onProductUpdated={handleBackToDashboard}
        />
      ) : activeView === 'login' ? (
        <LoginPage
          onBackToHome={handleBackToLanding}
          onSwitchToRegister={handleRegisterClick}
          onLoginSuccess={handleAuthSuccess}
        />
      ) : activeView === 'register' ? (
        <RegisterPage
          onBackToHome={handleBackToLanding}
          onSwitchToLogin={handleLoginClick}
          onRegisterSuccess={handleAuthSuccess}
        />
      ) : (
        <LandingPage
          currentUser={currentUser}
          onLoginClick={handleLoginClick}
          onRegisterClick={handleRegisterClick}
          onLogout={handleLogout}
        />
      )}
    </div>
  )
}

export default App
