import './style.css'
import QRCode from 'qrcode'

const app = document.querySelector('#app')

function generateWhatsAppLink(phone, message) {
  const cleanPhone = phone.replace(/\D/g, '')
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    const copyBtn = document.querySelector('#copyBtn')
    copyBtn.textContent = 'Copié !'
    setTimeout(() => {
      copyBtn.textContent = 'Copier le lien'
    }, 2000)
  })
}

function updatePreview(phone, message) {
  const previewContainer = document.querySelector('#preview')
  if (!phone && !message) {
    previewContainer.innerHTML = `
      <div class="text-gray-500 dark:text-gray-400 text-center py-8">
        L'aperçu apparaîtra ici
      </div>
    `
    return
  }

  previewContainer.innerHTML = `
    <div class="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <img src="/whatsapp-avatar.png" alt="Profile" class="w-10 h-10 rounded-full">
      <div>
        <div class="font-medium text-gray-900 dark:text-white">+${phone}</div>
        <div class="mt-1 text-gray-600 dark:text-gray-300">${message || 'Aucun message'}</div>
      </div>
    </div>
  `
}

function generateQR(link) {
  const canvas = document.querySelector('#qrcode')
  QRCode.toCanvas(canvas, link, {
    width: 200,
    margin: 1,
    color: {
      dark: document.documentElement.classList.contains('dark') ? '#ffffff' : '#075E54',
      light: document.documentElement.classList.contains('dark') ? '#1F2937' : '#ffffff'
    }
  })
}

function updateButtonStates(phone) {
  const copyBtn = document.querySelector('#copyBtn')
  const qrBtn = document.querySelector('#qrBtn')
  const qrCanvas = document.querySelector('#qrcode')

  if (!phone.trim()) {
    copyBtn.disabled = true
    qrBtn.disabled = true
    copyBtn.classList.add('opacity-50', 'cursor-not-allowed')
    qrBtn.classList.add('opacity-50', 'cursor-not-allowed')
    qrCanvas.classList.add('hidden')
    qrBtn.textContent = 'Afficher le QR Code'
  } else {
    copyBtn.disabled = false
    qrBtn.disabled = false
    copyBtn.classList.remove('opacity-50', 'cursor-not-allowed')
    qrBtn.classList.remove('opacity-50', 'cursor-not-allowed')
  }
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark')
  localStorage.setItem('theme', isDark ? 'dark' : 'light')
  
  // Mettre à jour le QR code avec les nouvelles couleurs
  if (currentLink) {
    generateQR(currentLink)
  }
}

// Initialiser le thème
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

app.innerHTML = `
  <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <div class="max-w-2xl mx-auto">
      <div class="text-center mb-8">
        <div class="flex justify-end mb-4">
          <button id="themeToggle" class="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
            <svg class="w-6 h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path class="sun hidden dark:block" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              <path class="moon dark:hidden" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
        </div>
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">WhatsLinker</h1>
        <p class="text-gray-600 dark:text-gray-400">Générez facilement des liens WhatsApp personnalisés</p>
      </div>

      <div class="space-y-6">
        <div class="card bg-white dark:bg-gray-800 shadow-lg">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Numéro de téléphone
              </label>
              <input
                type="tel"
                id="phone"
                class="input bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-600"
                placeholder="Ex: 33612345678"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Message (optionnel)
              </label>
              <textarea
                id="message"
                class="input bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-600"
                rows="3"
                placeholder="Écrivez votre message ici..."
              ></textarea>
            </div>
          </div>
        </div>

        <div class="card bg-white dark:bg-gray-800 shadow-lg">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Aperçu</h2>
          <div id="preview" class="mb-4"></div>
          
          <div class="flex items-center justify-between">
            <canvas id="qrcode" class="hidden dark:invert"></canvas>
            <button id="qrBtn" class="btn btn-secondary dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 opacity-50 cursor-not-allowed" disabled>
              Afficher le QR Code
            </button>
            <button id="copyBtn" class="btn btn-primary opacity-50 cursor-not-allowed" disabled>
              Copier le lien
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
`

let currentLink = ''
const phoneInput = document.querySelector('#phone')
const messageInput = document.querySelector('#message')
const qrBtn = document.querySelector('#qrBtn')
const copyBtn = document.querySelector('#copyBtn')
const qrCanvas = document.querySelector('#qrcode')
const themeToggle = document.querySelector('#themeToggle')

function updateLink() {
  const phone = phoneInput.value
  const message = messageInput.value
  currentLink = generateWhatsAppLink(phone, message)
  updatePreview(phone, message)
  generateQR(currentLink)
  updateButtonStates(phone)
}

phoneInput.addEventListener('input', updateLink)
messageInput.addEventListener('input', updateLink)
themeToggle.addEventListener('click', toggleTheme)

qrBtn.addEventListener('click', () => {
  if (!phoneInput.value.trim()) return
  
  qrCanvas.classList.toggle('hidden')
  qrBtn.textContent = qrCanvas.classList.contains('hidden') 
    ? 'Afficher le QR Code' 
    : 'Masquer le QR Code'
})

copyBtn.addEventListener('click', () => {
  if (currentLink && phoneInput.value.trim()) {
    copyToClipboard(currentLink)
  }
})

// Initial states
updatePreview('', '')
updateButtonStates('')