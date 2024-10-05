import { ExoplanetContext } from '../context/ExoplanetContext'
import { useContext } from 'react'

export const useExoplanetContext = () => {
  const context = useContext(ExoplanetContext)

  if (!context) {
    throw Error('useExoplanetContext must be used inside an ExoplanetContextProvider')
  }

  return context
}