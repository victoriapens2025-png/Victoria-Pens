const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('active');
    }
  });
},{
  threshold:0.2
});

reveals.forEach(reveal => {
  observer.observe(reveal);
});

// Smooth, horizontal looping carousel for gallery-preview
(function(){
  const gallery = document.getElementById('gallery-preview');
  if(!gallery) return;

  const slider = gallery.querySelector('.carousel-slider');
  const tracks = slider ? slider.querySelectorAll('.carousel-track') : null;
  if(!slider || !tracks || tracks.length < 2) return;

  const trackA = tracks[0];
  const trackB = tracks[1];

  // clone first track into second if empty
  // ensure trackB contains the same items
  function cloneTrack(){
    if(trackB.children.length !== trackA.children.length){
      trackB.innerHTML = trackA.innerHTML;
    }
  }

  // calculate animation duration so speed feels consistent and set pixel translation
  function setDuration(){
    const trackWidth = trackA.getBoundingClientRect().width;
    const pxPerSecond = 80; // speed: higher = faster
    const duration = Math.max(8, trackWidth / pxPerSecond);
    slider.style.animationDuration = duration + 's';
    // set CSS variable for translation (negative pixel value)
    slider.style.setProperty('--scroll-end', `-${trackWidth}px`);
  }

  // wait for images within a container to be loaded before measuring to avoid gaps
  function whenImagesLoaded(container){
    const imgs = Array.from(container.querySelectorAll('img'));
    return Promise.all(imgs.map(img => {
      if(img.complete) return Promise.resolve();
      return new Promise(resolve => { img.addEventListener('load', resolve); img.addEventListener('error', resolve); });
    }));
  }

  // on resize, re-clone and recalc
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    if(resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // pause animation while recalculating
      slider.style.animationPlayState = 'paused';
      // wait for trackA images (they are the source), then clone and wait for cloned images
      whenImagesLoaded(trackA).then(() => {
        cloneTrack();
        return whenImagesLoaded(trackB);
      }).then(() => {
        setDuration();
        slider.style.animationPlayState = 'running';
      });
    }, 200);
  });

  // start paused until both track A images and cloned track B images are ready
  slider.style.animationPlayState = 'paused';
  whenImagesLoaded(trackA).then(() => {
    cloneTrack();
    return whenImagesLoaded(trackB);
  }).then(() => {
    setDuration();
    // small delay to ensure layout stable, then run
    setTimeout(() => { slider.style.animationPlayState = 'running'; }, 40);
  });
})();
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