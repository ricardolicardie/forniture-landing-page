// Animate On Scroll (AOS) Library - Simplified Version
class AOS {
  constructor() {
    this.elements = []
    this.observer = null
    this.init()
  }

  init() {
    this.createObserver()
    this.refresh()
  }

  createObserver() {
    const options = {
      root: null,
      rootMargin: "0px 0px -100px 0px",
      threshold: 0.1,
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const element = entry.target

        if (entry.isIntersecting) {
          this.animateElement(element)
        } else if (this.shouldResetAnimation(element)) {
          this.resetElement(element)
        }
      })
    }, options)
  }

  refresh() {
    // Disconnect existing observer
    if (this.observer) {
      this.observer.disconnect()
    }

    // Find all elements with data-aos attribute
    this.elements = document.querySelectorAll("[data-aos]")

    // Setup each element
    this.elements.forEach((element) => {
      this.setupElement(element)
      this.observer.observe(element)
    })
  }

  setupElement(element) {
    const animationType = element.getAttribute("data-aos")
    const delay = element.getAttribute("data-aos-delay") || "0"
    const duration = element.getAttribute("data-aos-duration") || "600"

    // Set initial state
    element.style.transitionDelay = `${delay}ms`
    element.style.transitionDuration = `${duration}ms`

    // Add initial animation class
    element.classList.add("aos-element")

    // Set initial transform based on animation type
    this.setInitialState(element, animationType)
  }

  setInitialState(element, animationType) {
    switch (animationType) {
      case "fade-up":
        element.style.opacity = "0"
        element.style.transform = "translateY(30px)"
        break
      case "fade-down":
        element.style.opacity = "0"
        element.style.transform = "translateY(-30px)"
        break
      case "fade-left":
        element.style.opacity = "0"
        element.style.transform = "translateX(30px)"
        break
      case "fade-right":
        element.style.opacity = "0"
        element.style.transform = "translateX(-30px)"
        break
      case "fade-in":
        element.style.opacity = "0"
        break
      case "zoom-in":
        element.style.opacity = "0"
        element.style.transform = "scale(0.8)"
        break
      case "zoom-out":
        element.style.opacity = "0"
        element.style.transform = "scale(1.2)"
        break
      case "slide-up":
        element.style.transform = "translateY(100%)"
        break
      case "slide-down":
        element.style.transform = "translateY(-100%)"
        break
      case "slide-left":
        element.style.transform = "translateX(100%)"
        break
      case "slide-right":
        element.style.transform = "translateX(-100%)"
        break
      case "flip-left":
        element.style.opacity = "0"
        element.style.transform = "rotateY(-90deg)"
        break
      case "flip-right":
        element.style.opacity = "0"
        element.style.transform = "rotateY(90deg)"
        break
      case "flip-up":
        element.style.opacity = "0"
        element.style.transform = "rotateX(-90deg)"
        break
      case "flip-down":
        element.style.opacity = "0"
        element.style.transform = "rotateX(90deg)"
        break
      default:
        element.style.opacity = "0"
        element.style.transform = "translateY(30px)"
    }
  }

  animateElement(element) {
    const animationType = element.getAttribute("data-aos")

    // Add animated class
    element.classList.add("aos-animate")

    // Reset to final state
    element.style.opacity = "1"
    element.style.transform = "none"

    // Add custom easing
    const easing = element.getAttribute("data-aos-easing") || "ease-out"
    element.style.transitionTimingFunction = this.getEasing(easing)

    // Trigger custom event
    element.dispatchEvent(
      new CustomEvent("aos:in", {
        detail: { animationType },
      }),
    )
  }

  resetElement(element) {
    const animationType = element.getAttribute("data-aos")

    // Remove animated class
    element.classList.remove("aos-animate")

    // Reset to initial state
    this.setInitialState(element, animationType)

    // Trigger custom event
    element.dispatchEvent(
      new CustomEvent("aos:out", {
        detail: { animationType },
      }),
    )
  }

  shouldResetAnimation(element) {
    // Only reset if data-aos-once is not set to true
    const once = element.getAttribute("data-aos-once")
    return once !== "true"
  }

  getEasing(easing) {
    const easings = {
      linear: "linear",
      ease: "ease",
      "ease-in": "ease-in",
      "ease-out": "ease-out",
      "ease-in-out": "ease-in-out",
      "ease-in-back": "cubic-bezier(0.600, -0.280, 0.735, 0.045)",
      "ease-out-back": "cubic-bezier(0.175, 0.885, 0.320, 1.275)",
      "ease-in-out-back": "cubic-bezier(0.680, -0.550, 0.265, 1.550)",
      "ease-in-sine": "cubic-bezier(0.470, 0.000, 0.745, 0.715)",
      "ease-out-sine": "cubic-bezier(0.390, 0.575, 0.565, 1.000)",
      "ease-in-out-sine": "cubic-bezier(0.445, 0.050, 0.550, 0.950)",
      "ease-in-quad": "cubic-bezier(0.550, 0.085, 0.680, 0.530)",
      "ease-out-quad": "cubic-bezier(0.250, 0.460, 0.450, 0.940)",
      "ease-in-out-quad": "cubic-bezier(0.455, 0.030, 0.515, 0.955)",
      "ease-in-cubic": "cubic-bezier(0.550, 0.055, 0.675, 0.190)",
      "ease-out-cubic": "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
      "ease-in-out-cubic": "cubic-bezier(0.645, 0.045, 0.355, 1.000)",
    }

    return easings[easing] || easings["ease-out"]
  }

  // Public methods
  refreshHard() {
    this.refresh()
  }

  disable() {
    if (this.observer) {
      this.observer.disconnect()
    }
  }

  enable() {
    this.refresh()
  }
}

// Initialize AOS when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.AOS = new AOS()
})

// Refresh AOS on window resize
window.addEventListener("resize", () => {
  if (window.AOS) {
    setTimeout(() => {
      window.AOS.refresh()
    }, 100)
  }
})

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = AOS
}
