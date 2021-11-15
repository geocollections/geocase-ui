import { mapActions, mapState } from "vuex";
import { isEqual } from "lodash";

const queryMixin = {
  computed: {
    ...mapState("search", ["searchParamsList", "lookUpTypes", "searchIds"]),
  },

  methods: {
    ...mapActions("search", ["updateSearchField", "updateSearchParam"]),

    constructQueryParams(search, searchParams) {
      let appendableQuery = { ...this.$route.query };

      if (search) {
        this.searchIds
          .filter((item) => item !== "map") // Skipping map because of geoJSON object
          .forEach((item) => {
            let queryKey = item;

            // Clearing previous keys
            Object.keys(appendableQuery).forEach((entity) => {
              let appendableQueryKey = entity;
              if (entity.includes("__"))
                appendableQueryKey = entity.split("__")[0];
              if (appendableQueryKey === queryKey)
                delete appendableQuery[entity];
            });

            if (search[item].value && search[item].value.trim().length > 0) {
              if (search[item].lookUpType)
                queryKey += `__${replaceField(search[queryKey].lookUpType)}`;
              appendableQuery[queryKey] = search[item].value;
            } else delete appendableQuery[queryKey];
          });
      }

      if (searchParams) {
        let params = { ...searchParams };
        Object.entries(params).forEach((item) => {
          if (item[0] === "sort_by" || item[0] === "sort_desc") {
            let value = item[1].join(",");
            if (value && value.trim().length > 0) {
              appendableQuery[item[0]] = item[1].join(",");
            } else delete appendableQuery[item[0]];
          } else appendableQuery[item[0]] = item[1];
        });
      }

      const newQueryParams = appendableQuery;

      if (!isEqual(this.$route.query, newQueryParams))
        this.$router.push({
          name: "Search",
          params:
            this.$i18n.locale !== "en" ? { locale: this.$i18n.locale } : {},
          query: { ...newQueryParams },
        });
    },

    deconstructQueryParams(queryParams) {
      Object.entries(queryParams).forEach((item) => {
        let splitItem = item[0].split("__");
        let field = splitItem[0];

        if (this.searchIds.includes(field)) {
          let lookUpType = splitItem[1] || "";
          if (lookUpType && lookUpType.length > 0)
            lookUpType = replaceField(lookUpType, false);

          if (this.lookUpTypes.includes(lookUpType) || lookUpType === "") {
            let value = item[1] || null;

            this.updateSearchField({
              id: field,
              lookUpType: lookUpType,
              value: value,
            });
          }
        } else if (this.searchParamsList.includes(field)) {
          let value = item[1] || null;
          this.updateSearchParam({ field: field, value: value });
        }
      });
    },
  },
};

function replaceField(field, spaceToUnderscore = true) {
  if (field) {
    if (spaceToUnderscore) return field.replace(/ /g, "_");
    else return field.replace(/_/g, " ");
  } else return "";
}

export default queryMixin;
