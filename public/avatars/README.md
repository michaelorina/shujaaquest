# Hero Avatars

This directory contains default avatar images for heroes when we can't fetch or generate specific images.

## Default Avatar
- `default-hero.png` - A generic Kenyan hero silhouette/avatar

## Generated Avatars
Generated avatars will be stored here with the format:
- `generated-{hero-name}.png` - AI-generated portraits of specific heroes

## Usage
The app will try to fetch hero images in this order:
1. Wikipedia API (real photos)
2. AI-generated portraits (using hero descriptions)
3. Default avatar (fallback)
