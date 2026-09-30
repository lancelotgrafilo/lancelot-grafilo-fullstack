import { useEffect } from 'react'

export function usePageTitle(title) {
  useEffect(() => {
    const previous = document.title
    document.title = title ? `${title} | Lancelot Grafilo` : 'Lancelot Grafilo | Full-Stack Developer'
    return () => {
      document.title = previous
    }
  }, [title])
}