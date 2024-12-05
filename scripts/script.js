// Récupération des éléments HTML par leur ID
let name = document.getElementById("name");
let capturerate = document.getElementById("capturerate");
let family = document.getElementById("family");

let description = document.getElementById("description");
let image = document.getElementById("image");

let textarea = document.getElementById("text");
let searchbtn = document.getElementById("btn");

// Définition de l'URL de base pour accéder à l'API Pokémon
const API_BASE = "https://pokeapi.co/api/v2/pokemon-species/";

// Ajout d'un écouteur d'événement pour le bouton de recherche
searchbtn.addEventListener("click", () => {
  const query = textarea.value.trim(); // Récupère la valeur entrée dans le champ de recherche
  if (!query) return alert("Veuillez entrer un terme de recherche."); // Si le champ est vide, afficher un message
  const endpoint = `${API_BASE}${query}`; // Crée l'URL de l'API en ajoutant la recherche de l'utilisateur
  fetch(endpoint) // Effectue une requête fetch pour obtenir les données du Pokémon
    .then((response) => response.json()) // Convertit la réponse en JSON
    .then((data) => {
      createpokemon(data, query); // Appelle la fonction pour afficher les informations du Pokémon
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des données :", error); // En cas d'erreur, affiche une erreur dans la console
      alert("Pokémon introuvable ou erreur réseau."); // Affiche un message d'erreur à l'utilisateur
    });
});

// Empêche le comportement par défaut lorsque l'utilisateur appuie sur "Enter"
textarea.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Empêche le comportement par défaut (soumission du formulaire)
  }
});

// Fonction pour récupérer le nom du Pokémon en français
function pokemonname(_data) {
  let dname = "Nom inconnu"; // Valeur par défaut si le nom n'est pas trouvé
  for (let i = 0; i < _data.names.length; i++) {
    if (_data.names[i].language.name === "fr") { // Recherche du nom en français
      dname = _data.names[i].name;
      break;
    }
  }
  return dname;
}

// Fonction pour récupérer le taux de capture
function pokemoncapturerate(_data) {
  return _data.capture_rate || "Taux inconnu"; // Retourne le taux de capture ou "Taux inconnu" si non disponible
}

// Fonction pour récupérer la famille du Pokémon en français
function pokemonfamily(_data) {
  let dfamily = "Famille inconnue"; // Valeur par défaut si la famille n'est pas trouvée
  for (let i = 0; i < _data.genera.length; i++) {
    if (_data.genera[i].language.name === "fr") { // Recherche de la famille en français
      dfamily = _data.genera[i].genus;
      break;
    }
  }
  return dfamily;
}

// Fonction pour récupérer 2 descriptions en français
function pokemondescription(_data) {
  let ddescription = "";
  let descriptionCount = 0;
  let descriptions = new Set(); // Utilisation d'un Set pour stocker des descriptions uniques
  for (let i = 0; i < _data.flavor_text_entries.length; i++) {
    if (_data.flavor_text_entries[i].language.name === "fr") { // Recherche des descriptions en français
      let text = _data.flavor_text_entries[i].flavor_text;

      // Ajouter la description si elle est unique et qu'on n'a pas encore atteint 2 descriptions
      if (!descriptions.has(text) && descriptionCount < 2) {
        descriptions.add(text);
        descriptionCount++;
      }
    }
  }
  // Retourne les descriptions en tant que chaîne HTML ou un message par défaut si aucune description n'a été trouvée
  return (
    Array.from(descriptions).join(`<br><br>`) || "Description indisponible."
  );
}

// Fonction pour récupérer l'URL de l'image
function pokemonimg(query) {
  return `https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${query}.svg`; // Retourne l'URL de l'image au format SVG
}

// Fonction principale
function createpokemon(_data, query) {
  let dname = pokemonname(_data); // Appel de la fonction pour obtenir le nom du Pokémon
  let dcapturerate = pokemoncapturerate(_data); // Appel de la fonction pour obtenir le taux de capture du Pokémon
  let dfamily = pokemonfamily(_data); // Appel de la fonction pour obtenir la famille du Pokémon
  let ddescription = pokemondescription(_data); // Appel de la fonction pour obtenir la description du Pokémon
  let dimg = pokemonimg(query); // Appel de la fonction pour obtenir l'image du Pokémon

  let color = _data.color.name || "gray"; // Récupère la couleur du Pokémon, ou "gray" par défaut si non spécifiée

  const container = document.getElementById("contenair");
  container.style.borderColor = color; // Change la couleur de la bordure du conteneur en fonction de la couleur du Pokémon

  // Mise à jour du contenu HTML pour afficher les informations récupérées
  name.innerHTML = `<h1>#${query} ${dname}</h1>`;
  capturerate.innerHTML = `<p id="paragraphe">Taux de Capture : ${dcapturerate} %</p>`;
  family.innerHTML = `<p id="family">Famille : ${dfamily}</p>`;
  description.innerHTML = `<p id="descriptions">${ddescription}</p>`;
  image.innerHTML = `<img src="${dimg}" alt="${dname}">`;
}
