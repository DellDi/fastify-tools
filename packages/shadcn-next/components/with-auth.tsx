'use client'
import { useState, useEffect } from 'react'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { User } from '@/types/user'

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
}

export const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    }
    localStorage.removeItem('accessToken')
    setUser(null)
    router.push('/login')
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken')
        if (!accessToken) {
          throw new Error('No access token')
        }

        const response = await axios.get('/api/protected', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        setUser(response.data.user)
      } catch (error: any) {
        if (error.response?.status === 401) {
          try {
            const refreshResponse = await axios.post('/api/auth/refresh')
            localStorage.setItem('accessToken', refreshResponse.data.accessToken)
            const response = await axios.get('/api/protected', {
              headers: { Authorization: `Bearer ${refreshResponse.data.accessToken}` },
            })
            setUser(response.data.user)
          } catch (refreshError: any) {
            localStorage.removeItem('accessToken')
            setUser(null)
            router.push('/login')
          }
        } else {
          console.error('Error fetching user:', error)
          localStorage.removeItem('accessToken')
          setUser(null)
          router.push('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  return { user, loading, logout }
}

export const withAuth = (WrappedComponent: React.ComponentType) => {
  const WithAuth = (props: any) => {
    const { user, loading } = useAuth()
    if (loading) {
      return <div>Loading...</div>
    }

    if (!user) {
      return null
    }

    return <WrappedComponent {...props} user={user}/>
  }

  return WithAuth
}
