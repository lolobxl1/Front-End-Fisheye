/* DROP DOWN */
const dropdownBtn = document.getElementById('dropdown-btn');
const dropdownList = document.querySelector('.dropdown-list');
const options = dropdownList.querySelectorAll('li');
const selectedText = dropdownBtn.querySelector('.selected');
// Hide the default selected option on load
const initialValue = selectedText.textContent.trim();
options.forEach(li => {
  li.style.display = li.dataset.value === initialValue ? 'none' : 'block';
});
// Toggle open/close
dropdownBtn.addEventListener('click', () => {
  const expanded = dropdownBtn.getAttribute('aria-expanded') === 'true';
  dropdownBtn.setAttribute('aria-expanded', !expanded);
  dropdownList.hidden = expanded;
});
// Handle selection
options.forEach(option => {
  option.addEventListener('click', () => {
    const value = option.dataset.value;
    selectedText.textContent = value;

    // Close dropdown
    dropdownBtn.setAttribute('aria-expanded', 'false');
    dropdownList.hidden = true;

    // Hide the newly selected, show the rest
    options.forEach(li => {
      li.style.display = li.dataset.value === value ? 'none' : 'block';
    });

    console.log("Sort by:", value);
  });
});
// Click outside to close
document.addEventListener('click', e => {
  if (!dropdownBtn.contains(e.target) && !dropdownList.contains(e.target)) {
    dropdownBtn.setAttribute('aria-expanded', 'false');
    dropdownList.hidden = true;
  }
});




function photographerTemplate(data) {
  const { name, portrait, city, country, tagline, price, id } = data;

  const picture = `assets/photographers/${portrait}`;

  function getUserCardDOM() {
    const article = document.createElement("article");
    article.innerHTML = `<div class="photographer_detail">
        <h1>${name}</h1>
      <p class="citycountry">${city}, ${country}</p>
      <p class="tagline">${tagline}</p>
      </div>
      <button class="contact_button" onclick="displayModal()">Contactez-moi</button>
      <img src="${picture}" alt="Portrait de ${name}">`;
    return article;
  }
  return { name, picture, getUserCardDOM };
}

function mediaTemplate(data) {
  const { id, title, image, likes, date, price } = data;

  const picture = `assets/medias/${image}`;

  function getUserCardDOM() {
    const article = document.createElement("article");
    article.innerHTML = `<div class="photographer_detail">
    <img src="${picture}" alt="${title}">
        <p>${title}</p>
      </div>
      `;
    return article;
  }
  return { getUserCardDOM };
}

async function getPhotographers() {
  const reponse = await fetch(
    "data/photographers.json"
  );
  data = await reponse.json();
  //console.log(data);
  const params = new URLSearchParams(window.location.search);
  const photographerId = params.get("id");
  //console.log(photographerId);
  const photographers = data.photographers.filter(p => p.id == photographerId);
  //const photographers = data.photographers;
  //console.log(photographers);
  return { photographers };
}

async function getMedia() {
  const reponse = await fetch(
    "data/photographers.json"
  );
  data = await reponse.json();
  //console.log(data);
  const params = new URLSearchParams(window.location.search);
  const photographerId = params.get("id");
  //console.log(photographerId);
  const medias = data.media.filter(p => p.photographerId == photographerId);
  //const photographers = data.photographers;
  //console.log(medias);
  return { medias };
}

async function displayData(photographers) {
  const photographersSection = document.querySelector(".photograph-header");

  photographers.forEach((photographer) => {
    const photographerModel = photographerTemplate(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
  });
}

async function displayMedias(medias) {
  const mediasSection = document.querySelector(".photos");

  medias.forEach((media) => {
    const mediaModel = mediaTemplate(media);
    const userCardDOM = mediaModel.getUserCardDOM();
    mediasSection.appendChild(userCardDOM);
  });
}

async function init() {
  // Récupère les datas des photographes
  const { photographers } = await getPhotographers();
  displayData(photographers);
  // Récupère les medias du photographe
  const { medias } = await getMedia();
  displayMedias(medias);
}

init();
