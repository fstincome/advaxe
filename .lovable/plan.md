# Reconstruction d’Advaxe en siège numérique professionnel

## Objectif
Transformer le portfolio actuel en un site éditorial premium présentant Advaxe comme bâtisseur technologique, architecte logiciel/web, contributeur open source et Bitcoin/Lightning, formateur, intervenant et entrepreneur. Le contenu, l’image existante, les statistiques et les données utiles seront conservés et migrés progressivement.

## 1. Architecture publique et identité visuelle
- Remplacer la page unique « portfolio » par des pages structurées : Accueil, À propos, Expertise, Travail, Technologie & idées, Expérience, Enseignement & conférences, Communauté, Articles, Médias et Contact.
- Ajouter des pages détaillées pour chaque projet et article, avec URLs propres et partageables.
- Créer un accueil éditorial concis : déclaration de positionnement, portrait, directions Build / Design / Teach / Contribute / Explore, travaux sélectionnés, idée récente et engagement communautaire.
- Adopter une direction premium et technique : typographie forte, composition éditoriale, surfaces sobres, accent orange maîtrisé, grilles asymétriques, lignes techniques discrètes et animations limitées.
- Supprimer les signaux de portfolio junior : jauges de compétences, disponibilité freelance, date de naissance mise en avant, accumulation de cartes arrondies, blobs et gradients excessifs.
- Préserver le portrait, les thèmes clair/sombre et les contenus professionnels existants.

## 2. Multilingue et navigation
- Supporter exactement English, Français, Kiswahili et Kirundi, avec English par défaut.
- Utiliser des URLs localisées : `/en`, `/fr`, `/sw`, `/rn`, puis des chemins cohérents pour les pages et contenus détaillés.
- Synchroniser automatiquement le sélecteur de langue avec l’URL et conserver une langue de repli anglaise.
- Stocker les contenus éditoriaux traduits dans la base, et non dans les composants.
- Ajouter titres, descriptions, liens canoniques et alternatives linguistiques pour les pages indexables.

## 3. Modèle de contenu structuré
- Conserver les tables existantes pendant la transition et ajouter une architecture relationnelle sans suppression destructive.
- Créer des entités dédiées : pages, traductions, expertise et catégories, projets et catégories, technologies, expériences, articles, catégories et tags, événements, contributions communautaires, médias, réglages du site, liens sociaux et ressources média.
- Ajouter aux contenus : slug, statut brouillon/publié, vedette, ordre, dates, image, métadonnées SEO et champs propres à chaque type.
- Migrer les données utiles existantes vers les nouvelles entités, avec English comme contenu de référence et conservation des quatre langues demandées.
- Créer une bibliothèque média sécurisée pour les portraits, logos, captures, couvertures et images d’événements.

## 4. Sécurité et administration
- Conserver le compte de connexion existant sans créer de profil utilisateur.
- Ajouter une table de rôles séparée et une vérification serveur `admin`; aucune autorisation ne dépendra du navigateur.
- Fermer l’administration à tout utilisateur authentifié non autorisé et protéger chaque opération par des règles de base de données.
- Remplacer le contrôle de session tardif par une route administrateur protégée et vérifiée.
- Sécuriser les téléchargements, valider formulaires et URLs, limiter les formats/taille des fichiers et rendre le texte riche sûr à l’affichage.
- Conserver les statistiques visiteurs/clics, mais séparer les messages de contact des logs et renforcer les écritures publiques.

## 5. Véritable CMS
- Reconstruire `/dashboard` comme une interface avec barre latérale, recherche, statistiques, contenus récents, brouillons/publiés et activité.
- Ajouter des espaces de gestion pour : accueil, pages, à propos, expertise, projets, expériences, articles, conférences, communauté, médias, contact, réglages, SEO et bibliothèque média.
- Fournir création, modification, suppression, ordre, visibilité, vedette, publication et traduction pour chaque type pertinent.
- Afficher l’état de traduction EN/FR/SW/RN et permettre de modifier une langue sans écraser les autres.
- Ajouter les champs détaillés demandés pour projets, expériences, événements, médias et SEO.

## 6. Pages et narration
- **Accueil** : positionnement, portrait, cinq dimensions, projets phares, convictions, contribution et appel au contact.
- **À propos** : récit en chapitres — parcours, motivation, construction, exploration actuelle et vision technologique pour l’Afrique.
- **Expertise** : capacités professionnelles organisées par domaines, sans pourcentages artificiels.
- **Travail** : grille éditoriale et études de cas détaillant problème, contexte, rôle, solution, technologie, impact et statut.
- **Technologie & idées / Articles** : bibliothèque filtrable et pages de lecture accessibles.
- **Expérience** : parcours visuel à partir de 2020 avec responsabilités, réalisations, domaines et organisations.
- **Speaking, Communauté, Médias** : sections crédibles avec dates, rôles, ressources et liens.
- **Contact** : demandes orientées projet, partenariat, conférence, formation, conseil, open source, Bitcoin/Lightning ou média.

## 7. Qualité, SEO et validation
- Mettre à jour les métadonnées globales, le manifeste, robots et sitemap pour refléter l’identité professionnelle d’Advaxe.
- Utiliser HTML sémantique, navigation clavier, contrastes accessibles, images optimisées et chargement différé.
- Prévoir les états chargement, vide, erreur, brouillon et contenu indisponible.
- Vérifier les parcours publics et administrateur, les quatre langues, les thèmes clair/sombre, les formulaires et les pages détaillées.
- Contrôler visuellement le rendu desktop et mobile, puis lancer les tests ciblés et l’audit de sécurité de la base.

## Ordre d’implémentation
1. Sécurisation des rôles et nouveau modèle de données.
2. Couche multilingue et accès aux contenus.
3. Système visuel, navigation et pages publiques.
4. Pages détaillées et SEO.
5. CMS complet et bibliothèque média.
6. Migration des contenus, validation responsive, sécurité et finitions.

## Détails techniques
- Application React/Vite existante conservée, avec routage localisé côté client.
- Lovable Cloud reste la source de données, d’authentification et de fichiers.
- Les anciennes tables restent disponibles pendant la migration afin d’éviter toute perte ou interruption.
- Les rôles sont stockés séparément du compte et vérifiés dans les règles d’accès.
- Le compte administrateur existant sera attribué au rôle `admin`; aucun profil utilisateur supplémentaire ne sera créé.
