// A single catalogue for the Links page; the navigation menu links to this page.
export const resourceGroups = [
  { id: "networks", icon: "i-lucide-network" },
  { id: "data", icon: "i-lucide-database" },
  { id: "standards", icon: "i-lucide-file-code-2" },
  { id: "tools", icon: "i-lucide-code-2" },
] as const;
export const resources = [
  { id: "cetaf", group: "networks", name: "CETAF", href: "https://cetaf.org/" },
  {
    id: "dissco",
    group: "networks",
    name: "DiSSCo",
    href: "https://www.dissco.eu/",
  },
  {
    id: "synthesys",
    group: "networks",
    name: "SYNTHESYS",
    href: "https://www.synthesys.info/",
  },
  {
    id: "biocase",
    group: "networks",
    name: "BioCASe",
    href: "https://www.biocase.org/",
  },
  {
    id: "museum",
    group: "networks",
    name: "Museum für Naturkunde Berlin",
    href: "https://www.museumfuernaturkunde.berlin/en/",
  },
  { id: "gbif", group: "data", name: "GBIF", href: "https://www.gbif.org/" },
  {
    id: "paleodb",
    group: "data",
    name: "The Paleobiology Database",
    href: "https://paleobiodb.org/",
  },
  {
    id: "stratigraphy",
    group: "data",
    name: "Stratigraphy.net",
    href: "http://www.stratigraphy.net/",
  },
  {
    id: "abcd",
    group: "standards",
    name: "ABCD",
    href: "https://www.tdwg.org/standards/abcd/",
  },
  {
    id: "efg",
    group: "standards",
    name: "ABCD-EFG",
    href: "https://github.com/tdwg/efg",
  },
  {
    id: "darwin",
    group: "standards",
    name: "Darwin Core",
    href: "https://www.tdwg.org/standards/dwc/",
  },
  {
    id: "paleo",
    group: "standards",
    name: "TDWG Paleo Interest Group",
    href: "https://github.com/tdwg/paleo",
  },
  {
    id: "api",
    group: "tools",
    name: "GeoCASe API",
    href: "https://api.geocase.eu/",
  },
  {
    id: "github",
    group: "tools",
    name: "GeoCASe on GitHub",
    href: "https://github.com/geocollections/geocase-ui",
  },
  {
    id: "legacy",
    group: "tools",
    name: "GeoCASe 1.0",
    href: "http://old.geocase.eu",
  },
] as const;
