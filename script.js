let search = document.querySelector('#search-input');
let imageContainer = document.querySelector('.images-container');
let sources = [];
let html = '';
let currentIndex = 0;

const apiKey = 'joIidQiiJPiYkLk4l2IqbrOfs7F3QyVP4Wiv7AT1wgVyGG3iGdYv3KYO';

function searchKeyword() {
    let keyword = search.value;
    let url = `https://api.pexels.com/v1/search?query=${keyword.trim()}&per_page=90`
    fetchImages(url);
    html = '';
    displayImages();
}

search.addEventListener("keydown", (e) => {
    if (e.key === 'Enter') {
        searchKeyword();
    }
})
async function fetchImages(url) {
    let data = await fetch(url, {
        headers: {
            'Authorization': apiKey
        }
    });

    let fetchedData = await data.json();
    sources = fetchedData.photos;
    console.log(sources);

}

function displayImages() {
    sources.forEach((image, index) => {
        html += `<div class="image">
            <img src="${image.src.medium}" data-large="${image.src.large}" data-download="${image.src.original}" data-index="${index}">
        </div>`;
    });
    imageContainer.innerHTML = html;
    
    // Add click event listeners to all images
    setupImageClickHandlers();
}

function setupImageClickHandlers() {
    const modal = document.getElementById('imageModal');
    const closeBtn = document.querySelector('.close-modal');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Add click handlers to all images
    document.querySelectorAll('.image img').forEach(img => {
        img.addEventListener('click', function() {
            currentIndex = parseInt(this.dataset.index);
            showImage(currentIndex);
            modal.style.display = 'flex';
        });
    });
    
    // Close modal when clicking the close button
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside the image
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modal.style.display = 'none';
        }else if(e.key === 'ArrowRight'){
            currentIndex = (currentIndex + 1) % sources.length;
            showImage(currentIndex);
        }else if(e.key === 'ArrowLeft'){
            currentIndex = (currentIndex - 1 + sources.length) % sources.length;
            showImage(currentIndex);
        }
    });



    // Next and Previous buttons functionality
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % sources.length;
        showImage(currentIndex);
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + sources.length) % sources.length;
        showImage(currentIndex);
    });
}

function showImage(index) {
    const modalImg = document.getElementById('modalImage');
    const downloadBtn = document.getElementById('downloadBtn');
    modalImg.src = sources[index].src.large;
    downloadBtn.href = sources[index].src.original;
}

async function init() {
    let defaultUrl = 'https://api.pexels.com/v1/search?query=animals&per_page=90';
    await fetchImages(defaultUrl);
    displayImages()
}

const logo = document.querySelector(".logo");
logo.addEventListener("click",()=>{
    init();
})

init();

