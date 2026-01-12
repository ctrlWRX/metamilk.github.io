# Copilot Instructions for metamilk.github.io

## Project Overview
- This is a static website project for MetaMilk, hosted at https://ctrlwrx.github.io/metamilk.github.io/ and www.metamilktech.com.
- The site is organized with a simple directory structure: root-level HTML, CSS, and image assets, with additional static content under the `static/landing/` subdirectory.

## Key Files and Structure
- `index.html` and `index-home-rename.html`: Main entry points for the website.
- `styles.css`: Global styles for the site.
- `images/` and `static/landing/images/`: Image assets, including a `trades/` subfolder for trade-related images.
- `static/landing/script.js`: JavaScript for landing page interactivity.
- `CNAME`: Used for custom domain configuration.

## Build, Test, and Deployment
- This is a static site; no build step is required for HTML/CSS/JS changes.
- Deployment is handled by pushing to the `main` branch, which is published via GitHub Pages.
- No backend, database, or server-side code is present.
- No automated tests or CI/CD scripts are currently defined.

## Conventions and Patterns
- Keep all static assets (images, scripts, styles) organized in their respective folders.
- Use relative paths for linking assets within HTML files.
- For new landing pages or sections, place assets in `static/landing/` and update navigation links accordingly.
- Maintain a clean and minimal HTML structure; avoid unnecessary frameworks or dependencies.

## Examples
- To add a new image for trades, place it in `images/trades/` or `static/landing/images/trades/` and reference it with a relative path in HTML.
- To update the landing page script, edit `static/landing/script.js`.

## External Integrations
- Custom domain is configured via the `CNAME` file.
- No external APIs or third-party integrations are present in the codebase.

## Additional Notes
- See `README.md` for project links, but it does not contain workflow or architectural details.
- If adding new conventions or workflows, document them here for future AI agents and contributors.
