const API_KEY = 'vk-7tAyeT3D7Qi4jFj3R68l8DE4mWwhO182hKvkjCctVdvLE'
const API_URL = 'https://api.vyro.ai/v2/image/generations'

const imageContainer = document.getElementById('imageContainer')
const imageResultElement = document.getElementById('imageResult')

function generateImage() {
  const promptValue = document.getElementById('prompt').value
  const styleValue = document.getElementById('dropdownStyles').value
  const ratioValue = document.getElementById('dropdownRatio').value

  if (!promptValue) {
    alert('Please write your prompt.')
    return;
  }
  setLoadingState(true)
}

function setLoadingState(isLoading) {
  if (isLoading) {
    imageResultElement.style.display = 'none'
    imageContainer.classList.add('loading')
  } else {
    imageResultElement.style.display = 'block'
    imageContainer.classList.remove('loading')
  }
}
