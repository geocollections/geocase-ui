# GeoCASe UI

GeoCASe is a portal for museum and research collections of fossils, minerals, rocks, meteorites and material samples. It supports searching collection records, browsing specimen images and maps, and exploring institutions and datasets.

The interface is available in English (default), Estonian (`/ee`) and German (`/de`). See [version 2.1 release notes](RELEASE_NOTES_2.1.md) for changes from the previous production interface.

## Development

Use Node 24.22.1 (see `.nvmrc`) and npm 11:

```sh
nvm install
nvm use
npm ci
cp .env.example .env
npm run dev
```

Open http://localhost:3000. The application uses Nuxt 4, Vue 3, Nuxt UI 4, Tailwind CSS 4 and Pinia. Vuetify remains installed for compatibility. Rendering is client-side (`ssr: false`); the Nuxt/Nitro server provides API proxies and catalog routes.

## Features

- Search with text filters, facets, removable active filters, sorting and pagination.
- Table and image result views alongside an interactive map.
- Specimen detail pages with images, geographic information and provider data.
- Institution directory and detail pages with catalog metadata, collections, images and maps.
- Dataset directory and detail pages with record totals, provider descriptions, rights and harvest information.
- Dataset maps load up to 1,000 records with valid coordinates. Shared coordinates form one numbered point; clicking it offers a choice among the loaded records at that location. Location totals refer to this loaded selection.
- Responsive navigation, mobile filter drawers and localized controls.

## Structure

- `app/pages/[[locale]]/`: localized routes, including institution, dataset and specimen details.
- `app/components/`: navigation, search controls, tables, galleries and maps.
- `app/composables/`: shared Composition API logic.
- `app/stores/`: Pinia state for search, specimens, statistics and preferences.
- `app/services/`: backend requests and collection queries.
- `app/utils/`: catalog parsing, source filters and shared transformations.
- `app/i18n/translations/`: English, Estonian and German interface text.
- `app/plugins/`: translations, UI integrations, analytics and browser preferences.
- `server/api/`: same-origin API proxies and institution collection endpoint.
- `server/routes/catalog/`: institution and dataset catalogs.
- `server/utils/`: cached catalog loaders.
- `tests/`: unit tests, browser tests and upstream fixtures.

## Styling

Shared styles and theme colors are in `app/assets/css/tailwind.css`. Nuxt UI integrates Tailwind; utility classes use the `tw:` prefix to distinguish them from Vuetify classes. Keep class names complete so Tailwind can detect them.

```vue
<div class="tw:flex tw:items-center tw:gap-4 tw:md:gap-6">
  <span class="tw:font-bold">GeoCASe</span>
</div>
```

Restart the development server after installing dependencies or changing the Vite configuration.

## Configuration and catalogs

Runtime settings are declared in `nuxt.config.ts` and can be overridden with environment variables:

| Variable | Default | Purpose |
| --- | --- | --- |
| `NUXT_API_BASE` | `https://api.geocase.eu` | Upstream API; `/api` forwards to `/v1/solr`, `/api/repeat` to `/v1/repeat`. |
| `NUXT_INSTITUTION_CATALOG_URL` | `https://geocase.geocollections.info/dcat/institutions.json` | Institution metadata, logos and header images. |
| `NUXT_DATASET_CATALOG_URL` | `https://geocase.eu/dcat/datasets.json` | Dataset metadata and institution relationships. |
| `NUXT_APP_BASE_URL` | `/` | Application URL prefix. |

The catalog loaders cache responses for **300 seconds**. After expiry, a request can receive the old response while a refresh runs in the background. An already open page does not automatically update when the source JSON changes; reload after the server cache refreshes.

Institution logos come from `logo_url`, and header images from `header_url`. Logos use a regular `<img>` element, supporting PNG and SVG. External image servers and browsers have their own caching rules. When replacing an image at the same address, use a new filename or version query such as `logo.svg?v=2` if needed.

Catalog record totals and indexed search record totals describe different things. Dataset pages distinguish provider-reported, harvested and indexed counts where available. Map location counts describe distinct coordinate pairs in the loaded records.

GA4 and Matomo load only in production builds on `geocase.eu` and `www.geocase.eu`. They record client-side page navigation.

## Validation

```sh
npm run lint
npm run typecheck
npm test
npx playwright install --with-deps chromium
npm run test:e2e
npm run build
```

Browser tests use fixtures for collection and catalog data. Proxy tests run a local upstream server. Live provider availability and production deployment should be checked separately.

## Production

```sh
npm run build
node .output/server/index.mjs
```

The Docker image runs the Nuxt/Nitro server on port 80. Pass runtime environment variables to override the upstream API or catalog URLs. Reverse proxies must forward application routes, `/api`, `/catalog` and `/sitemap.xml` to the Nuxt server.

`npm run generate` creates a static client in `.output/public`. Static hosting requires separate implementations of the API, catalog and sitemap endpoints provided by Nitro in the Node deployment.

## Team

The TalTech team develops and maintains GeoCASe in collaboration with the CETAF Earth Science Group:

- **Olle Hints**: general questions, scientific context and community collaboration.
- **Kristjan Urtson**: data provider support, publishing and integration.
- **Alissa Milovidova**: software development, portal design, usability and new features.
- **Enar Mustonen**: software development and portal maintenance.

The localized team presentation is on the About page (`/about`).
