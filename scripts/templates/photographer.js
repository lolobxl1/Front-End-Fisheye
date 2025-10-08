function photographerTemplate(data) {
  const { name, portrait, city, country, tagline, price, id } = data;

  const picture = `assets/photographers/${portrait}`;

  function getUserCardDOM() {
    const article = document.createElement("article");
    article.innerHTML = `<a href="photographer.html?id=${id}" aria-label="Voir le profil de ${name}">
        <img src="${picture}" alt="Portrait de ${name}">
        <h2>${name}</h2>
      </a>
      <h3>${city}, ${country}</h3>
      <p class="tagline">${tagline}</p>
      <p class="price">${price}€/jour</p>`;
    return article;
  }
  return { name, picture, getUserCardDOM };
}
