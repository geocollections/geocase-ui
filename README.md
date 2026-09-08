# GeoCASe UI

GeoCASe is a portal for museum and research collections of fossils, minerals, rocks and meteorites.

## Development

Use Node 24 LTS (see `.nvmrc`) and npm 11:

```sh
nvm install
nvm use
npm ci
cp .env.example .env
npm run dev
```

The application uses Nuxt 4, Vue 3, Vuetify 4, Tailwind CSS 4 and Pinia. Existing English, Estonian (`/ee`) and German (`/de`) URLs are preserved.

## Tailwind CSS

Tailwind is integrated through the `@nuxt/ui` module and loaded globally from
`app/assets/css/tailwind.css`. Classes use the `tw:` prefix to avoid collisions
with Vuetify utilities. Preflight is disabled because Vuetify supplies the reset.

```vue
<div class="tw:flex tw:items-center tw:gap-4 tw:md:gap-6">
  <span class="tw:font-bold">GeoCASe</span>
</div>
```

Source detection covers `app/`. Keep class names complete in templates so Tailwind
can detect them. `StatsCard.vue` uses Tailwind for its typography.
Restart `npm run dev` after installing dependencies or changing the Vite config.

The `app/components/app_markup/` shell uses Nuxt UI and `<script setup lang="ts">`.
Vuetify remains available for the other views and shared map/search components.

## Structure

- `app/pages/[[locale]]/`: file-based routes, including specimen detail pages.
- `app/layouts/`: shared application shell and static-page layout.
- `app/components/`: interface, tables, search and map components.
- `app/composables/`: shared Vue Composition API logic in TypeScript (`use*.ts`), for example `useToggle.ts` for menu and dialog visibility.
- `app/stores/`: Pinia stores for search, specimens, statistics and preferences.
- `app/plugins/`: Vuetify, translations, notifications and browser preference persistence.
- `app/middleware/`: locale selection and redirects.
- `app/services/`: backend query construction.
- `server/api/`: same-origin Solr and provider-request proxies.

NuxtLink, NuxtPage, NuxtLayout, definePageMeta, useHead and useSeoMeta replace the Vue CLI entry point and manual router/metadata setup. Existing Options API components remain supported by Vue 3. The application retains client-side rendering (`ssr: false`); map libraries and browser storage require a browser. Server-rendered specimen metadata is not enabled by this migration.

The existing GA4 and Matomo integrations are loaded by a client plugin on the production GeoCASe hostname and record Nuxt page navigation. Development and browser tests do not load the trackers.

## Configuration

`NUXT_API_BASE` defaults to `https://api.geocase.eu` and is read at runtime by the Nuxt server. `/api` forwards to `/v1/solr` and `/api/repeat` forwards to `/v1/repeat`, preserving query parameters. Set `NUXT_APP_BASE_URL` if hosting below a URL prefix. The old `API_URL` and `APP_URL_PREFIX` variables are no longer used.

## Validation

```sh
npm run lint
npm test
npx playwright install --with-deps chromium
npm run test:e2e
npm run build
```

Browser tests mock collection data and the homepage map style. API proxy tests start a local upstream server and verify the real Nitro endpoints, including error statuses. The tests do not depend on the live API. Real upstream availability is a separate deployment check.

CI runs lint, unit tests, type checks, the production build and browser tests before the existing deployment workflow.

Migration references: [Nuxt routing](https://nuxt.com/docs/4.x/getting-started/routing/), [Pinia migration](https://pinia.vuejs.org/cookbook/migration-vuex.html), [MapLibre worker setup](https://maplibre.org/maplibre-gl-js/docs/).

## Production

```sh
npm run build
node .output/server/index.mjs
```

Or build the Docker image. The container now runs the Nuxt/Nitro server on port 80 instead of serving a Vue CLI `dist` directory through Nginx. Supply `NUXT_API_BASE` to the container if overriding the upstream. Reverse proxies must forward requests to this server, including `/api`. Nuxt also serves `/sitemap.xml`.

`npm run generate` produces a static client in `.output/public`; static hosting must provide the same `/api` proxy separately. The Node deployment above includes it.
