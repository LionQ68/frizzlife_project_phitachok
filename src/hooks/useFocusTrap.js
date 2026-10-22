import { useEffect, useRef } from 'react'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

let lastInteractionElement = null

if (typeof document !== 'undefined') {
  const rememberInteractionElement = (event) => {
    const interactiveElement = event.target.closest?.(FOCUSABLE_SELECTOR)

    if (interactiveElement instanceof HTMLElement) {
      lastInteractionElement = interactiveElement
    }
  }

  document.addEventListener('pointerdown', rememberInteractionElement, true)
  document.addEventListener('click', rememberInteractionElement, true)

  document.addEventListener('keydown', (event) => {
    if ((event.key === 'Enter' || event.key === ' ') && document.activeElement instanceof HTMLElement) {
      lastInteractionElement = document.activeElement
    }
  }, true)
}

function getFocusableElements(container) {
  return [...container.querySelectorAll(FOCUSABLE_SELECTOR)].filter((element) => (
    !element.hasAttribute('hidden')
    && element.getAttribute('aria-hidden') !== 'true'
    && element.getClientRects().length > 0
  ))
}

export function useFocusTrap({ active = true, lockScroll = true, onClose }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!active || !containerRef.current) {
      return undefined
    }

    const container = containerRef.current
    const activeElement = document.activeElement
    const previouslyFocused = activeElement instanceof HTMLElement
      && activeElement !== document.body
      && !container.contains(activeElement)
      ? activeElement
      : lastInteractionElement
    const previousOverflow = document.body.style.overflow
    const initialFocus = container.querySelector('[autofocus]')
      ?? getFocusableElements(container)[0]
      ?? container

    if (lockScroll) {
      document.body.style.overflow = 'hidden'
    }

    const initialFocusFrame = window.requestAnimationFrame(() => {
      if (initialFocus.isConnected) {
        initialFocus.focus({ preventScroll: true })
      }
    })

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && onClose) {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const focusableElements = getFocusableElements(container)

      if (focusableElements.length === 0) {
        event.preventDefault()
        container.focus()
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements.at(-1)

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.cancelAnimationFrame(initialFocusFrame)
      document.removeEventListener('keydown', handleKeyDown)

      if (lockScroll) {
        document.body.style.overflow = previousOverflow
      }

      if (previouslyFocused instanceof HTMLElement) {
        window.requestAnimationFrame(() => {
          if (previouslyFocused.isConnected) {
            previouslyFocused.focus({ preventScroll: true })
          }
        })
      }
    }
  }, [active, lockScroll, onClose])

  return containerRef
}
