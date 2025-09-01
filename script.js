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
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + API_KEY);

  const formData = new FormData()
  formData.append('prompt', promptValue)
  formData.append('style', styleValue)
  formData.append('aspect_ratio', ratioValue)
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formData,
    redirect: 'follow'
  };

  fetch(API_URL, requestOptions)
    .then(response => response.blob())
    .then(blob => {
      const imageURL = URL.createObjectURL(blob)
      imageResultElement.src = imageURL
    })
    .catch(error => {
      console.log('error', error);
      alert('An error occurred while generating the image.')
    })
    .finally(() => {
      setLoadingState(false)
    })
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

function downloadImage() {
  const imageUrl = imageResultElement.src
  if(!imageUrl) {
    alert('No image available for download.')
    return;
  }
  const link = document.createElement('a')
  link.href = imageUrl
  link.download = 'ai-generated-image.jpg';
  link.click()
}
