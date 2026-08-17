const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001').replace(/\/+$/, '')

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
 * Log in an existing user
 * @param {Object} credentials - { email, password }
 */
export async function loginUser(credentials) {
  const candidateUrls = [
    `${API_BASE_URL}/auth/login`,
    `${API_BASE_URL}/api/auth/login`,
    'http://localhost:5001/auth/login',
    'http://localhost:5000/auth/login',
  ]

  // Remove duplicate URLs if API_BASE_URL matches any fallback
  const uniqueUrls = [...new Set(candidateUrls)]
  let lastErrorMsg = 'Network error. Could not reach backend server on port 5001.'

  for (const url of uniqueUrls) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      // If route not found on this candidate URL, try next candidate
      if (response.status === 404) {
        continue
      }

      const data = await parseResponse(response)

      if (!response.ok) {
        return {
          success: false,
          status: response.status,
          message: data.message || 'Login failed. Please check your credentials.',
          errors: data.errors || null,
        }
      }

      return {
        success: true,
        data: data.data,
        message: data.message || 'Logged in successfully',
      }
    } catch (error) {
      lastErrorMsg = error.message || lastErrorMsg
    }
  }

  return {
    success: false,
    message: lastErrorMsg.includes('Failed to fetch')
      ? 'Unable to connect to backend server. Please verify Express server is running on http://localhost:5001.'
      : lastErrorMsg,
  }
}

/**
 * Register a new user
 * @param {Object} userData - { name, email, password }
 */
export async function registerUser(userData) {
  const candidateUrls = [
    `${API_BASE_URL}/auth/register`,
    `${API_BASE_URL}/api/auth/register`,
    'http://localhost:5001/auth/register',
    'http://localhost:5000/auth/register',
  ]

  const uniqueUrls = [...new Set(candidateUrls)]
  let lastErrorMsg = 'Network error. Could not reach backend server on port 5001.'

  for (const url of uniqueUrls) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      // If route not found on this candidate URL, try next candidate
      if (response.status === 404) {
        continue
      }

      const data = await parseResponse(response)

      if (!response.ok) {
        return {
          success: false,
          status: response.status,
          message: data.message || 'Registration failed.',
          errors: data.errors || null,
        }
      }

      return {
        success: true,
        data: data.data,
        message: data.message || 'User registered successfully',
      }
    } catch (error) {
      lastErrorMsg = error.message || lastErrorMsg
    }
  }

  return {
    success: false,
    message: lastErrorMsg.includes('Failed to fetch')
      ? 'Unable to connect to backend server. Please verify Express server is running on http://localhost:5001.'
      : lastErrorMsg,
  }
}
