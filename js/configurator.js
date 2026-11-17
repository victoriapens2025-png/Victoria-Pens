/* =========================
   CONFIGURATOR INTERACTION
========================= */
const customerEmail =
  document.getElementById('customerEmail');
  
const materialCards =
  document.querySelectorAll('.material-card');

const serviceCards =
  document.querySelectorAll('.service-mini-card');

const livePrice =
  document.getElementById('livePrice');

const selectedMaterialText =
  document.getElementById('selectedMaterial');

const selectedServiceText =
  document.getElementById('selectedService');

const stoneWorkDialog =
  document.getElementById('stoneWorkDialog');

const stoneWorkViewButton =
  document.querySelector('.stone-work-view-button');

const stoneWorkDialogCloseButton =
  document.querySelector('.stone-work-dialog-close');

const stoneWorkPhotoImages =
  Array.from(stoneWorkDialog.querySelectorAll('.stone-work-feature-image img, .stone-work-media-photo img'))
    .sort((first, second) =>
      Number(first.dataset.photoOrder) - Number(second.dataset.photoOrder)
    );

const stoneWorkImageDialog =
  document.getElementById('stoneWorkImageDialog');

const stoneWorkImageDisplay =
  document.getElementById('stoneWorkImageDisplay');

const stoneWorkImageCaption =
  document.getElementById('stoneWorkImageCaption');

const stoneWorkImageCounter =
  document.getElementById('stoneWorkImageCounter');

const stoneWorkVideos =
  stoneWorkDialog.querySelectorAll('video');

const stoneWorkMuteToggle =
  document.getElementById('stoneWorkMuteToggle');

let currentStoneWorkPhoto = 0;

stoneWorkViewButton.addEventListener('click', event => {
  event.stopPropagation();
  stoneWorkDialog.showModal();
});

stoneWorkViewButton.addEventListener('dblclick', event => {
  event.stopPropagation();
});

stoneWorkDialogCloseButton.addEventListener('click', () => {
  stoneWorkDialog.close();
});

stoneWorkDialog.addEventListener('click', event => {
  if (event.target === stoneWorkDialog) {
    stoneWorkDialog.close();
  }
});

stoneWorkDialog.addEventListener('close', () => {
  stoneWorkVideos.forEach(video => {
    video.pause();
    video.muted = true;
  });
  updateStoneWorkMuteToggle();
});

function showStoneWorkPhoto(index) {
  currentStoneWorkPhoto =
    (index + stoneWorkPhotoImages.length) % stoneWorkPhotoImages.length;

  const photo = stoneWorkPhotoImages[currentStoneWorkPhoto];

  stoneWorkImageDisplay.src = photo.src;
  stoneWorkImageDisplay.alt = photo.alt;
  stoneWorkImageCaption.innerText =
    `Stonework photograph · ${String(currentStoneWorkPhoto + 1).padStart(2, '0')}`;
  stoneWorkImageCounter.innerText =
    `${currentStoneWorkPhoto + 1} / ${stoneWorkPhotoImages.length}`;
}

function openStoneWorkPhoto(image) {
  const index = stoneWorkPhotoImages.findIndex(photo =>
    photo.getAttribute('src') === image.getAttribute('src')
  );

  if (index < 0) {
    return;
  }

  showStoneWorkPhoto(index);
  stoneWorkImageDialog.showModal();
}

stoneWorkDialog.querySelectorAll('.stone-work-feature-image img, .stone-work-media-photo img')
  .forEach(image => {
    image.addEventListener('click', () => openStoneWorkPhoto(image));
    image.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openStoneWorkPhoto(image);
      }
    });
  });

document.querySelector('.stone-work-image-previous').addEventListener('click', () => {
  showStoneWorkPhoto(currentStoneWorkPhoto - 1);
});

document.querySelector('.stone-work-image-next').addEventListener('click', () => {
  showStoneWorkPhoto(currentStoneWorkPhoto + 1);
});

document.querySelector('.stone-work-image-close').addEventListener('click', () => {
  stoneWorkImageDialog.close();
});

stoneWorkImageDialog.addEventListener('click', event => {
  if (event.target === stoneWorkImageDialog) {
    stoneWorkImageDialog.close();
  }
});

stoneWorkImageDialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    showStoneWorkPhoto(currentStoneWorkPhoto - 1);
  } else if (event.key === 'ArrowRight') {
    event.preventDefault();
    showStoneWorkPhoto(currentStoneWorkPhoto + 1);
  }
});

stoneWorkMuteToggle.addEventListener('click', () => {
  const shouldMute = Array.from(stoneWorkVideos).some(video => !video.muted);

  stoneWorkVideos.forEach(video => {
    video.muted = shouldMute;
  });

  updateStoneWorkMuteToggle();
});

function updateStoneWorkMuteToggle() {
  const allMuted =
    Array.from(stoneWorkVideos).every(video => video.muted);

  stoneWorkMuteToggle.innerText =
    allMuted ? 'Unmute all videos' : 'Mute all videos';
  stoneWorkMuteToggle.setAttribute('aria-pressed', String(!allMuted));
}

stoneWorkVideos.forEach(video => {
  video.addEventListener('play', () => {
    stoneWorkVideos.forEach(otherVideo => {
      if (otherVideo !== video) {
        otherVideo.pause();
      }
    });
  });

  video.addEventListener('volumechange', updateStoneWorkMuteToggle);
});



/* =========================
   STATE
========================= */

let selectedMaterial = null;

let selectedServices = [];

/* =========================
   MATERIAL SELECTION
========================= */

materialCards.forEach(card => {

  card.addEventListener('click', () => {

    materialCards.forEach(c => {
      c.classList.remove('selected');
    });

    card.classList.add('selected');

    selectedMaterial =
      card.dataset.material;

    selectedMaterialText.innerText =
      formatMaterial(selectedMaterial);

    updateServicePrices();
    updatePrice();

  });

  card.addEventListener('dblclick', () => {

    if (!card.classList.contains('selected')) {
      return;
    }

    card.classList.remove('selected');
    selectedMaterial = null;
    selectedMaterialText.innerText = "Not Selected";

    updateServicePrices();
    updatePrice();

  });

});

/* =========================
   SERVICE SELECTION
========================= */

serviceCards.forEach(card => {

  card.addEventListener('click', () => {

    const isTierOne =
      card.closest('.tier-two-grid');

    /* =========================
       TIER 1 = MULTI SELECT
    ========================= */

    if (isTierOne) {

      card.classList.toggle('selected');

      if (selectedServices.includes(card)) {

        selectedServices =
          selectedServices.filter(
            service => service !== card
          );

      } else {

        selectedServices.push(card);

      }

    }

    /* =========================
       OTHER TIERS = SINGLE SELECT
    ========================= */

    else {

      serviceCards.forEach(otherCard => {

        const otherIsTierOne =
          otherCard.closest('.tier-two-grid');

        if (!otherIsTierOne) {

          otherCard.classList.remove('selected');

          selectedServices =
            selectedServices.filter(
              service => service !== otherCard
            );

        }

      });

      card.classList.add('selected');

      if (!selectedServices.includes(card)) {

        selectedServices.push(card);

      }

    }

    updatePrice();

    updateServiceText();

  });

  card.addEventListener('dblclick', () => {

    if (!card.classList.contains('selected')) {
      return;
    }

    card.classList.remove('selected');
    selectedServices =
      selectedServices.filter(service => service !== card);

    updatePrice();
    updateServiceText();

  });

});

/* =========================
   UPDATE PRICE
========================= */

function updatePrice() {

  if (!selectedMaterial) {

    livePrice.innerHTML =
      "<span class='small-price-text'>Select Material</span>";

    return;

  }

  let total = 0;

  let hasPricedService = false;
  const needsClarification =
    selectedServices.some(service =>
      service.classList.contains('contact-only')
    );

  if (needsClarification) {

    livePrice.innerHTML =
      "<span class='small-price-text'>Please Reach Out For Further Clarification</span>";

    return;

  }

  selectedServices.forEach(service => {

    const price = getServicePrice(service);

    if (price > 0) {

      hasPricedService = true;

      total += price;

    }

  });

  if (!hasPricedService && selectedServices.length > 0) {

    livePrice.innerHTML =
      "<span class='small-price-text'>Reach Out To Us</span>";

    return;

  }

  livePrice.innerText =
    total.toLocaleString("en-IN");

}

function getServicePrice(service) {

  let price = 0;

  if (service.dataset.basePrice) {

    price = Number(service.dataset.basePrice);

  } else if (!selectedMaterial) {

    price = Number(service.dataset.modernSteel || 0);

  } else {

    const materialPriceKey = {
      "modern-steel": "modernSteel",
      "modern-gold": "modernGold",
      "vintage-steel": "vintageSteel",
      "vintage-gold": "vintageGold"
    }[selectedMaterial];

    price = Number(service.dataset[materialPriceKey] || 0);

  }

  if (selectedMaterial === "modern-gold") {
    price += Number(service.dataset.modernGoldSurcharge || 0);
  }

  return price;

}

/* =========================
   UPDATE DISPLAYED PRICES
========================= */

function updateServicePrices() {

  serviceCards.forEach(service => {

    const priceLabel =
      service.querySelector('.service-price');

    if (!priceLabel) {
      return;
    }

    const price = getServicePrice(service);

    priceLabel.innerText =
      `Starting from ₹${price.toLocaleString("en-IN")}`;

  });

}

/* =========================
   UPDATE SERVICE TEXT
========================= */

function updateServiceText() {

  if (selectedServices.length === 0) {

    selectedServiceText.innerText =
      "Not Selected";

    return;

  }

  const serviceNames =
    selectedServices.map(service =>
      service.dataset.service
    );

  selectedServiceText.innerText =
    serviceNames.join(", ");

}

/* =========================
   FORMAT MATERIAL LABEL
========================= */

function formatMaterial(material) {

  switch (material) {

    case "modern-steel":
      return "Modern Steel";

    case "modern-gold":
      return "Modern Gold";

    case "vintage-steel":
      return "Vintage Steel";

    case "vintage-gold":
      return "Vintage Gold";

    default:
      return "Not Selected";

  }

}

/* =========================
   EMAIL VALIDATION
========================= */

function isValidEmail(email) {

  const regex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(email);

}

/* =========================
   FORM VALIDATION
========================= */

function validateConfigurator() {

  if (!customerEmail) {

    return true;

  }

  if (customerEmail.value.trim() === "") {

    alert("Please enter your email address.");

    return false;

  }

  if (!isValidEmail(customerEmail.value.trim())) {

    alert("Please enter a valid email address.");

    return false;

  }

  return true;

}