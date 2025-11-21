// API utility functions for testing
export const mockFetch = (data, ok = true) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok,
      json: () => Promise.resolve(data),
      status: ok ? 200 : 400,
      statusText: ok ? 'OK' : 'Bad Request'
    })
  )
}

export const apiCall = async (endpoint, options = {}) => {
  const response = await fetch(`http://localhost:5000/api${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  })
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  return response.json()
}

describe('API Utils', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('makes successful API call', async () => {
    const mockData = { message: 'Success', data: [] }
    mockFetch(mockData)

    const result = await apiCall('/test')
    
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:5000/api/test',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        })
      })
    )
    expect(result).toEqual(mockData)
  })

  it('handles API errors correctly', async () => {
    mockFetch({ error: 'Not found' }, false)

    await expect(apiCall('/notfound')).rejects.toThrow('HTTP error! status: 400')
  })

  it('sends POST request with data', async () => {
    const mockData = { id: 1, name: 'Test User' }
    mockFetch(mockData)

    const postData = { name: 'New User', email: 'test@example.com' }
    
    await apiCall('/users', {
      method: 'POST',
      body: JSON.stringify(postData)
    })

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:5000/api/users',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(postData),
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        })
      })
    )
  })
})