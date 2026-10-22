import { useContext } from 'react'
import { AppContext } from './AppContext.js'

export function useAppContext() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useAppContext ต้องเรียกใช้ภายใน AppProvider')
  }

  return context
}
