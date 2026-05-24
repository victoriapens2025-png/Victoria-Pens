/* =========================
   CONFIGURATOR INTERACTION
========================= */

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

    updatePrice();

  });

});

/* =========================
   SERVICE SELECTION
========================= */

serviceCards.forEach(card => {

  card.addEventListener('click', () => {

    // CHECK IF TIER 1 CARD

    const isTierOne =
      card.closest('.tier-two-grid');

    // =========================
    // TIER 1 = MULTI SELECT
    // =========================

    if(isTierOne){

      card.classList.toggle('selected');

      // REMOVE

      if(selectedServices.includes(card)){

        selectedServices =
          selectedServices.filter(
            service => service !== card
          );

      }

      // ADD

      else{

        selectedServices.push(card);

      }

    }

    // =========================
    // OTHER TIERS = SINGLE SELECT
    // =========================

    else{

      // REMOVE OTHER NON-TIER1 SERVICES

      serviceCards.forEach(otherCard => {

        const otherIsTierOne =
          otherCard.closest('.tier-two-grid');

        // ONLY RESET NON TIER1

        if(!otherIsTierOne){

          otherCard.classList.remove('selected');

          selectedServices =
            selectedServices.filter(
              service => service !== otherCard
            );

        }

      });

      // ADD CURRENT

      card.classList.add('selected');

      if(!selectedServices.includes(card)){

        selectedServices.push(card);

      }

    }

    updatePrice();

    updateServiceText();

  });

});

/* =========================
   UPDATE PRICE
========================= */

function updatePrice(){

  // NO MATERIAL SELECTED

  if(!selectedMaterial){

livePrice.innerHTML =
  "<span class='small-price-text'>Select Material</span>";
    return;

  }

  let total = 0;

  let hasPricedService = false;

  selectedServices.forEach(service => {

    let price = 0;

    switch(selectedMaterial){

      case "modern-steel":

        price =
          service.dataset.modernSteel || 0;

        break;

      case "modern-gold":

        price =
          service.dataset.modernGold || 0;

        break;

      case "vintage-steel":

        price =
          service.dataset.vintageSteel || 0;

        break;

      case "vintage-gold":

        price =
          service.dataset.vintageGold || 0;

        break;

    }

    price = Number(price);

    if(price > 0){

      hasPricedService = true;

      total += price;

    }

  });

  // CONTACT ONLY SERVICES

  if(!hasPricedService && selectedServices.length > 0){

livePrice.innerHTML =
  "<span class='small-price-text'>Reach Out To Us</span>";

    return;

  }

  // NORMAL PRICE

  livePrice.innerText = total;

}

/* =========================
   UPDATE SERVICE TEXT
========================= */

function updateServiceText(){

  if(selectedServices.length === 0){

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

function formatMaterial(material){

  switch(material){

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