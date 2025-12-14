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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id')
            
            // Remove active class from all links
            document.querySelectorAll('.doc-sidebar a').forEach((link) => {
              link.classList.remove('active', 'text-blue-600', 'bg-blue-50')
              link.classList.add('text-gray-700')
            })
            
            // Add active class to current link
            const activeLink = document.querySelector(`.doc-sidebar a[href="#${id}"]`)
            if (activeLink) {
              activeLink.classList.add('active', 'text-blue-600', 'bg-blue-50')
              activeLink.classList.remove('text-gray-700')
            }
          }
        })
      },
      {
        rootMargin: '-100px 0px -66%',
      }
    )
    
    // Observe all sections
    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section)
    })
  }
  
  // Lazy load images
  const images = document.querySelectorAll('img[data-src]')
  const imageObserver = new IntersectionObserver((entries, observer) => {
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
          entry.target.classList.add('fade-in')
          animateOnScroll.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.1,
    }
  )
  
  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    animateOnScroll.observe(el)
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
  const userAgent = window.navigator.userAgent
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
      console.error('Error:', error)
      alert('An error occurred. Please try again later.')
    }
  })
}

// Track external links
document.querySelectorAll('a[target="_blank"]').forEach(link => {
  link.addEventListener('click', () => {
    // Track external link click (replace with your analytics)
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
