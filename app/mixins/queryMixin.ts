import { useSearchStore } from "@/stores/search";
import { mapActions, mapState } from "pinia";
import type {
  LocationQuery,
  LocationQueryRaw,
  Router,
} from "vue-router";

interface SearchField {
  value: string | null;
  lookUpType: string;
}

type SearchFields = Record<string, SearchField>;

interface SearchParams {
  [key: string]: LocationQueryRaw[string];
}

interface QueryMixinThis {
  $route: { name: string | symbol | null; query: LocationQuery };
  $router: Router;
  $i18n: { locale: string };
  searchIds: string[];
  searchParamsList: string[];
  lookUpTypes: string[];
  updateSearchField(payload: {
    id: string;
    lookUpType: string;
    value: LocationQuery[string] | null;
  }): void;
  updateSearchParam(payload: {
    field: string;
    value: LocationQuery[string] | null;
  }): void;
}

const queryMixin = {
  computed: {
    ...mapState(useSearchStore, [
      "searchParamsList",
      "lookUpTypes",
      "searchIds",
    ]),
  },

  methods: {
    ...mapActions(useSearchStore, ["updateSearchField", "updateSearchParam"]),

    constructQueryParams(
      this: QueryMixinThis,
      search: SearchFields | null | undefined,
      searchParams: SearchParams | null | undefined,
    ): void {
      if (this.$route.name !== "Search") return;

      const appendableQuery: LocationQueryRaw = { ...this.$route.query };

      if (search) {
        this.searchIds
          .filter((item) => item !== "map")
          .forEach((item) => {
            let queryKey = item;
            const searchField = search[item]!;

            Object.keys(appendableQuery).forEach((entity) => {
              let appendableQueryKey = entity;
              if (entity.includes("__"))
                appendableQueryKey = entity.split("__")[0]!;
              if (appendableQueryKey === queryKey)
                delete appendableQuery[entity];
            });

            if (searchField.value && searchField.value.trim().length > 0) {
              if (searchField.lookUpType)
                queryKey += `__${replaceField(search[queryKey]!.lookUpType)}`;
              appendableQuery[queryKey] = searchField.value;
            } else delete appendableQuery[queryKey];
          });
      }

      if (searchParams) {
        const params = { ...searchParams };
        Object.entries(params).forEach((item) => {
          if (item[0] === "sort_by" || item[0] === "sort_desc") {
            const value = (item[1] as string[]).join(",");
            if (value && value.trim().length > 0) {
              appendableQuery[item[0]] = (item[1] as string[]).join(",");
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

    deconstructQueryParams(
      this: QueryMixinThis,
      queryParams: LocationQuery,
    ): void {
      Object.entries(queryParams).forEach((item) => {
        const splitItem = item[0].split("__");
        const field = splitItem[0]!;

        if (this.searchIds.includes(field)) {
          let lookUpType = splitItem[1] || "";
          if (lookUpType && lookUpType.length > 0)
            lookUpType = replaceField(lookUpType, false);

          if (this.lookUpTypes.includes(lookUpType) || lookUpType === "") {
            const value = item[1] || null;

            this.updateSearchField({
              id: field,
              lookUpType: lookUpType,
              value: value,
            });
          }
        } else if (this.searchParamsList.includes(field)) {
          const value = item[1] || null;
          this.updateSearchParam({ field: field, value: value });
        }
      });
    },
  },
};

function replaceField(field: string, spaceToUnderscore = true): string {
  if (field) {
    if (spaceToUnderscore) return field.replace(/ /g, "_");
    else return field.replace(/_/g, " ");
  } else return "";
}

function isEqual(left: LocationQuery, right: LocationQueryRaw): boolean {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);

  return (
    leftKeys.length === rightKeys.length &&
    leftKeys.every((key) => {
      if (!Object.hasOwn(right, key)) return false;

      const leftValue = left[key];
      const rightValue = right[key];
      if (Array.isArray(leftValue) && Array.isArray(rightValue)) {
        return (
          leftValue.length === rightValue.length &&
          leftValue.every((value, index) => value === rightValue[index])
        );
      }

      return leftValue === rightValue;
    })
  );
}

export default queryMixin;
