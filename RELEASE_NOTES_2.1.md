# GeoCASe 2.1 – changes from the previous version

Version 2.1 brings together the GeoCASe interface redesign and the migration to Nuxt 4. The comparison is based on the previous production interface, before the development branch updates were merged in PR #299. This document also covers subsequent updates to the team introduction and dataset maps; their availability on the public portal depends on deployment.

## Homepage and navigation

The homepage has a new design with clearer entry points to collection search and the institution and dataset catalogues. Search categories include fossils, minerals, rocks, meteorites and material samples. Institution and dataset counts come from their respective catalogues.

The header, menus and content pages now follow a consistent design. Mobile navigation, control sizes and filter interactions have been adjusted. The About, Help, Join and data standards content has also been updated.

## Search and filters

- Active filters appear alongside search results and can be removed individually.
- The filter panel provides an option to reset the active search.
- Exact data source filters are preserved in the URL and when navigating search results; multiple sources are supported.
- Where available, the dataset filter shows the dataset name instead of its technical URL and links to its detail page. The source URL appears in the link tooltip.
- Mobile search includes a separate sorting control, adjusted touch targets, and improved checkbox and input sizes.
- Table, image gallery and map interactions have been updated, and filter and dropdown stacking issues have been corrected.

## Maps

The search map works alongside the table and image views. Map points link to localised record detail pages. When multiple records share coordinates, selecting a numbered point lets users choose which record to open.

The dataset detail map shows **up to 1,000 distinct locations with valid latitude and longitude**. Locations are grouped by coordinate pair in the API query, with one representative record per location. Selecting a point opens that record's detail page.

If a dataset has fewer than 1,000 distinct locations, all are shown. A large record count can therefore correspond to relatively few map points: for example, the EPD / Neotoma Baltoscandian Pollen dataset has 466,953 records at 241 distinct locations at the time of checking. Records sharing coordinates do not create additional points. The selection is ordered by record ID rather than randomly sampled.

The number of displayed locations remains visible above the map. A coloured “About this map” button opens an explanation of the location limit, shared coordinates and record navigation. Other records at the same location, and records without valid coordinates, remain available through “Explore all records”.

## Record details and images

Record detail pages, image galleries and map controls have been modernised. Images can be browsed in the updated gallery, and the image view uses a temporary filter for records with images. Keyboard navigation and map resizing when hidden panels are opened have been improved.

## Institution catalogue

A searchable, catalogue-based institution list and institution detail pages have been added. Institutions are linked to their datasets, and collection search links are restricted to the relevant sources.

Detail pages can display a logo, header image, description, related datasets, collection images and a map. Logos and header images come from the JSON catalogue fields `logo_url` and `header_url`.

Institution logos can be PNG or SVG files. Their display also depends on the availability and caching behaviour of the external image server.

## Dataset catalogue and detail pages

A searchable dataset catalogue and dataset detail pages have been added:

- A prominent block shows the total number of records indexed in GeoCASe. Selecting it opens search results for that dataset.
- Descriptions include the provider's longer resource description when available and different from the catalogue description.
- Licence and rights information is displayed, including information from provider metadata.
- Where available, pages show provider-reported record counts, harvested record counts and the last harvest time.
- Resource names, source identifiers, languages, URLs, provenance and data standard links are shown when the corresponding fields are populated.
- Raw metadata for developers remains available in a separate expandable section.

Provider-reported totals, harvested record counts, search index record counts and map location counts may differ. Explanatory text on the detail page helps distinguish them.

## Languages and team

English, Estonian and German text has been updated, with localised URLs preserved. The About page presents the current GeoCASe team, the role of the CETAF Earth Science Group and references to earlier contributors in Berlin.

## Technical changes

- Nuxt 4 tooling and file-based routing replace Vue CLI.
- The application uses Vue 3, Pinia state management, Nuxt UI and Tailwind CSS.
- Tailwind classes use the `tw:` prefix; Vuetify remains installed for compatibility.
- The Nuxt/Nitro server provides same-origin API proxies, catalogue routes and a dynamic sitemap.
- Docker runs the Nuxt Node server instead of serving the previous static Vue CLI output.
- The application continues to render in the browser (`ssr: false`).
- The development environment uses Node 24.22.1 and npm 11.
- Unit tests, browser tests and local test fixtures have been added and updated.

## Catalogue updates and caching

Institution and dataset JSON catalogues are cached on the server for **5 minutes**. After expiry, the first request may still receive the previous response while fresh data loads in the background. An open page does not automatically track changes to the JSON files.

Logos and other external images may also be subject to long-lived browser or image server caches. When replacing a file at the same URL, use a new filename or a version parameter such as `logo.svg?v=2`.

See the [README](README.md) for setup, configuration and validation instructions.
