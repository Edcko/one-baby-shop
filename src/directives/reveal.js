/**
 * v-reveal — scroll-triggered entrance (IntersectionObserver).
 *
 * Usage: <div v-reveal> or staggered: <div v-reveal="120">
 * (the value is the delay in ms).
 *
 * Reduced motion needs no JS here: the global CSS rule already collapses
 * transitions to 0.01ms, so elements simply appear.
 */
let observer = null

function getObserver() {
  if (observer) return observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  )
  return observer
}

export const reveal = {
  mounted(el, binding) {
    el.classList.add('reveal')
    if (typeof binding.value === 'number') {
      el.style.transitionDelay = `${binding.value}ms`
    }
    getObserver().observe(el)
  },
  unmounted(el) {
    observer?.unobserve(el)
  },
}
