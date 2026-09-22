# Refaire l’éditeur de contenu comme WordPress

## Objectif
Remplacer le simple champ « Content » des publications par un véritable éditeur visuel, tout en conservant les articles déjà publiés et la bibliothèque média existante.

## Expérience d’édition
- Ajouter une barre d’outils claire : titres, paragraphe, gras, italique, souligné, citation, listes à puces et numérotées, alignement, annuler/rétablir.
- Permettre l’ajout et la modification de liens, avec ouverture optionnelle dans un nouvel onglet.
- Ajouter un bouton image qui ouvre la bibliothèque média actuelle ou permet un téléversement direct limité à 3 Mo.
- Permettre de renseigner le texte alternatif et la légende d’une image avant son insertion.
- Afficher directement dans l’éditeur le résultat final : texte formaté, liens, images et légendes.
- Conserver l’édition séparée pour chaque langue EN, FR, SW et RN.

## Publication et compatibilité
- Enregistrer le nouveau contenu sous forme de HTML structuré dans les traductions existantes, sans changer le modèle de données.
- Détecter les anciens articles au format texte/Markdown et les convertir dans l’éditeur sans perdre leurs titres, listes, citations ou images.
- Afficher le HTML en lecture publique après nettoyage de sécurité ; garder le rendu actuel en secours pour les anciens contenus non encore modifiés.
- Préserver les couvertures, documents joints, statuts brouillon/publié et autres champs actuels.

## Intégration au tableau de bord
- Créer un éditeur riche réutilisable et l’activer uniquement pour les champs de contenu long concernés, en commençant par les publications.
- Réutiliser la bibliothèque média actuelle plutôt que créer un second système d’upload.
- Adapter la zone d’édition à la mise en page d’administration de type WordPress, avec une surface plus large pour le contenu.

## Vérification
- Vérifier la mise en forme, les liens et l’insertion d’images dans une publication existante.
- Vérifier qu’un article ancien reste lisible avant modification et après enregistrement.
- Vérifier le rendu public sur ordinateur et mobile, ainsi que l’absence de contenu HTML dangereux.
