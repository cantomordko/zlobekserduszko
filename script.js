const yearEl = document.getElementById('year')
if (yearEl) yearEl.textContent = new Date().getFullYear()

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(a =>
	a.addEventListener('click', e => {
		const id = a.getAttribute('href')
		if (id.length > 1) {
			const el = document.querySelector(id)
			if (el) {
				e.preventDefault()
				el.scrollIntoView({ behavior: 'smooth', block: 'start' })
			}
		}
	})
)

// Initialize map and scroll effects when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
	if (typeof L !== 'undefined' && document.getElementById('krakow-map')) {
		initializeMap()
	}
	initializeScrollEffects()
	initializeLogoClick()
	initializeHeroCarousel()
})

// Logo click functionality for homepage navigation
function initializeLogoClick() {
	const logoContainer = document.querySelector('.navbar-logo')
	if (logoContainer) {
		logoContainer.style.cursor = 'pointer'
		logoContainer.addEventListener('click', function () {
			// Check if we're on the homepage
			if (
				window.location.pathname === '/' ||
				window.location.pathname.endsWith('index.html') ||
				window.location.pathname === '/index.html'
			) {
				// On homepage - scroll to top
				window.scrollTo({ top: 0, behavior: 'smooth' })
			} else {
				// On other pages - navigate to homepage
				window.location.href = 'index.html'
			}
		})
	}
}

// Scroll effects for navbar logo
function initializeScrollEffects() {
	const navbar = document.getElementById('mainNavbar')
	const toggler = document.querySelector('.modern-toggler')
	let isScrolled = false

	if (!navbar) return

	function handleScroll() {
		const scrollTop = window.pageYOffset || document.documentElement.scrollTop
		const shouldBeScrolled = scrollTop > 50

		if (shouldBeScrolled !== isScrolled) {
			isScrolled = shouldBeScrolled
			navbar.classList.toggle('scrolled', isScrolled)
		}
	}

	// Handle mobile menu toggle animation
	if (toggler) {
		toggler.addEventListener('click', function () {
			this.classList.toggle('collapsed')
		})
	}

	// Throttle scroll events for better performance
	let ticking = false
	window.addEventListener('scroll', function () {
		if (!ticking) {
			requestAnimationFrame(function () {
				handleScroll()
				ticking = false
			})
			ticking = true
		}
	})

	// Initial check
	handleScroll()
}

function initializeMap() {
	// Initialize map centered on Krakow
	const map = L.map('krakow-map').setView([50.0647, 19.945], 12)

	// Add OpenStreetMap tiles
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	}).addTo(map)

	// Custom heart icon using SVG
	const heartIcon = L.divIcon({
		html: `<div style="
			display: flex;
			align-items: center;
			justify-content: center;
			width: 40px;
			height: 40px;
			background: linear-gradient(135deg, #9dde20, #8ac71b);
			border-radius: 50%;
			box-shadow: 0 4px 12px rgba(157, 222, 32, 0.4);
			border: 3px solid white;
		">
			<svg width="24" height="24" viewBox="0 0 24 24" fill="white">
				<path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
			</svg>
		</div>`,
		className: 'custom-heart-marker',
		iconSize: [40, 40],
		iconAnchor: [20, 35],
		popupAnchor: [0, -35],
	})

	// Nursery locations with coordinates
	const nurseries = [
		{
			coords: [50.09307, 20.01131],
			name: '"Serduszko" nr 1',
			address: 'os. Kombatantów 6',
			manager: 'Katarzyna Mruk',
			phone: '+48 530 380 849',
			email: 'katarzynamrukserduszko@interia.pl',
		},
		{
			coords: [50.07891, 20.01049],
			name: '"Serduszko" nr 2',
			address: 'os. 2 Pułku Lotniczego 1',
			manager: 'mgr Karolina Wlusek',
			phone: '+48 534 693 760',
			email: 'karolinazlobekserduszko@gmail.com',
		},
		{
			coords: [50.05901, 19.95807],
			name: '"Serduszko" nr 3',
			address: 'ul. Stanisława Żółkiewskiego 17/LU',
			manager: 'mgr Dominika Kapcia',
			phone: '+48 668 256 876',
			email: 'dominikakapciaserduszko@gmail.com',
		},
	]

	// Add markers for each nursery
	nurseries.forEach(nursery => {
		const marker = L.marker(nursery.coords, { icon: heartIcon }).addTo(map)

		const popupContent = `
			<div class="custom-popup">
				<h6>${nursery.name}</h6>
				<p><strong>${nursery.address}</strong><br>
				Kierownik: ${nursery.manager}<br>
				<a href="tel:${nursery.phone}" class="popup-phone">${nursery.phone}</a></p>
			</div>
		`

		marker.bindPopup(popupContent)
	})

	// Fit map to show all markers
	const group = new L.featureGroup(nurseries.map(n => L.marker(n.coords)))
	map.fitBounds(group.getBounds().pad(0.1))
}

// Hero carousel: smooth crossfade between images
function initializeHeroCarousel() {
	const container = document.querySelector('.hero .ratio')
	let heroImg = container ? container.querySelector('img') : null
	if (!container || !heroImg) return

	const images = ['assets/img/img1.webp?v=1', 'assets/img/img3.webp?v=1', 'assets/img/img5.webp?v=1']

	// Preload all images
	images.forEach(src => {
		const img = new Image()
		img.src = src
	})

	let currentIndex = 0
	// Find current image index
	for (let i = 0; i < images.length; i++) {
		if (heroImg.src.includes(images[i].split('?')[0].split('/').pop())) {
			currentIndex = i
			break
		}
	}

	// Setup container for overlay effect
	container.style.position = 'relative'
	heroImg.style.position = 'absolute'
	heroImg.style.top = '0'
	heroImg.style.left = '0'
	heroImg.style.width = '100%'
	heroImg.style.height = '100%'
	heroImg.style.objectFit = 'cover'

	function changeImage() {
		currentIndex = (currentIndex + 1) % images.length

		// Create new image element
		const newImg = document.createElement('img')
		newImg.src = images[currentIndex]
		newImg.alt = heroImg.alt
		newImg.style.position = 'absolute'
		newImg.style.top = '0'
		newImg.style.left = '0'
		newImg.style.width = '100%'
		newImg.style.height = '100%'
		newImg.style.objectFit = 'cover'
		newImg.style.opacity = '0'
		newImg.style.transition = 'opacity 1s ease-in-out'

		// Add to container
		container.appendChild(newImg)

		// Wait for image to load, then start fade
		newImg.onload = () => {
			setTimeout(() => {
				newImg.style.opacity = '1'
			}, 50)
		}

		// Remove old image after transition
		setTimeout(() => {
			if (heroImg.parentNode) {
				heroImg.parentNode.removeChild(heroImg)
			}
			// Update reference to new image
			heroImg = newImg
		}, 1100)
	}

	// Change image every 5 seconds
	setInterval(changeImage, 5000)
}

// Dropdown hover functionality
document.addEventListener('DOMContentLoaded', function () {
	const dropdowns = document.querySelectorAll('.nav-item.dropdown')

	dropdowns.forEach(dropdown => {
		const dropdownToggle = dropdown.querySelector('.dropdown-toggle')
		const dropdownMenu = dropdown.querySelector('.dropdown-menu')
		let timeoutId

		// Show dropdown on hover
		dropdown.addEventListener('mouseenter', function () {
			clearTimeout(timeoutId)
			dropdownMenu.style.display = 'block'
			dropdownToggle.setAttribute('aria-expanded', 'true')
			dropdownMenu.classList.add('show')
		})

		// Hide dropdown on mouse leave with delay
		dropdown.addEventListener('mouseleave', function () {
			timeoutId = setTimeout(() => {
				dropdownMenu.style.display = ''
				dropdownToggle.setAttribute('aria-expanded', 'false')
				dropdownMenu.classList.remove('show')
			}, 100) // Small delay to prevent flickering
		})

		// Also keep Bootstrap's click functionality
		dropdownToggle.addEventListener('click', function (e) {
			e.preventDefault()
			const isExpanded = dropdownToggle.getAttribute('aria-expanded') === 'true'

			if (isExpanded) {
				dropdownMenu.style.display = ''
				dropdownToggle.setAttribute('aria-expanded', 'false')
				dropdownMenu.classList.remove('show')
			} else {
				dropdownMenu.style.display = 'block'
				dropdownToggle.setAttribute('aria-expanded', 'true')
				dropdownMenu.classList.add('show')
			}
		})
	})

	// Close dropdowns when clicking outside
	document.addEventListener('click', function (e) {
		if (!e.target.closest('.nav-item.dropdown')) {
			dropdowns.forEach(dropdown => {
				const dropdownToggle = dropdown.querySelector('.dropdown-toggle')
				const dropdownMenu = dropdown.querySelector('.dropdown-menu')
				dropdownMenu.style.display = ''
				dropdownToggle.setAttribute('aria-expanded', 'false')
				dropdownMenu.classList.remove('show')
			})
		}
	})
})
