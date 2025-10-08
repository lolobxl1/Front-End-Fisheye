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
  return { name, picture, price, getUserCardDOM };
}

//c’est une factory Media valide, car :
//elle prend un objet data (un média) en entrée,
//elle crée dynamiquement son contenu (image ou vidéo),
//et elle retourne un objet avec une méthode (getUserCardDOM) pour insérer ce contenu dans le DOM.
function mediaTemplate(data) {
  const { id, title, image, video, likes, date, price } = data;

  // Use image or video depending on the data
  let mediaElement = "";
  if (image) {
    mediaElement = `<img src="assets/medias/${image}" alt="${title}">`;
  } else if (video) {
    mediaElement = `
      <video controls>
        <source src="assets/medias/${video}" type="video/mp4">
        Votre navigateur ne supporte pas la vidéo.
      </video>`;
  }

  function getUserCardDOM() {
    const article = document.createElement("article");
    article.innerHTML = `
      <div class="photographer_detail">
        ${mediaElement}
        <p>${title}</p>
      </div>
    `;
    return article;
  }

  return { likes, getUserCardDOM };
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
  const photographerprice = document.querySelector(".photographer_price");
  photographers.forEach((photographer) => {
    const photographerModel = photographerTemplate(photographer);
    photographerprice.textContent = photographerModel.price;
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
  });
}

async function displayMedias(medias) {
  const mediasSection = document.querySelector(".photos");
  const likesCount = document.querySelector('.photographer_likes_count');
  let likes = 0;
  medias.forEach((media) => {
    const mediaModel = mediaTemplate(media);
    likes = likes + mediaModel.likes;
    const userCardDOM = mediaModel.getUserCardDOM();
    mediasSection.appendChild(userCardDOM);
  });
  likesCount.textContent = likes; // new value
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
