import React from 'react'

function Hero({ onLoginClick, onRegisterClick }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-purple-50/50 via-white to-slate-50 py-16 sm:py-24">
      
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-primary/40 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-7 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-light border border-secondary/20 text-secondary text-xs font-semibold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              Smart Expiry Date Tracking
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              Never Waste Food or <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-secondary via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Miss Expiry Dates
              </span> Again.
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Track groceries, medicines, cosmetics, and household items in one intuitive dashboard. Receive timely alerts before products spoil and save money effortlessly.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
              <button
                onClick={onRegisterClick}
                className="w-full sm:w-auto px-8 py-4 bg-secondary hover:bg-secondary-hover text-white text-base font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
              >
                <span>Get Started for Free</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              <button
                onClick={onLoginClick}
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-100/80 border border-slate-300 text-slate-700 text-base font-semibold rounded-2xl shadow-xs transition-all flex items-center justify-center"
              >
                Log In to Account
              </button>
            </div>

            {/* Micro Trust Stats */}
            <div className="mt-10 pt-8 border-t border-slate-200/60 flex items-center justify-center lg:justify-start gap-8 text-slate-500 text-xs sm:text-sm font-medium">
              <div className="flex items-center gap-2">
                <span className="text-secondary font-bold text-base sm:text-lg">100%</span>
                <span>Free to Start</span>
              </div>
              <div className="h-4 w-px bg-slate-300" />
              <div className="flex items-center gap-2">
                <span className="text-secondary font-bold text-base sm:text-lg">Zero</span>
                <span>Food Waste</span>
              </div>
              <div className="h-4 w-px bg-slate-300" />
              <div className="flex items-center gap-2">
                <span className="text-secondary font-bold text-base sm:text-lg">Instant</span>
                <span>Alerts</span>
              </div>
            </div>

          </div>

          {/* Right Interactive Preview Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Preview Glass Card */}
              <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Pantry Expiry Radar</h3>
                    <p className="text-xs text-slate-500">Live item status monitor</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                    3 Active Items
                  </span>
                </div>

                {/* Simulated Items */}
                <div className="space-y-3">
                  
                  {/* Item 1 - Expiring Soon */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg font-bold">
                        🥛
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Fresh Whole Milk</p>
                        <p className="text-xs text-amber-700 font-medium">Expires in 2 days</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-200/70 text-amber-800">
                      Soon
                    </span>
                  </div>

                  {/* Item 2 - Safe */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg font-bold">
                        🥑
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Organic Avocados</p>
                        <p className="text-xs text-emerald-700 font-medium">Expires in 6 days</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-200/60 text-emerald-800">
                      Fresh
                    </span>
                  </div>

                  {/* Item 3 - Medicine */}
                  <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-lg font-bold">
                        💊
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Multivitamin Tablets</p>
                        <p className="text-xs text-purple-700 font-medium">Expires in 45 days</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-200/60 text-purple-800">
                      Good
                    </span>
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Hero
