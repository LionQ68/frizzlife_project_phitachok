import { useEffect, useState } from 'react'

export function useMediaQuery(query) {
  const getMatches = () => (
    typeof window !== 'undefined' && window.matchMedia(query).matches
  )
  const [matches, setMatches] = useState(getMatches)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const updateMatches = (event) => setMatches(event.matches)

    mediaQuery.addEventListener('change', updateMatches)

    return () => mediaQuery.removeEventListener('change', updateMatches)
  }, [query])

  return matches
}
