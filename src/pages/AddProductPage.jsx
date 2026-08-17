import React, { useState } from 'react'
import { createProduct } from '../api/products'
import CameraBarcodeScanner from '../components/CameraBarcodeScanner'

const CATEGORY_OPTIONS = ['Pantry', 'Fridge', 'Freezer', 'Medicine Cabinet', 'Other']
const UNIT_OPTIONS = ['pcs', 'kg', 'g', 'L', 'ml', 'pack', 'box']

function AddProductPage({ currentUser, onBackToDashboard, onProductAdded }) {
  // Default expiry date to 14 days from now
  const defaultExpiryDate = () => {
    const d = new Date()
    d.setDate(d.getDate() + 14)
    return d.toISOString().split('T')[0]
  }

  const [formData, setFormData] = useState({
    title: '',
    upc: '',
    amount: 1,
    unit: 'pcs',
    expiryDate: defaultExpiryDate(),
    categoryOrLocation: 'Pantry',
  })

  const [showCameraScanner, setShowCameraScanner] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }))
    }
    if (errorMsg) setErrorMsg('')
  }

  // Handle detected barcode code from camera scanner
  const handleBarcodeDetected = (code) => {
    setShowCameraScanner(false)
    const sampleCatalog = {
      '012345678905': 'Organic Whole Milk 1L',
      '890123456789': 'Greek Yogurt 500g',
      '078901234567': 'Whole Wheat Bread',
      '045678901234': 'Almond Butter 250g',
    }

    setFormData((prev) => ({
      ...prev,
      upc: code,
      title: prev.title.trim() ? prev.title : sampleCatalog[code] || prev.title,
    }))

    setSuccessMsg(`Barcode ${code} scanned successfully!`)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  // Quick fill sample barcode
  const handleQuickFill = (code, sampleTitle) => {
    setFormData((prev) => ({
      ...prev,
      upc: code,
      title: prev.title.trim() ? prev.title : sampleTitle,
    }))
  }

  const validate = () => {
    const errors = {}
    if (!formData.title.trim()) {
      errors.title = 'Product title is required'
    }
    if (!formData.expiryDate) {
      errors.expiryDate = 'Expiry date is required'
    }
    if (formData.amount < 1) {
      errors.amount = 'Amount must be at least 1'
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    const response = await createProduct({
      title: formData.title.trim(),
      upc: formData.upc.trim(),
      amount: Number(formData.amount),
      unit: formData.unit,
      expiryDate: formData.expiryDate,
      categoryOrLocation: formData.categoryOrLocation,
    })

    setLoading(false)

    if (response.success) {
      setSuccessMsg('Product added to inventory successfully!')
      setTimeout(() => {
        if (onProductAdded) {
          onProductAdded()
        } else {
          onBackToDashboard()
        }
      }, 800)
    } else {
      setErrorMsg(response.message || 'Failed to add product. Please check server logs.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Page Navigation Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            <div className="flex items-center gap-3">
              <button
                onClick={onBackToDashboard}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-semibold"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Dashboard</span>
              </button>
              <div className="h-4 w-px bg-slate-800" />
              <span className="text-sm font-bold text-white">Add New Product</span>
            </div>

            <div className="text-xs text-slate-300">
              User: <strong className="text-white">{currentUser?.name || 'User'}</strong>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content Form Card */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          
          {/* Form Header Banner */}
          <div className="bg-slate-900 text-white p-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/30 text-secondary-light flex items-center justify-center font-bold">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-white tracking-tight">Add Product to Inventory</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Scan UPC barcode with device camera or enter details manually
                </p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            
            {/* Error Banner */}
            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
                <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Banner */}
            {successMsg && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-3">
                <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{successMsg}</span>
              </div>
            )}

            {/* UPC Barcode Section with Camera Scan Button */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  UPC Barcode Code
                </label>
                <span className="text-[11px] text-slate-500 font-medium">Camera or Manual</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    name="upc"
                    value={formData.upc}
                    onChange={handleChange}
                    placeholder="e.g. 012345678905"
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary bg-white text-slate-900"
                  />
                  <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCameraScanner(true)}
                  className="py-3 px-4 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm shrink-0"
                >
                  <svg className="w-4 h-4 text-secondary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Access Camera Barcode Scanner</span>
                </button>
              </div>

              {/* Sample UPC Quick Fill Pills */}
              <div className="pt-1 flex items-center gap-2 overflow-x-auto text-[11px]">
                <span className="text-slate-500 font-semibold shrink-0">Sample Codes:</span>
                <button
                  type="button"
                  onClick={() => handleQuickFill('012345678905', 'Organic Whole Milk 1L')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-mono hover:border-secondary transition-colors shrink-0"
                >
                  012345678905 (Milk)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('890123456789', 'Greek Yogurt 500g')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-mono hover:border-secondary transition-colors shrink-0"
                >
                  890123456789 (Yogurt)
                </button>
              </div>
            </div>

            {/* Product Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Product Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Organic Whole Milk 1L"
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                  fieldErrors.title
                    ? 'border-red-300 bg-red-50/50 focus:ring-red-500/20 text-red-900'
                    : 'border-slate-300 focus:ring-secondary/20 focus:border-secondary bg-slate-50 focus:bg-white text-slate-900'
                }`}
              />
              {fieldErrors.title && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">{fieldErrors.title}</p>
              )}
            </div>

            {/* Amount & Unit Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Amount / Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="amount"
                  min="1"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary bg-slate-50 focus:bg-white text-slate-900"
                />
                {fieldErrors.amount && (
                  <p className="mt-1.5 text-xs text-red-600 font-medium">{fieldErrors.amount}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Unit
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary bg-slate-50 focus:bg-white text-slate-800 font-medium"
                >
                  {UNIT_OPTIONS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Expiry Date & Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Expiry Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                    fieldErrors.expiryDate
                      ? 'border-red-300 bg-red-50/50 text-red-900 focus:ring-red-500/20'
                      : 'border-slate-300 focus:ring-secondary/20 focus:border-secondary bg-slate-50 focus:bg-white text-slate-900'
                  }`}
                />
                {fieldErrors.expiryDate && (
                  <p className="mt-1.5 text-xs text-red-600 font-medium">{fieldErrors.expiryDate}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category / Location
                </label>
                <select
                  name="categoryOrLocation"
                  value={formData.categoryOrLocation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary bg-slate-50 focus:bg-white text-slate-800 font-medium"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Action Buttons */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onBackToDashboard}
                className="py-3 px-5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="py-3 px-6 rounded-xl bg-secondary hover:bg-secondary-hover text-white text-xs font-extrabold shadow-md transition-all disabled:opacity-60 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Saving Product...</span>
                  </>
                ) : (
                  <span>Add Product to Pantry</span>
                )}
              </button>
            </div>

          </form>

        </div>
      </main>

      {/* Live Camera Scanner Overlay */}
      {showCameraScanner && (
        <CameraBarcodeScanner
          onDetected={handleBarcodeDetected}
          onClose={() => setShowCameraScanner(false)}
        />
      )}

    </div>
  )
}

export default AddProductPage
