import React from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Footer from '../components/Footer'

function LandingPage({ currentUser, onLoginClick, onRegisterClick, onLogout }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 selection:bg-secondary/20 selection:text-secondary">
      <Header
        currentUser={currentUser}
        onLoginClick={onLoginClick}
        onRegisterClick={onRegisterClick}
        onLogout={onLogout}
      />
      <main className="flex-grow">
        <Hero onLoginClick={onLoginClick} onRegisterClick={onRegisterClick} />
        <Features />
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage
