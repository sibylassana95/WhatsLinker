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
      <div class="text-gray-500 text-center py-8">
        L'aperçu apparaîtra ici
      </div>
    `
    return
  }

  previewContainer.innerHTML = `
    <div class="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
      <img src="/whatsapp-avatar.png" alt="Profile" class="w-10 h-10 rounded-full">
      <div>
        <div class="font-medium text-gray-900">+${phone}</div>
        <div class="mt-1 text-gray-600">${message || 'Aucun message'}</div>
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
      dark: '#075E54',
      light: '#ffffff'
    }
  })
}

app.innerHTML = `
  <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">WhatsLinker</h1>
        <p class="text-gray-600">Générez facilement des liens WhatsApp personnalisés</p>
      </div>

      <div class="space-y-6">
        <div class="card">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Numéro de téléphone
              </label>
              <input
                type="tel"
                id="phone"
                class="input"
                placeholder="Ex: 33612345678"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Message (optionnel)
              </label>
              <textarea
                id="message"
                class="input"
                rows="3"
                placeholder="Écrivez votre message ici..."
              ></textarea>
            </div>
          </div>
        </div>

        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Aperçu</h2>
          <div id="preview" class="mb-4"></div>
          
          <div class="flex items-center justify-between">
            <canvas id="qrcode" class="hidden"></canvas>
            <button id="qrBtn" class="btn btn-secondary">
              Afficher le QR Code
            </button>
            <button id="copyBtn" class="btn btn-primary">
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

function updateLink() {
  const phone = phoneInput.value
  const message = messageInput.value
  currentLink = generateWhatsAppLink(phone, message)
  updatePreview(phone, message)
  generateQR(currentLink)
}

phoneInput.addEventListener('input', updateLink)
messageInput.addEventListener('input', updateLink)

qrBtn.addEventListener('click', () => {
  qrCanvas.classList.toggle('hidden')
  qrBtn.textContent = qrCanvas.classList.contains('hidden') 
    ? 'Afficher le QR Code' 
    : 'Masquer le QR Code'
})

copyBtn.addEventListener('click', () => {
  if (currentLink) {
    copyToClipboard(currentLink)
  }
})

// Initial preview
updatePreview('', '')