const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001').replace(/\/+$/, '')

/**
 * Helper to retrieve stored auth token
 */
function getAuthHeader() {
  const token = localStorage.getItem('expiry_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

/**
 * Safely parse JSON response from fetch
 */
async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    try {
      return await response.json()
    } catch (e) {
      return { message: 'Failed to parse JSON response from server.' }
    }
  }
  const text = await response.text()
  return { message: text || 'Server returned an invalid response format.' }
}

/**
 * Fetch products list with pagination, search, and expiry filtering
 */
export async function fetchProducts({ page = 1, limit = 20, search = '', expiryFilter = '' } = {}) {
  const queryParams = new URLSearchParams()
  if (page) queryParams.append('page', page)
  if (limit) queryParams.append('limit', limit)
  if (search) queryParams.append('search', search)
  if (expiryFilter && expiryFilter !== 'all') queryParams.append('expiryFilter', expiryFilter)

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ''

  const candidateUrls = [`${API_BASE_URL}/api/products${queryString}`]
  if (!import.meta.env.VITE_API_BASE_URL) {
    candidateUrls.push(
      `http://localhost:5001/api/products${queryString}`,
      `http://localhost:5000/api/products${queryString}`
    )
  }

  const uniqueUrls = [...new Set(candidateUrls)]
  let lastErrorMsg = 'Network error. Could not reach backend server.'

  for (const url of uniqueUrls) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      })

      if (response.status === 404) continue

      const data = await parseResponse(response)

      if (!response.ok) {
        return {
          success: false,
          status: response.status,
          message: data.message || 'Failed to fetch products',
        }
      }

      return {
        success: true,
        data: data.data || [],
        pagination: data.pagination || { totalProducts: 0, totalPages: 1, currentPage: 1, limit: 20 },
      }
    } catch (error) {
      lastErrorMsg = error.message || lastErrorMsg
    }
  }

  return {
    success: false,
    message: lastErrorMsg,
    data: [],
    pagination: { totalProducts: 0, totalPages: 1, currentPage: 1, limit: 20 },
  }
}

/**
 * Create a new product record
 */
export async function createProduct(productData) {
  const candidateUrls = [`${API_BASE_URL}/api/products`]
  if (!import.meta.env.VITE_API_BASE_URL) {
    candidateUrls.push(
      'http://localhost:5001/api/products',
      'http://localhost:5000/api/products'
    )
  }

  const uniqueUrls = [...new Set(candidateUrls)]
  let lastErrorMsg = 'Network error. Could not reach backend server.'

  for (const url of uniqueUrls) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(productData),
      })

      if (response.status === 404) continue

      const data = await parseResponse(response)

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to create product',
        }
      }

      return {
        success: true,
        data: data.data,
        message: data.message || 'Product created successfully',
      }
    } catch (error) {
      lastErrorMsg = error.message || lastErrorMsg
    }
  }

  return { success: false, message: lastErrorMsg }
}

/**
 * Update an existing product by ID
 */
export async function updateProduct(id, productData) {
  const candidateUrls = [`${API_BASE_URL}/api/products/${id}`]
  if (!import.meta.env.VITE_API_BASE_URL) {
    candidateUrls.push(
      `http://localhost:5001/api/products/${id}`,
      `http://localhost:5000/api/products/${id}`
    )
  }

  const uniqueUrls = [...new Set(candidateUrls)]
  let lastErrorMsg = 'Network error. Could not reach backend server.'

  for (const url of uniqueUrls) {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(productData),
      })

      if (response.status === 404) continue

      const data = await parseResponse(response)

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to update product',
        }
      }

      return {
        success: true,
        data: data.data,
        message: data.message || 'Product updated successfully',
      }
    } catch (error) {
      lastErrorMsg = error.message || lastErrorMsg
    }
  }

  return { success: false, message: lastErrorMsg }
}

/**
 * Delete a product by ID
 */
export async function deleteProduct(id) {
  const candidateUrls = [`${API_BASE_URL}/api/products/${id}`]
  if (!import.meta.env.VITE_API_BASE_URL) {
    candidateUrls.push(
      `http://localhost:5001/api/products/${id}`,
      `http://localhost:5000/api/products/${id}`
    )
  }

  const uniqueUrls = [...new Set(candidateUrls)]
  let lastErrorMsg = 'Network error. Could not reach backend server.'

  for (const url of uniqueUrls) {
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      })

      if (response.status === 404) continue

      const data = await parseResponse(response)

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to delete product',
        }
      }

      return {
        success: true,
        message: data.message || 'Product deleted successfully',
      }
    } catch (error) {
      lastErrorMsg = error.message || lastErrorMsg
    }
  }

  return { success: false, message: lastErrorMsg }
}

