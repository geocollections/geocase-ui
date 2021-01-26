module.exports = [
  {
    path: "*",
    redirect: "/"
  },
  {
    path: "/:locale",
    name: "FrontPage",
    meta: {
      sitemap: {
        slugs: ["", "ee", "en", "de"],
        priority: 1.0,
        changefreq: "daily"
      }
    }
  },
  {
    path: "/:locale/search",
    name: "Search",
    meta: {
      sitemap: {
        slugs: ["", "ee", "en", "de"],
        priority: 1.0,
        changefreq: "daily"
      }
    }
  },
  {
    path: "/:locale/specimen/:id",
    name: "Detail",
    meta: {
      sitemap: {
        slugs: ["", "ee", "en", "de"],
        ignoreRoute: true
      }
    }
  },
  {
    path: "/:locale/partners_and_providers",
    name: "Partners and providers",
    meta: {
      sitemap: {
        slugs: ["", "ee", "en", "de"],
        priority: 0.7,
        changefreq: "monthly"
      }
    }
  },
  {
    path: "/:locale/about",
    name: "About",
    meta: {
      sitemap: {
        slugs: ["", "ee", "en", "de"],
        priority: 0.7,
        changefreq: "monthly"
      }
    }
  },
  {
    path: "/:locale/access",
    name: "Access",
    meta: {
      sitemap: {
        slugs: ["", "ee", "en", "de"],
        priority: 0.5,
        changefreq: "monthly"
      }
    }
  },
  {
    path: `/:locale/tutorial`,
    name: "Tutorial",
    meta: {
      sitemap: {
        slugs: ["", "ee", "en", "de"],
        priority: 0.5,
        changefreq: "monthly"
      }
    }
  },
  {
    path: `/:locale/links`,
    name: "Links",
    meta: {
      sitemap: {
        slugs: ["", "ee", "en", "de"],
        priority: 0.5,
        changefreq: "monthly"
      }
    }
  },
  {
    path: `/:locale/imprint`,
    name: "Imprint",
    meta: {
      sitemap: {
        slugs: ["", "ee", "en", "de"],
        priority: 0.5,
        changefreq: "monthly"
      }
    }
  },
  {
    path: `/:locale/efg`,
    name: "Efg",
    meta: {
      sitemap: {
        slugs: ["", "ee", "en", "de"],
        priority: 0.5,
        changefreq: "monthly"
      }
    }
  }
];
