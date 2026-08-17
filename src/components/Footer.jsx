import React from 'react'

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo & Copyright */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-secondary text-white flex items-center justify-center font-bold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">ExpiryGuard</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 text-center md:text-left">
            &copy; {new Date().getFullYear()} ExpiryGuard. All rights reserved. Keep track, stay fresh.
          </p>

          {/* Quick links */}
          <div className="flex items-center gap-6 text-xs sm:text-sm">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>

        </div>
      </div>
    </footer>
  )
}

export default Footer
