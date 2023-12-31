import { ajoutListenersAvis, ajoutListenerEnvoyerAvis } from "./avis.js";

// Récupération des pièces depuis le fichier JSON
const pieces = await fetch("http://localhost:8081/pieces").then(pieces => pieces.json());

// on appelle la fonction pour ajouter le listener au formulaire
ajoutListenerEnvoyerAvis()

function genererPieces(pieces) {
    for (let i = 0; i < pieces.length; i++) {

        const article = pieces[i];
        // Récupération de l'élément du DOM qui accueillera les fiches
        const sectionFiches = document.querySelector(".fiches");
        // Création d’une balise dédiée à une pièce automobile
        const pieceElement = document.createElement("article");
        
        const imageElement = document.createElement("img");
        imageElement.src = pieces[i].image;
        const nomElement = document.createElement("h2");
        nomElement.innerText = pieces[i].nom;
        const description = document.createElement("p");
        description.innerText = pieces[i].description;
        const prixElement = document.createElement("p");
        prixElement.innerText = `Prix: ${pieces[i].prix} € (${pieces[i].prix < 35 ? "€" : "€€€"})`;
        const categorieElement = document.createElement("p");
        categorieElement.innerText = pieces[i].categorie ?? "(aucune catégorie)";
        const stockElement = document.createElement("p");
        stockElement.innerText = pieces[i].disponibilite ? "En stock" : "Rupture de stock";

        // création du bouton
        const avisBouton = document.createElement("button");
        avisBouton.dataset.id = article.id;
        avisBouton.textContent = "Afficher les avis";

        // On rattache la balise article à la section Fiches
        sectionFiches.appendChild(pieceElement);
        pieceElement.appendChild(imageElement);
        pieceElement.appendChild(nomElement);
        pieceElement.appendChild(prixElement);
        pieceElement.appendChild(categorieElement);
        pieceElement.appendChild(description);
        pieceElement.appendChild(stockElement);
        // Ajout du bouton Avis
        pieceElement.appendChild(avisBouton);
    }
    // Ajout de la fonction ajoutListenersAvis
    ajoutListenersAvis();
}

genererPieces(pieces)

const boutonTrierPrixCroissant = document.querySelector(".btn-trier-prix-croissant");
boutonTrierPrixCroissant.addEventListener("click", function () {
    const piecesOrdonnees = Array.from(pieces);
    piecesOrdonnees.sort(function (a, b) {
        return a.prix - b.prix;
    });
    // Effacement de l'écran et regénération de la page
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesOrdonnees);
 });

const boutonFiltrer = document.querySelector(".btn-filtrer");
boutonFiltrer.addEventListener("click", function () {
    const piecesFiltrees = pieces.filter(function (piece) {
        return piece.prix <= 35;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees);
});

const boutonTrierPrixDecroissant = document.querySelector(".btn-trier-prix-decroissant");
boutonTrierPrixDecroissant.addEventListener("click", function () {
    const piecesOrdonnees = Array.from(pieces);
    piecesOrdonnees.sort(function (a, b) {
        return b.prix - a.prix;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesOrdonnees);
});

const boutonFiltrerDescription = document.querySelector(".btn-filtrer-description");
boutonFiltrerDescription.addEventListener("click", function () {
    const piecesFiltrees = pieces.filter(function (piece) {
        return piece.description
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees);
});

// Liste de noms des pièces dites abordables
const noms = pieces.map(piece => piece.nom);
for(let i = pieces.length -1 ; i >= 0; i--){
    if(pieces[i].prix > 35){
        noms.splice(i,1);
    }
}
const pElement = document.createElement('p')
pElement.innerText = "Pièces abordables :";
//Création de la liste
const abordablesElements = document.createElement('ul');
//Ajout de chaque nom à la liste
for(let i=0; i < noms.length ; i++){
    const nomElement = document.createElement('li');
    nomElement.innerText = noms[i];
    abordablesElements.appendChild(nomElement)
}
// Ajout de l'en-tête puis de la liste au bloc résultats filtres
document.querySelector('.abordables')
    .appendChild(pElement)
    .appendChild(abordablesElements)

// Liste de noms des pièces disponibles
const disponibilites = pieces.map(piece => piece.nom);
for(let i = pieces.length -1 ; i >= 0; i--){
    if(pieces[i].disponibilite === false){
        disponibilites.splice(i,1);
    }
}
const disponiblesElements = document.createElement('ul');
for(let i=0; i < disponibilites.length ; i++){
    const nomElement = document.createElement('li');
    nomElement.innerText = `${disponibilites[i]} - ${pieces[i].prix} €`;
    disponiblesElements.appendChild(nomElement)
}

const pElementDisponible = document.createElement('p')
pElementDisponible.innerText = "Pièces disponibles :";
document.querySelector('.disponibles').appendChild(pElementDisponible).appendChild(disponiblesElements)

// Gestion de la balise range Prix Maximum
const inputPrixMax = document.querySelector('#prix-max')
inputPrixMax.addEventListener('input', function(){
    const piecesFiltrees = pieces.filter(function(piece){
        return piece.prix <= inputPrixMax.value;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees);  
})