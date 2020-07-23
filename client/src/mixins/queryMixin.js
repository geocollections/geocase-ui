import { mapActions, mapState } from "vuex";
import { cloneDeep, isEqual } from "lodash";

const queryMixin = {
  computed: {
    ...mapState("search", [
      "searchFieldList",
      "searchParamsList",
      "lookUpTypes"
    ])
  },

  methods: {
    ...mapActions("search", ["updateSearchField", "updateSearchParam"]),

    constructQueryParams(searchFields, searchParams) {
      let appendableQuery = cloneDeep(this.$route.query);

      if (searchFields) {
        searchFields.forEach(item => {
          let queryKey = item.field;

          // Clearing previous keys
          Object.keys(appendableQuery).forEach(item =>
            item.includes(queryKey) ? delete appendableQuery[item] : ""
          );

          if (item.value && item.value.trim().length > 0) {
            if (item.lookUpType)
              queryKey += `__${replaceField(item.lookUpType)}`;
            appendableQuery[queryKey] = item.value;
          } else delete appendableQuery[queryKey];
        });
      }

      if (searchParams) {
        let params = cloneDeep(searchParams);
        Object.entries(params).forEach(item => {
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
          name: "Dashboard",
          query: cloneDeep(newQueryParams)
        });
    },

    deconstructQueryParams(queryParams) {
      Object.entries(queryParams).forEach(item => {
        let splitItem = item[0].split("__");
        let field = splitItem[0];

        if (this.searchFieldList.includes(field)) {
          let lookUpType = splitItem[1] || "";
          if (lookUpType && lookUpType.length > 0)
            lookUpType = replaceField(lookUpType, false);

          if (this.lookUpTypes.includes(lookUpType) || lookUpType === "") {
            let value = item[1] || null;

            this.updateSearchField({
              field: field,
              lookUpType: lookUpType,
              value: value
            });
          }
        } else if (this.searchParamsList.includes(field)) {
          let value = item[1] || null;
          this.updateSearchParam({ field: field, value: value });
        }
      });
    }
  }
};

function replaceField(field, spaceToUnderscore = true) {
  if (field) {
    if (spaceToUnderscore) return field.replace(/ /g, "_");
    else return field.replace(/_/g, " ");
  } else return "";
}

export default queryMixin;
