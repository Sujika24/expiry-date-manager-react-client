import React from 'react'

function Header({ currentUser, onLoginClick, onRegisterClick, onLogout }) {
  // Get user initial for avatar
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U'
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-secondary to-purple-400 flex items-center justify-center shadow-md text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-purple-900 to-secondary bg-clip-text text-transparent">
                ExpiryGuard
              </span>
              <span className="hidden sm:inline-block ml-1.5 px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-secondary-light text-secondary rounded-full">
                Pro
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-secondary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-secondary transition-colors">How It Works</a>
            <a href="#benefits" className="hover:text-secondary transition-colors">Benefits</a>
          </nav>

          {/* CTA / User Profile & Logout */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                {/* User Info Avatar Badge */}
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100/90 border border-slate-200">
                  <div className="w-7 h-7 rounded-lg bg-secondary text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {getInitial(currentUser.name)}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 hidden sm:inline-block">
                    {currentUser.name}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/80 border border-red-200/80 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
                  title="Sign out of your account"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Log out</span>
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-secondary hover:bg-slate-100/80 rounded-lg transition-all"
                >
                  Log in
                </button>
                <button
                  onClick={onRegisterClick}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-secondary hover:bg-secondary-hover rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Register Free
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  )
}

export default Header
