import './App.css'
import ChatUI from './ChatUI'
import { useState, useEffect } from 'react'

function App() {
  const [isHealthy, setIsHealthy] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const checkHealth = async () => {
      try {
        setIsLoading(true)
        
        const response = await fetch('http://localhost:5000/health', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (response) {
          const data = await response.json()
          console.log('Health check response:', data)
          setIsHealthy(true)
        } else {
          throw new Error(`Health check failed: ${response.status}`)
        }
      } catch (err) {
        console.error('Health check error:', err)
        setError(err.message)
        // You can choose to show ChatUI anyway or keep showing error
        // For now, let's show ChatUI even if health check fails
        setIsHealthy(true)
      } finally {
        setIsLoading(false)
      }
    }

    checkHealth()
  }, [])

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#333'
      }}>
        Connecting to Server Please wait ...
      </div>
    )
  }

  if (error && !isHealthy) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.5rem',
        color: '#d32f2f'
      }}>
        <div>Connection Failed</div>
        <div style={{ fontSize: '1rem', marginTop: '1rem', color: '#666' }}>
          {error}
        </div>
      </div>
    )
  }

  return (
    <>
      <ChatUI />
    </>
  )
}

export default App