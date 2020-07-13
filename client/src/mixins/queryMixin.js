import { mapActions, mapState } from "vuex";

const queryMixin = {
  computed: {
    ...mapState("search", ["searchFieldList"])
  },

  methods: {
    ...mapActions("search", ["updateSearchField", "resetSearchFields"]),

    constructQueryParams(searchFields) {
      let queryParams = {};
      searchFields.forEach(item => {
        if (item.value && item.value.trim().length > 0) {
          let queryKey = item.field;
          if (item.lookUpType)
            queryKey += `__${item.lookUpType.replace(/ /g, "_")}`;
          queryParams[queryKey] = item.value;
        }
      });

      const currentQuery = JSON.stringify(this.$route.query);
      const newQuery = JSON.stringify(queryParams);

      if (currentQuery !== newQuery)
        this.$router.push({ name: "Dashboard", query: queryParams });
    },

    deconstructQueryParams(queryParams) {
      this.resetSearchFields();

      Object.entries(queryParams).forEach(item => {
        let splitItem = item[0].split("__");
        let field = splitItem[0];

        if (this.searchFieldList.includes(field)) {
          let lookUpType = splitItem[1] || "";
          if (lookUpType && lookUpType.length > 0)
            lookUpType = lookUpType.replace(/_/g, " ");

          let value = item[1] || null;

          this.updateSearchField({
            field: field,
            lookUpType: lookUpType,
            value: value
          });
        }
      });
    }
  }
};

export default queryMixin;
