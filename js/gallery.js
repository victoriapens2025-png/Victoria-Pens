// js/gallery.js

const galleryImages = document.querySelectorAll('.masonry-item img');
const lightbox = document.querySelector('.lightbox');
const lightboxImage = document.querySelector('.lightbox img');

galleryImages.forEach(img => {

  img.addEventListener('click', () => {

    lightbox.classList.add('active');
    lightboxImage.src = img.src;

  });

});

lightbox.addEventListener('click', () => {

  lightbox.classList.remove('active');

});