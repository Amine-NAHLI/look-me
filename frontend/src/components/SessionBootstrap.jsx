import { useEffect } from 'react'
import api from '../utils/axiosConfig'
import { useUIStore } from '../store/useUIStore'

export default function SessionBootstrap() {
  const setAccessToken = useUIStore((state) => state.setAccessToken)
  const setUser = useUIStore((state) => state.setUser)

  useEffect(() => {
    let active = true
    api.post('/auth/refresh').then(({ data }) => {
      if (active) setAccessToken(data.accessToken)
    }).catch(() => {
      if (active) setUser(null)
    })
    return () => { active = false }
  }, [setAccessToken, setUser])

  return null
}
