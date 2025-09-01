// --- Config ---
const API_KEY = 'vk-7tAyeT3D7Qi4jFj3R68l8DE4mWwhO182hKvkjCctVdvLE'
const API_URL = 'https://api.vyro.ai/v2/image/generations'

// --- DOM cache ---
const imageContainer = document.getElementById('imageContainer')
const imageResultEl = document.getElementById('imageResult')
const promptEl = document.getElementById('prompt')
const styleEl = document.getElementById('dropdownStyles')
const ratioEl = document.getElementById('dropdownRatio')

let currentObjectUrl = null

function setLoadingState(isLoading) {
  if (!imageContainer || !imageResultEl) return
  imageContainer.classList.toggle('loading', isLoading)
  imageResultEl.style.display = isLoading ? 'none' : 'block'
}

/** Abort after N ms */
function withTimeout(ms = 30000) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(new Error('Request timed out')), ms)
  return { signal: controller.signal, done: () => clearTimeout(id) }
}

async function generateImage() {
  const prompt = (promptEl?.value || '').trim()
  const style = styleEl?.value || 'realistic'
  const aspectRatio = ratioEl?.value || '1:1'

  if (!prompt) {
    alert('Please write your prompt.')
    return
  }

  setLoadingState(true)

  // Build request
  const headers = new Headers({ Authorization: `Bearer ${API_KEY}` })
  const form = new FormData()
  form.append('prompt', prompt)
  form.append('style', style)
  form.append('aspect_ratio', aspectRatio)

  // Timeout protection
  const t = withTimeout(30000)

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: form,
      redirect: 'follow',
      signal: t.signal
    })
    t.done()

    if (!res.ok) {
      // Try to read error text (if any) for easier debugging
      let detail = ''
      try { detail = await res.text() } catch {}
      throw new Error(`HTTP ${res.status} ${res.statusText} ${detail ? `— ${detail}` : ''}`)
    }

    const blob = await res.blob()

    // Revoke old object URL to avoid leaks
    if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl)

    currentObjectUrl = URL.createObjectURL(blob)
    imageResultEl.src = currentObjectUrl
  } catch (err) {
    console.error(err)
    alert('An error occurred while generating the image. Please try again.')
  } finally {
    setLoadingState(false)
  }
}

function downloadImage() {
  const src = imageResultEl?.src
  if (!src) {
    alert('No image available for download.')
    return
  }
  const a = document.createElement('a')
  const stamp = new Date().toISOString().replace(/[:-]/g, '').split('.')[0]
  a.href = src
  a.download = `ai-image-${stamp}.jpg`
  a.click()
}

// Expose if you call from inline HTML
window.generateImage = generateImage
window.downloadImage = downloadImage
