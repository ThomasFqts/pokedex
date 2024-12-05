let name = document.getElementById("name");
let capturerate = document.getElementById("capturerate");
let family = document.getElementById("family");

let description = document.getElementById("description");
let image = document.getElementById("image");

let textarea = document.getElementById("text");
let searchbtn = document.getElementById("btn");

const API_BASE = "https://pokeapi.co/api/v2/pokemon-species/";

searchbtn.addEventListener("click", () => {
  const query = textarea.value.trim();
  if (!query) return alert("Veuillez entrer un terme de recherche.");
  const endpoint = `${API_BASE}${query}`;
  fetch(endpoint)
    .then((response) => response.json())
    .then((data) => {
      createpokemon(data, query);
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des données :", error);
      alert("Pokémon introuvable ou erreur réseau.");
    });
});

textarea.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Empêche le comportement par défaut (soumission du formulaire)
    }
});

// Fonction pour récupérer le nom
function pokemonname(_data) {
  let dname = "Nom inconnu";
  for (let i = 0; i < _data.names.length; i++) {
    if (_data.names[i].language.name === "fr") {
      dname = _data.names[i].name;
      break;
    }
  }
  return dname;
}

// Fonction pour récupérer le taux de capture
function pokemoncapturerate(_data) {
  return _data.capture_rate || "Taux inconnu";
}

// Fonction pour récupérer la famille
function pokemonfamily(_data) {
  let dfamily = "Famille inconnue";
  for (let i = 0; i < _data.genera.length; i++) {
    if (_data.genera[i].language.name === "fr") {
      dfamily = _data.genera[i].genus;
      break;
    }
  }
  return dfamily;
}

// Fonction pour récupérer toutes les descriptions en français
function pokemondescription(_data) {
  let ddescription = "";
  let descriptions = new Set(); // Utilisation d'un Set pour stocker des descriptions uniques
  for (let i = 0; i < _data.flavor_text_entries.length; i++) {
    if (_data.flavor_text_entries[i].language.name === "fr") {
      let text = _data.flavor_text_entries[i].flavor_text;
      descriptions.add(text); // Ajoute la description au Set
    }
  }

  // Convertit le Set en tableau et fusionne les descriptions en une seule chaîne
  return Array.from(descriptions).join(`<br><br>`) || "Description indisponible.";
}

// Fonction pour récupérer l'URL de l'image
function pokemonimg(query) {
  return `https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${query}.svg`;
}

// Fonction principale
function createpokemon(_data, query) {
  let dname = pokemonname(_data);
  let dcapturerate = pokemoncapturerate(_data);
  let dfamily = pokemonfamily(_data);
  let ddescription = pokemondescription(_data);
  let dimg = pokemonimg(query);

  let color = _data.color.name || "gray"; // Récupère la couleur du Pokémon

  const container = document.getElementById("contenair");
  container.style.borderColor = color;

  name.innerHTML = `<h1>#${query} ${dname}</h1>`;
  capturerate.innerHTML = `<p id="paragraphe">Taux de Capture : ${dcapturerate} %</p>`;
  family.innerHTML = `<p>Famille : ${dfamily}</p>`;
  description.innerHTML = `<p>${ddescription}</p>`;
  image.innerHTML = `<img src="${dimg}" alt="${dname}">`;
}