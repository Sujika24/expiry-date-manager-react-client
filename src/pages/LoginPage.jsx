import React, { useState } from 'react'
import { loginUser } from '../api/auth'

function LoginPage({ onSwitchToRegister, onBackToHome, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [successMsg, setSuccessMsg] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear specific field error on edit
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }))
    }
    if (errorMsg) setErrorMsg('')
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }
    if (!formData.password) {
      errors.password = 'Password is required'
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    const response = await loginUser({
      email: formData.email.trim(),
      password: formData.password,
    })

    setLoading(false)

    if (response.success) {
      setSuccessMsg('Logged in successfully!')
      if (response.data?.token) {
        localStorage.setItem('expiry_token', response.data.token)
        localStorage.setItem('expiry_user', JSON.stringify(response.data.user))
      }
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(response.data)
        }
      }, 800)
    } else {
      setErrorMsg(response.message || 'Invalid email or password.')
      if (response.errors && Array.isArray(response.errors)) {
        const mappedErrors = {}
        response.errors.forEach((err) => {
          if (err.field) mappedErrors[err.field] = err.message
        })
        setFieldErrors(mappedErrors)
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background glow graphics */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        
        {/* Logo and title */}
        <div className="text-center">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 mb-6 group text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to ExpiryGuard Home
          </button>

          <div className="w-12 h-12 rounded-2xl bg-secondary text-white flex items-center justify-center mx-auto shadow-lg mb-3">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to access your pantry and product inventory
          </p>
        </div>

        {/* Card Form */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white/90 backdrop-blur-lg py-8 px-6 shadow-xl rounded-3xl border border-slate-200/80 sm:px-10">
            
            {/* Global Error Alert Banner */}
            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Alert Banner */}
            {successMsg && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-3">
                <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{successMsg}</span>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className={`block w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                      fieldErrors.email
                        ? 'border-red-300 bg-red-50/50 text-red-900 focus:ring-red-500/20'
                        : 'border-slate-300 focus:border-secondary focus:ring-secondary/20 bg-slate-50/50 focus:bg-white text-slate-900'
                    }`}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1.5 text-xs text-red-600 font-medium">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                </div>
                <div className="relative rounded-xl shadow-xs">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`block w-full pl-4 pr-11 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                      fieldErrors.password
                        ? 'border-red-300 bg-red-50/50 text-red-900 focus:ring-red-500/20'
                        : 'border-slate-300 focus:border-secondary focus:ring-secondary/20 bg-slate-50/50 focus:bg-white text-slate-900'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.043 10.043 0 014.122-.963c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1.5 text-xs text-red-600 font-medium">{fieldErrors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-secondary hover:bg-secondary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </div>

            </form>

            {/* Switch to Register link */}
            <div className="mt-6 text-center border-t border-slate-100 pt-6">
              <p className="text-sm text-slate-600">
                Don't have an account?{' '}
                <button
                  onClick={onSwitchToRegister}
                  className="font-bold text-secondary hover:text-secondary-hover hover:underline transition-colors"
                >
                  Register here
                </button>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default LoginPage
