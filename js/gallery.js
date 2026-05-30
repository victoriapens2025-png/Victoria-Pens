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
/* MOBILE MENU */

const hamburger =
document.querySelector(".hamburger");

const nav =
document.querySelector("nav");

if(hamburger && nav){

  hamburger.addEventListener("click",()=>{

    hamburger.classList.toggle("active");

    nav.classList.toggle("active");

  });

  document.querySelectorAll("nav a")
  .forEach(link=>{

    link.addEventListener("click",()=>{

      hamburger.classList.remove("active");

      nav.classList.remove("active");

    });

  });

}