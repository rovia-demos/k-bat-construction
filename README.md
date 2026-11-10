# K-Bat Construction · maquette

Maquette du site de K-Bat Construction, plâtrier à Morières-lès-Avignon (84).

En ligne : https://rovia-demos.github.io/k-bat-construction/

Site statique (HTML, CSS, JS sans dépendance). Polices hébergées dans le site, aucune requête externe.
Page non indexée (`noindex` + `robots.txt`) tant que c'est une maquette.

## Infos réelles utilisées

- Nom : K-Bat Construction, Sid Ahmed Khebat, entreprise individuelle, SIREN 800 512 048, créée le 1er mars 2014 (registre officiel)
- Adresse : 49 impasse de la Verdale, 84310 Morières-lès-Avignon
- Téléphone : 06 35 28 99 43 · Email : khebatsidahmed@gmail.com
- Horaires : lundi au vendredi 8h à 17h (fiche Google)
- Facebook : https://www.facebook.com/p/K-bat-construction-61570720221980/
- 2 photos de chantier du client (galerie : `g-chantier-1`, `g-chantier-2`, Instagram @k_bat_construction.84)

## Contenus d'EXEMPLE à remplacer

Tous sont repérés dans le code par le commentaire `EXEMPLE – à remplacer`.

| Où | Quoi | Fichier |
|---|---|---|
| Hero | Badge « 5,0 sur Google » | `index.html` (hero) |
| Avis | Note 5,0 et les 6 avis clients (Nathalie M., Julien R., Sandrine B., Karim A., Élodie F., Patrick G.) | `index.html` (section `#avis`) |
| Avis | Bouton « Laisser un avis » : lien vide, à remplacer par le lien de la fiche Google | `index.html` (section `#avis`) |
| Avant / après | Les 4 paires de photos sont des visuels d'illustration (`ap1` à `ap4`) | `assets/img/ap*-*.webp` |
| Hero | Photo et vidéo du salon provençal, et sa version « en travaux » de l’effet d’ouverture (visuels d’illustration) | `assets/img/hero*`, `assets/img/hero-raw*`, `assets/video/hero*.mp4` |
| Services | Les 6 photos de services (`srv-*`) | `assets/img/srv-*.webp` |
| Réalisations | 10 photos sur 12 (toutes sauf `g-chantier-1` et `g-chantier-2`) | `assets/img/g-*.webp` |
| Pourquoi nous | Photos `why-chantier` et `why-outils` | `assets/img/why-*.webp` |
| Formulaire | N'envoie rien : affiche seulement une confirmation à l'écran | `assets/js/main.js` |

## À vérifier avec le client

- Horaires : la fiche Google indique 8h à 17h du lundi au vendredi, le brief disait 8h à 18h + samedi sur rendez-vous
- Liste des communes desservies
- Ses flyers mentionnent aussi « peintre » : faut-il ajouter la peinture aux services ?

## Modifier un service

Dans `index.html`, section `#services` : chaque service est un `<li class="srv__item">` avec un titre `<h3>`, un texte `<p>` et sa photo `<img class="srv__img">` (`srv-xxx-600.webp` + `srv-xxx-1000.webp`).

## Carte de la zone

Fond de carte réel tiré des données OpenStreetMap (`assets/img/carte-zone.svg`, mention « © les contributeurs d’OpenStreetMap » obligatoire). Les villes sont placées à leurs vraies coordonnées, 19 px = 1 km, Morières au centre.
