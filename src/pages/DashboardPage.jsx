import React, { useState, useEffect, useCallback } from 'react'
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../api/products'
import ProductModal from '../components/ProductModal'

function DashboardPage({ currentUser, onLogout, onNavigateToAddProduct, onNavigateToEditProduct }) {
  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState({
    totalProducts: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 20,
  })
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [toastMsg, setToastMsg] = useState('')

  // Query State
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [expiryFilter, setExpiryFilter] = useState('all')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [productToEdit, setProductToEdit] = useState(null)
  const [deleteCandidate, setDeleteCandidate] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3500)
  }

  // Load Products from API
  const loadProducts = useCallback(async () => {
    setLoading(true)
    setErrorMsg('')

    const response = await fetchProducts({
      page,
      limit: 20,
      search: searchQuery.trim(),
      expiryFilter,
    })

    setLoading(false)

    if (response.success) {
      setProducts(response.data)
      setPagination(response.pagination)
    } else {
      setErrorMsg(response.message || 'Failed to load products from server.')
    }
  }, [page, searchQuery, expiryFilter])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  // Reset pagination to page 1 on search or filter change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setPage(1)
  }

  const handleFilterChange = (filterKey) => {
    setExpiryFilter(filterKey)
    setPage(1)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setPage(1)
  }

  // Open Modal for Add
  const handleOpenAddModal = () => {
    setProductToEdit(null)
    setIsModalOpen(true)
  }

  // Open Modal for Edit
  const handleOpenEditModal = (product) => {
    setProductToEdit(product)
    setIsModalOpen(true)
  }

  // Save Handler for Modal (Add or Edit)
  const handleSaveProduct = async (formData) => {
    let response
    if (productToEdit) {
      response = await updateProduct(productToEdit._id, formData)
    } else {
      response = await createProduct(formData)
    }

    if (response.success) {
      showToast(productToEdit ? 'Product updated successfully!' : 'Product added to inventory!')
      loadProducts()
      return true
    } else {
      return false
    }
  }

  // Confirm Delete Handler
  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return
    setDeleteLoading(true)

    const response = await deleteProduct(deleteCandidate._id)
    setDeleteLoading(false)

    if (response.success) {
      showToast(`'${deleteCandidate.title}' deleted.`)
      setDeleteCandidate(null)
      loadProducts()
    } else {
      alert(response.message || 'Failed to delete product.')
    }
  }

  // Calculate Expiry Status Badge info
  const getExpiryBadge = (expiryDateStr) => {
    if (!expiryDateStr) return { text: 'No date', color: 'bg-slate-100 text-slate-700 border-slate-200' }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const expDate = new Date(expiryDateStr)
    expDate.setHours(0, 0, 0, 0)

    const diffTime = expDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      const daysAgo = Math.abs(diffDays)
      return {
        text: `Expired ${daysAgo} ${daysAgo === 1 ? 'day' : 'days'} ago`,
        color: 'bg-red-50 text-red-700 border-red-200 font-semibold',
        status: 'expired',
      }
    } else if (diffDays === 0) {
      return {
        text: 'Expires Today!',
        color: 'bg-amber-100 text-amber-900 border-amber-300 font-bold animate-pulse',
        status: 'critical',
      }
    } else if (diffDays <= 7) {
      return {
        text: `Expires in ${diffDays} ${diffDays === 1 ? 'day' : 'days'}`,
        color: 'bg-amber-50 text-amber-800 border-amber-200 font-semibold',
        status: 'critical',
      }
    } else if (diffDays <= 30) {
      return {
        text: `Expires in ${diffDays} days`,
        color: 'bg-blue-50 text-blue-800 border-blue-200',
        status: 'warning',
      }
    } else {
      return {
        text: `Expires in ${diffDays} days`,
        color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        status: 'good',
      }
    }
  }

  // Format date readable e.g., "Aug 25, 2026"
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return 'N/A'
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Stat Calculations for Overview Cards
  const totalCount = pagination.totalProducts || products.length
  const expiredCount = products.filter((p) => new Date(p.expiryDate) < new Date()).length
  const expiringSoonCount = products.filter((p) => {
    const d = new Date(p.expiryDate)
    const today = new Date()
    const diffDays = (d - today) / (1000 * 60 * 60 * 24)
    return diffDays >= 0 && diffDays <= 7
  }).length

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Top Navigation Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary text-white flex items-center justify-center shadow-md font-bold">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight text-white">ExpiryGuard</span>
                <span className="hidden sm:inline-block ml-2 text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-medium border border-slate-700">
                  Dashboard
                </span>
              </div>
            </div>

            {/* Right Action Items */}
            <div className="flex items-center gap-3">
              <button
                onClick={onNavigateToAddProduct || handleOpenAddModal}
                className="bg-secondary hover:bg-secondary-hover text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Product</span>
              </button>

              <div className="h-6 w-px bg-slate-800 hidden sm:block" />

              {/* User Profile / Logout */}
              <div className="flex items-center gap-2">
                <span className="hidden sm:block text-xs text-slate-300 font-medium">
                  {currentUser?.name || 'User'}
                </span>
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="text-slate-400 hover:text-red-400 p-2 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Welcome & Overview Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Pantry Expiry Dashboard
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Track products nearing expiry, search by title/UPC code, and prevent food waste.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateToAddProduct || handleOpenAddModal}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2"
            >
              <svg className="w-4 h-4 text-secondary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>+ Add Product Link</span>
            </button>
          </div>
        </div>

        {/* Stats Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Products</p>
              <p className="text-xl font-bold text-slate-900">{totalCount}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Expiring &lt; 7 Days</p>
              <p className="text-xl font-bold text-amber-600">{expiringSoonCount}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Expired Items</p>
              <p className="text-xl font-bold text-red-600">{expiredCount}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Max Limit/Page</p>
              <p className="text-xl font-bold text-slate-900">20 items</p>
            </div>
          </div>

        </div>

        {/* Controls Bar: Search & Expiry Filter Pills */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search product title or UPC barcode..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary bg-slate-50 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Expiry Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1 hidden sm:inline-block">
              Filter:
            </span>

            <button
              onClick={() => handleFilterChange('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                expiryFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Products
            </button>

            <button
              onClick={() => handleFilterChange('1month')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                expiryFilter === '1month'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Within 1 Month
            </button>

            <button
              onClick={() => handleFilterChange('3months')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                expiryFilter === '3months'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Within 3 Months
            </button>

            <button
              onClick={() => handleFilterChange('expired')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                expiryFilter === 'expired'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Expired Items
            </button>
          </div>

        </div>

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={loadProducts}
              className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Product Cards Grid / Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          
          {loading ? (
            /* Skeleton Loading State */
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="h-16 bg-slate-100 rounded-xl animate-pulse flex items-center justify-between px-4">
                  <div className="w-1/3 h-5 bg-slate-200 rounded-md" />
                  <div className="w-1/4 h-5 bg-slate-200 rounded-md" />
                  <div className="w-1/6 h-5 bg-slate-200 rounded-md" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">No products found</h3>
              <p className="text-sm text-slate-500 mt-1">
                {searchQuery || expiryFilter !== 'all'
                  ? 'No items match your active search or expiry date filter.'
                  : 'Your inventory is empty. Click "+ Add Product" to add your first item!'}
              </p>
              <div className="mt-5 flex items-center justify-center gap-3">
                {(searchQuery || expiryFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setExpiryFilter('all')
                    }}
                    className="text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl font-semibold transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
                <button
                  onClick={handleOpenAddModal}
                  className="text-xs bg-secondary hover:bg-secondary-hover text-white px-4 py-2 rounded-xl font-bold shadow-md transition-all"
                >
                  + Add Product Now
                </button>
              </div>
            </div>
          ) : (
            /* Product List Table */
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4 sm:px-6">Product Title & UPC</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Expiry Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {products.map((product) => {
                    const badge = getExpiryBadge(product.expiryDate)
                    return (
                      <tr key={product._id} className="hover:bg-slate-50/60 transition-colors group">
                        
                        {/* Title & UPC */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold shrink-0">
                              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{product.title}</p>
                              {product.upc ? (
                                <p className="text-xs text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                  </svg>
                                  <span>UPC: {product.upc}</span>
                                </p>
                              ) : (
                                <p className="text-xs text-slate-400 italic">No UPC code</p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category / Location */}
                        <td className="py-4 px-4">
                          <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            {product.categoryOrLocation || 'Pantry'}
                          </span>
                        </td>

                        {/* Quantity / Amount */}
                        <td className="py-4 px-4">
                          <span className="font-semibold text-slate-800">
                            {product.amount} {product.unit || 'pcs'}
                          </span>
                        </td>

                        {/* Expiry Date */}
                        <td className="py-4 px-4 whitespace-nowrap text-slate-700 font-medium">
                          {formatDate(product.expiryDate)}
                        </td>

                        {/* Expiry Status Badge */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className={`inline-block px-3 py-1 rounded-xl text-xs border ${badge.color}`}>
                            {badge.text}
                          </span>
                        </td>

                        {/* Actions (Edit & Delete) */}
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                if (onNavigateToEditProduct) {
                                  onNavigateToEditProduct(product)
                                } else {
                                  handleOpenEditModal(product)
                                }
                              }}
                              title="Edit product"
                              className="p-1.5 text-slate-500 hover:text-secondary hover:bg-purple-50 rounded-lg transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => setDeleteCandidate(product)}
                              title="Delete product"
                              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>

                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer Controls (No more than 20 displayed per page requirement) */}
          {pagination.totalPages > 1 && (
            <div className="bg-slate-50/80 px-4 sm:px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
              <div>
                Showing page <strong className="text-slate-900">{pagination.currentPage}</strong> of{' '}
                <strong className="text-slate-900">{pagination.totalPages}</strong> ({pagination.totalProducts} total products, max 20/page)
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={pagination.currentPage <= 1 || loading}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-300 bg-white font-semibold hover:bg-slate-100 disabled:opacity-40 transition-colors shadow-xs"
                >
                  Previous
                </button>
                <span className="font-bold text-slate-800 px-2">
                  {pagination.currentPage} / {pagination.totalPages}
                </span>
                <button
                  disabled={pagination.currentPage >= pagination.totalPages || loading}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-300 bg-white font-semibold hover:bg-slate-100 disabled:opacity-40 transition-colors shadow-xs"
                >
                  Next
                </button>
              </div>
            </div>
          )}

        </div>

      </main>

      {/* Add / Edit Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        productToEdit={productToEdit}
      />

      {/* Delete Confirmation Dialog Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full border border-slate-200 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Delete Product</h3>
              <p className="text-xs text-slate-600 mt-1">
                Are you sure you want to remove <strong className="text-slate-900">"{deleteCandidate.title}"</strong> from your pantry list?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default DashboardPage
