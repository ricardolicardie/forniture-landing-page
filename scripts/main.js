// Main JavaScript functionality
class PantoApp {
  constructor() {
    this.cart = []
    this.currentTestimonial = 0
    this.testimonialInterval = null
    this.init()
  }

  init() {
    this.setupEventListeners()
    this.initializeAOS()
    this.startTestimonialCarousel()
    this.updateCartDisplay()
  }

  setupEventListeners() {
    // Mobile menu
    const mobileMenuBtn = document.getElementById("mobileMenuBtn")
    const mobileMenuOverlay = document.getElementById("mobileMenuOverlay")
    const mobileMenuClose = document.getElementById("mobileMenuClose")

    mobileMenuBtn?.addEventListener("click", () => this.toggleMobileMenu())
    mobileMenuClose?.addEventListener("click", () => this.closeMobileMenu())
    mobileMenuOverlay?.addEventListener("click", (e) => {
      if (e.target === mobileMenuOverlay) {
        this.closeMobileMenu()
      }
    })

    // Mobile menu links
    document.querySelectorAll(".mobile-menu-link").forEach((link) => {
      link.addEventListener("click", () => this.closeMobileMenu())
    })

    // Header scroll effect
    window.addEventListener("scroll", () => this.handleHeaderScroll())

    // Search functionality
    const searchBtn = document.getElementById("searchBtn")
    const searchInput = document.getElementById("searchInput")
    const searchContainer = document.querySelector(".search-container")

    searchBtn?.addEventListener("click", (e) => {
      e.preventDefault()
      this.toggleSearchExpansion()
    })

    searchInput?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.handleSearch()
      }
    })

    document.addEventListener("click", (e) => {
      if (!searchContainer?.contains(e.target)) {
        this.collapseSearch()
      }
    })

    // Product tabs
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => this.switchTab(e.target.dataset.tab))
    })

    // Add to cart buttons
    document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => this.addToCart(e.target))
    })

    // Testimonial controls
    const prevBtn = document.getElementById("prevTestimonial")
    const nextBtn = document.getElementById("nextTestimonial")

    prevBtn?.addEventListener("click", () => this.previousTestimonial())
    nextBtn?.addEventListener("click", () => this.nextTestimonial())

    // Testimonial indicators
    document.querySelectorAll(".indicator").forEach((indicator, index) => {
      indicator.addEventListener("click", () => this.goToTestimonial(index))
    })

    // CTA button
    const ctaButton = document.getElementById("ctaButton")
    ctaButton?.addEventListener("click", () => this.scrollToProducts())

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => this.handleSmoothScroll(e))
    })

    // Cart button
    const cartBtn = document.getElementById("cartBtn")
    cartBtn?.addEventListener("click", () => this.showCart())

    // Pause testimonial carousel on hover
    const carousel = document.getElementById("testimonialsCarousel")
    carousel?.addEventListener("mouseenter", () => this.pauseTestimonialCarousel())
    carousel?.addEventListener("mouseleave", () => this.resumeTestimonialCarousel())
  }

  // Mobile Menu Functions
  toggleMobileMenu() {
    const overlay = document.getElementById("mobileMenuOverlay")
    const btn = document.getElementById("mobileMenuBtn")

    overlay?.classList.toggle("active")
    btn?.classList.toggle("active")

    // Prevent body scroll when menu is open
    document.body.style.overflow = overlay?.classList.contains("active") ? "hidden" : ""
  }

  closeMobileMenu() {
    const overlay = document.getElementById("mobileMenuOverlay")
    const btn = document.getElementById("mobileMenuBtn")

    overlay?.classList.remove("active")
    btn?.classList.remove("active")
    document.body.style.overflow = ""
  }

  // Header Scroll Effect
  handleHeaderScroll() {
    const header = document.getElementById("header")
    const scrolled = window.scrollY > 100

    header?.classList.toggle("scrolled", scrolled)
    header?.classList.toggle("sticky-rounded", scrolled)
  }

  // Search Functionality
  handleSearch() {
    const searchInput = document.getElementById("searchInput")
    const query = searchInput?.value.trim()

    if (query) {
      console.log("Searching for:", query)
      this.performProductSearch(query)
      this.showNotification(`Buscando: "${query}"`)
      this.collapseSearch()
    }
  }

  performProductSearch(query) {
    const products = [
      "Sakarias Armchair",
      "Baltsar Chair",
      "Anjay Chair",
      "Nyantuy Chair",
      "Modern Sofa",
      "Luxury Chair",
      "Office Chair",
      "Dining Chair",
    ]

    const results = products.filter((product) => product.toLowerCase().includes(query.toLowerCase()))

    if (results.length > 0) {
      console.log("Found products:", results)
      // Here you would highlight or scroll to matching products
      this.highlightSearchResults(results)
    } else {
      this.showNotification("No se encontraron productos")
    }
  }

  highlightSearchResults(results) {
    // Remove previous highlights
    document.querySelectorAll(".product-card").forEach((card) => {
      card.classList.remove("search-highlight")
    })

    // Highlight matching products
    results.forEach((productName) => {
      const productCard = document.querySelector(`[data-product="${productName}"]`)?.closest(".product-card")
      if (productCard) {
        productCard.classList.add("search-highlight")
        setTimeout(() => {
          productCard.classList.remove("search-highlight")
        }, 3000)
      }
    })
  }

  // Product Tabs
  switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === tabName)
    })

    // Update tab content
    document.querySelectorAll(".tab-content").forEach((content) => {
      content.classList.toggle("active", content.id === tabName)
    })

    // Trigger AOS animations for new content
    this.refreshAOS()
  }

  // Cart Functionality
  addToCart(button) {
    const productName = button.dataset.product
    const productPrice = Number.parseFloat(button.dataset.price)

    if (productName && productPrice) {
      const existingItem = this.cart.find((item) => item.name === productName)

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        this.cart.push({
          name: productName,
          price: productPrice,
          quantity: 1,
        })
      }

      this.updateCartDisplay()
      this.showCartNotification()

      // Add visual feedback
      button.style.transform = "scale(1.2)"
      setTimeout(() => {
        button.style.transform = ""
      }, 200)
    }
  }

  updateCartDisplay() {
    const cartCount = document.getElementById("cartCount")
    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0)

    if (cartCount) {
      cartCount.textContent = totalItems
      cartCount.classList.toggle("show", totalItems > 0)
    }
  }

  showCartNotification() {
    const notification = document.getElementById("cartNotification")

    if (notification) {
      notification.classList.add("show")
      setTimeout(() => {
        notification.classList.remove("show")
      }, 3000)
    }
  }

  showCart() {
    if (this.cart.length === 0) {
      this.showNotification("Tu carrito está vacío")
      return
    }

    const cartItems = this.cart.map((item) => `${item.name} - $${item.price} x ${item.quantity}`).join("\n")

    const total = this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    alert(`Carrito de Compras:\n\n${cartItems}\n\nTotal: $${total.toFixed(2)}`)
  }

  // Testimonial Carousel
  startTestimonialCarousel() {
    this.testimonialInterval = setInterval(() => {
      this.nextTestimonial()
    }, 5000)
  }

  pauseTestimonialCarousel() {
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval)
      this.testimonialInterval = null
    }
  }

  resumeTestimonialCarousel() {
    if (!this.testimonialInterval) {
      this.startTestimonialCarousel()
    }
  }

  nextTestimonial() {
    const testimonials = document.querySelectorAll(".testimonial-card")
    if (testimonials.length === 0) return

    this.currentTestimonial = (this.currentTestimonial + 1) % testimonials.length
    this.updateTestimonialDisplay()
  }

  previousTestimonial() {
    const testimonials = document.querySelectorAll(".testimonial-card")
    if (testimonials.length === 0) return

    this.currentTestimonial = this.currentTestimonial === 0 ? testimonials.length - 1 : this.currentTestimonial - 1
    this.updateTestimonialDisplay()
  }

  goToTestimonial(index) {
    this.currentTestimonial = index
    this.updateTestimonialDisplay()
  }

  updateTestimonialDisplay() {
    const testimonials = document.querySelectorAll(".testimonial-card")
    const indicators = document.querySelectorAll(".indicator")
    const track = document.getElementById("testimonialsTrack")

    // Update active testimonial
    testimonials.forEach((testimonial, index) => {
      testimonial.classList.toggle("active", index === this.currentTestimonial)
    })

    // Update indicators
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === this.currentTestimonial)
    })

    // Move track
    if (track) {
      track.style.transform = `translateX(-${this.currentTestimonial * 100}%)`
    }
  }

  // Smooth Scrolling
  handleSmoothScroll(e) {
    const href = e.target.getAttribute("href")

    if (href && href.startsWith("#")) {
      e.preventDefault()
      const target = document.querySelector(href)

      if (target) {
        const headerHeight = document.getElementById("header")?.offsetHeight || 0
        const targetPosition = target.offsetTop - headerHeight - 20

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    }
  }

  scrollToProducts() {
    const productsSection = document.getElementById("productos")
    if (productsSection) {
      const headerHeight = document.getElementById("header")?.offsetHeight || 0
      const targetPosition = productsSection.offsetTop - headerHeight - 20

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })
    }
  }

  // Utility Functions
  showNotification(message) {
    // Create a temporary notification
    const notification = document.createElement("div")
    notification.className = "cart-notification show"
    notification.innerHTML = `
            <div class="notification-content">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span>${message}</span>
            </div>
        `

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.classList.remove("show")
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 3000)
  }

  // AOS (Animate On Scroll) Functions
  initializeAOS() {
    this.observeElements()
  }

  observeElements() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("aos-animate")
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    document.querySelectorAll("[data-aos]").forEach((el) => {
      observer.observe(el)
    })
  }

  refreshAOS() {
    // Remove existing animations
    document.querySelectorAll("[data-aos]").forEach((el) => {
      el.classList.remove("aos-animate")
    })

    // Re-observe elements
    setTimeout(() => {
      this.observeElements()
    }, 100)
  }

  // Search Expansion Functions
  toggleSearchExpansion() {
    const searchContainer = document.querySelector(".search-container")
    const searchInput = document.getElementById("searchInput")

    if (searchContainer?.classList.contains("expanded")) {
      // If expanded and has content, perform search
      if (searchInput?.value.trim()) {
        this.handleSearch()
      } else {
        // If no content, collapse
        this.collapseSearch()
      }
    } else {
      // Expand search
      this.expandSearch()
    }
  }

  expandSearch() {
    const searchContainer = document.querySelector(".search-container")
    const searchInput = document.getElementById("searchInput")

    searchContainer?.classList.add("expanded")
    setTimeout(() => {
      searchInput?.focus()
      this.showSearchSuggestions()
    }, 300)
  }

  collapseSearch() {
    const searchContainer = document.querySelector(".search-container")
    const searchInput = document.getElementById("searchInput")

    searchContainer?.classList.remove("expanded")
    searchInput?.blur()
    this.hideSearchSuggestions()
  }

  showSearchSuggestions() {
    const suggestions = document.querySelector(".search-suggestions")
    if (suggestions) {
      suggestions.classList.add("show")
    }
  }

  hideSearchSuggestions() {
    const suggestions = document.querySelector(".search-suggestions")
    if (suggestions) {
      suggestions.classList.remove("show")
    }
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.pantoApp = new PantoApp()
})

// Handle page visibility change
document.addEventListener("visibilitychange", () => {
  const app = window.pantoApp
  if (app) {
    if (document.hidden) {
      app.pauseTestimonialCarousel()
    } else {
      app.resumeTestimonialCarousel()
    }
  }
})

// Handle window resize
window.addEventListener("resize", () => {
  // Close mobile menu on resize to desktop
  if (window.innerWidth >= 768) {
    const overlay = document.getElementById("mobileMenuOverlay")
    const btn = document.getElementById("mobileMenuBtn")

    overlay?.classList.remove("active")
    btn?.classList.remove("active")
    document.body.style.overflow = ""
  }
})
