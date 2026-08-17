import React, { useState, useEffect } from 'react'

const CATEGORY_OPTIONS = ['Pantry', 'Fridge', 'Freezer', 'Medicine Cabinet', 'Other']
const UNIT_OPTIONS = ['pcs', 'kg', 'g', 'L', 'ml', 'pack', 'box']

function ProductModal({ isOpen, onClose, onSave, productToEdit }) {
  const [formData, setFormData] = useState({
    title: '',
    upc: '',
    amount: 1,
    unit: 'pcs',
    expiryDate: '',
    categoryOrLocation: 'Pantry',
  })
  const [scanning, setScanning] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    if (productToEdit) {
      // Format date string to YYYY-MM-DD for date input
      let formattedDate = ''
      if (productToEdit.expiryDate) {
        const d = new Date(productToEdit.expiryDate)
        if (!isNaN(d.getTime())) {
          formattedDate = d.toISOString().split('T')[0]
        }
      }

      setFormData({
        title: productToEdit.title || '',
        upc: productToEdit.upc || '',
        amount: productToEdit.amount || 1,
        unit: productToEdit.unit || 'pcs',
        expiryDate: formattedDate,
        categoryOrLocation: productToEdit.categoryOrLocation || 'Pantry',
      })
    } else {
      // Default to 14 days in the future for quick entry
      const defaultDate = new Date()
      defaultDate.setDate(defaultDate.getDate() + 14)
      const formattedDate = defaultDate.toISOString().split('T')[0]

      setFormData({
        title: '',
        upc: '',
        amount: 1,
        unit: 'pcs',
        expiryDate: formattedDate,
        categoryOrLocation: 'Pantry',
      })
    }
    setErrorMsg('')
    setFieldErrors({})
  }, [productToEdit, isOpen])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }))
    }
    if (errorMsg) setErrorMsg('')
  }

  // Simulate UPC Barcode Scanner
  const handleSimulateScan = () => {
    setScanning(true)
    setTimeout(() => {
      const sampleBarcodes = [
        { code: '012345678905', title: 'Organic Whole Milk 1L' },
        { code: '890123456789', title: 'Greek Yogurt 500g' },
        { code: '078901234567', title: 'Whole Wheat Bread' },
        { code: '045678901234', title: 'Almond Butter 250g' },
      ]
      const randomItem = sampleBarcodes[Math.floor(Math.random() * sampleBarcodes.length)]

      setFormData((prev) => ({
        ...prev,
        upc: randomItem.code,
        title: prev.title.trim() ? prev.title : randomItem.title,
      }))
      setScanning(false)
    }, 1200)
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

    const success = await onSave(formData)
    setLoading(false)

    if (success) {
      onClose()
    } else {
      setErrorMsg('Failed to save product. Please check the inputs and try again.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-secondary/30 text-secondary-light flex items-center justify-center font-bold">
              {productToEdit ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {productToEdit ? 'Edit Product' : 'Add New Product'}
              </h3>
              <p className="text-xs text-slate-400">
                {productToEdit ? 'Update product details and expiry date' : 'Scan UPC barcode or enter item details manually'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
              <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Barcode / UPC Input with Scanner simulation */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              UPC Barcode Code
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  name="upc"
                  value={formData.upc}
                  onChange={handleChange}
                  placeholder="e.g. 012345678905"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary bg-slate-50 focus:bg-white"
                />
                <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <button
                type="button"
                onClick={handleSimulateScan}
                disabled={scanning}
                className="px-3.5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50 shrink-0 shadow-xs"
              >
                {scanning ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Scanning...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-secondary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Scan Barcode</span>
                  </>
                )}
              </button>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Click 'Scan Barcode' to simulate a camera UPC scanner or enter code manually.
            </p>
          </div>

          {/* Product Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Product Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Organic Whole Milk 1L"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                fieldErrors.title
                  ? 'border-red-300 bg-red-50/50 focus:ring-red-500/20 text-red-900'
                  : 'border-slate-300 focus:ring-secondary/20 focus:border-secondary bg-slate-50 focus:bg-white text-slate-900'
              }`}
            />
            {fieldErrors.title && (
              <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.title}</p>
            )}
          </div>

          {/* Amount & Unit Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Quantity / Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="amount"
                min="1"
                value={formData.amount}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary bg-slate-50 focus:bg-white"
              />
              {fieldErrors.amount && (
                <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.amount}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Unit
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary bg-slate-50 focus:bg-white text-slate-800"
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Expiry Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                  fieldErrors.expiryDate
                    ? 'border-red-300 bg-red-50/50 text-red-900 focus:ring-red-500/20'
                    : 'border-slate-300 focus:ring-secondary/20 focus:border-secondary bg-slate-50 focus:bg-white text-slate-900'
                }`}
              />
              {fieldErrors.expiryDate && (
                <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.expiryDate}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Storage / Category
              </label>
              <select
                name="categoryOrLocation"
                value={formData.categoryOrLocation}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary bg-slate-50 focus:bg-white text-slate-800"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary-hover text-white text-xs font-bold shadow-md transition-all disabled:opacity-60 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <span>{productToEdit ? 'Update Product' : 'Save Product'}</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}

export default ProductModal
