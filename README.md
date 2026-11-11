# Angela Schmidt · Paper doll

A personal and portfolio site built as a jointed paper doll. Pull the string to move between sections, dress her from the Wardrobe, pet Demon the cat, and find the red bead for the disco.

## Run it locally

```
npm install
npm run dev
```

## Build

```
npm run build
```

The finished site lands in `dist/`. It uses relative paths, so it works from any folder.

## Put it on GitHub Pages

1. Push this folder to a new GitHub repository.
2. In the repo, open Settings > Pages and set Source to "GitHub Actions".
3. The included workflow (`.github/workflows/deploy.yml`) builds and publishes the site on every push to `main`.
