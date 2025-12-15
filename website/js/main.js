// Main JavaScript for LocalForge Website

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuButton = document.getElementById('mobile-menu-button')
  const mobileMenu = document.getElementById('mobile-menu')
  
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden')
    })
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
      const isClickInside = mobileMenuButton.contains(event.target) || mobileMenu.contains(event.target)
      
      if (!isClickInside && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden')
      }
    })
  }
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href')
      
      // Skip empty anchors
      if (href === '#') return
      
      e.preventDefault()
      const target = document.querySelector(href)
      
      if (target) {
        const offset = 80 // Height of fixed header
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        })
        
        // Close mobile menu if open
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden')
        }
        
        // Update URL without jumping
        history.pushState(null, null, href)
      }
    })
  })
  
  // Active navigation highlighting for docs page
  if (window.location.pathname.includes('docs.html')) {
    let activeSection = null
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeSection = entry.target.getAttribute('id')
          }
        })
        
        // Update active link
        if (activeSection) {
          // Remove active class from all links
          document.querySelectorAll('.doc-sidebar a').forEach((link) => {
            link.classList.remove('text-blue-600', 'bg-blue-50', 'font-medium')
            link.classList.add('text-gray-700')
          })
          
          // Add active class to current link
          const activeLink = document.querySelector(`.doc-sidebar a[href="#${activeSection}"]`)
          if (activeLink) {
            activeLink.classList.add('text-blue-600', 'bg-blue-50', 'font-medium')
            activeLink.classList.remove('text-gray-700')
          }
        }
      },
      {
        rootMargin: '-20% 0px -70% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1]
      }
    )
    
    // Observe all sections
    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section)
    })
    
    // Handle initial page load with hash
    if (window.location.hash) {
      const initialId = window.location.hash.substring(1)
      const initialLink = document.querySelector(`.doc-sidebar a[href="#${initialId}"]`)
      if (initialLink) {
        document.querySelectorAll('.doc-sidebar a').forEach((link) => {
          link.classList.remove('text-blue-600', 'bg-blue-50', 'font-medium')
          link.classList.add('text-gray-700')
        })
        initialLink.classList.add('text-blue-600', 'bg-blue-50', 'font-medium')
        initialLink.classList.remove('text-gray-700')
      }
    }
    
    // Update active state on manual click
    document.querySelectorAll('.doc-sidebar a').forEach((link) => {
      link.addEventListener('click', function(_e) {
        const href = this.getAttribute('href')
        if (href && href.startsWith('#')) {
          // Remove active from all
          document.querySelectorAll('.doc-sidebar a').forEach((l) => {
            l.classList.remove('text-blue-600', 'bg-blue-50', 'font-medium')
            l.classList.add('text-gray-700')
          })
          // Add active to clicked
          this.classList.add('text-blue-600', 'bg-blue-50', 'font-medium')
          this.classList.remove('text-gray-700')
        }
      })
    })
  }
  
  // Lazy load images
  const images = document.querySelectorAll('img[data-src]')
  const imageObserver = new IntersectionObserver((entries, _observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.add('loaded')
        imageObserver.unobserve(img)
      }
    })
  })
  
  images.forEach(img => imageObserver.observe(img))
  
  // Add animation on scroll
  const animateOnScroll = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '0'
          entry.target.style.transform = 'translateY(20px)'
          
          setTimeout(() => {
            entry.target.style.transition = 'all 0.6s ease-out'
            entry.target.style.opacity = '1'
            entry.target.style.transform = 'translateY(0)'
          }, 100)
          
          animateOnScroll.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  )
  
  // Auto-animate elements on scroll
  document.querySelectorAll('section > div > div').forEach((el, index) => {
    el.style.opacity = '0'
    el.style.transform = 'translateY(20px)'
    setTimeout(() => {
      animateOnScroll.observe(el)
    }, index * 50)
  })
  
  // Parallax effect for hero section
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset
    const heroElements = document.querySelectorAll('.animate-float')
    heroElements.forEach((el, index) => {
      const speed = 0.5 + (index * 0.1)
      el.style.transform = `translateY(${scrolled * speed}px)`
    })
  })
  
  // Interactive floating tech logos
  const floatingLogos = document.querySelectorAll('.floating-tech-logo')
  floatingLogos.forEach((logo) => {
    logo.addEventListener('click', function(_e) {
      // Add a pulse animation on click
      this.style.animation = 'none'
      setTimeout(() => {
        this.style.animation = ''
      }, 10)
      
      // Create ripple effect
      const ripple = document.createElement('div')
      ripple.className = 'absolute inset-0 bg-blue-400 rounded-2xl opacity-50 animate-ping'
      this.appendChild(ripple)
      setTimeout(() => ripple.remove(), 600)
    })
    
    // Add subtle rotation on mouse move
    logo.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      const rotateX = (y / rect.height) * 10
      const rotateY = -(x / rect.width) * 10
      
      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`
    })
    
    logo.addEventListener('mouseleave', function() {
      this.style.transform = ''
    })
  })
  
  // Copy code to clipboard
  document.querySelectorAll('pre code').forEach((codeBlock) => {
    const button = document.createElement('button')
    button.className = 'absolute top-2 right-2 px-3 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-600 transition'
    button.textContent = 'Copy'
    
    const pre = codeBlock.parentNode
    pre.style.position = 'relative'
    pre.appendChild(button)
    
    button.addEventListener('click', () => {
      const code = codeBlock.textContent
      navigator.clipboard.writeText(code).then(() => {
        button.textContent = 'Copied!'
        setTimeout(() => {
          button.textContent = 'Copy'
        }, 2000)
      })
    })
  })
  
  // Detect OS and update download button
  const downloadButtons = document.querySelectorAll('a[href*="download"]')
  const os = detectOS()
  
  downloadButtons.forEach(button => {
    if (button.textContent.includes('Download for')) {
      if (os === 'Linux') {
        button.textContent = button.textContent.replace('Download for Linux', 'Download for Linux')
      } else if (os === 'Windows') {
        button.textContent = 'Coming Soon for Windows'
        button.classList.add('opacity-50', 'cursor-not-allowed')
        button.addEventListener('click', (e) => {
          e.preventDefault()
          alert('Windows version is coming soon!')
        })
      } else if (os === 'Mac') {
        button.textContent = 'Coming Soon for macOS'
        button.classList.add('opacity-50', 'cursor-not-allowed')
        button.addEventListener('click', (e) => {
          e.preventDefault()
          alert('macOS version is coming soon!')
        })
      }
    }
  })
  
  // Analytics (placeholder - replace with your analytics)
  // trackPageView()
})

// Helper function to detect OS
function detectOS() {
  const platform = window.navigator.platform
  const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K']
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE']
  
  if (macosPlatforms.indexOf(platform) !== -1) {
    return 'Mac'
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    return 'Windows'
  } else if (/Linux/.test(platform)) {
    return 'Linux'
  }
  
  return 'Unknown'
}

// Scroll to top button (optional)
const scrollToTopBtn = document.getElementById('scroll-to-top')
if (scrollToTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.classList.remove('hidden')
    } else {
      scrollToTopBtn.classList.add('hidden')
    }
  })
  
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  })
}

// Form submission handling (if needed)
const contactForm = document.getElementById('contact-form')
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    
    const formData = new FormData(contactForm)
    const data = Object.fromEntries(formData)
    
    try {
      // Replace with your form submission endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (response.ok) {
        alert('Message sent successfully!')
        contactForm.reset()
      } else {
        alert('Failed to send message. Please try again.')
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error:', error)
      alert('An error occurred. Please try again later.')
    }
  })
}

// Track external links
document.querySelectorAll('a[target="_blank"]').forEach(link => {
  link.addEventListener('click', () => {
    // Track external link click (replace with your analytics)
    // eslint-disable-next-line no-console
    console.log('External link clicked:', link.href)
  })
})

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  // Press '/' to focus search (if search is implemented)
  if (e.key === '/' && !e.target.matches('input, textarea')) {
    e.preventDefault()
    const searchInput = document.getElementById('search')
    if (searchInput) {
      searchInput.focus()
    }
  }
  
  // Press 'Esc' to close mobile menu
  if (e.key === 'Escape') {
    const mobileMenu = document.getElementById('mobile-menu')
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden')
    }
  }
})

// Service Worker registration (for PWA - optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Uncomment to enable service worker
    // navigator.serviceWorker.register('/sw.js')
    //   .then(registration => console.log('SW registered:', registration))
    //   .catch(error => console.log('SW registration failed:', error))
  })
}
