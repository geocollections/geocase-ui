<template>
  <v-card class="detail-search">
    <v-card-title>
      <span style="cursor: pointer;" @click="showSearch = !showSearch"
        >Detail search</span
      >
      <v-spacer />
      <span>
        <v-btn icon @click="showSearch = !showSearch">
          <v-icon v-if="showSearch" x-large>mdi-chevron-up</v-icon>
          <v-icon v-else x-large>mdi-chevron-down</v-icon>
        </v-btn>
      </span>
    </v-card-title>

    <div v-show="showSearch">
      <!-- TEXT FIELDS -->
      <v-row no-gutters class="pa-1">
        <v-col
          cols="12"
          sm="4"
          md="2"
          v-for="(item, key) in searchParameters.textFields"
          :key="key"
        >
          <v-row no-gutters>
            <v-col cols="12" class="px-2">
              <span class="subtitle-2">
                {{ item.label }}
              </span>
            </v-col>
            <v-col cols="12" class="px-1 pb-1">
              <SearchLookUpType
                v-model="item.type"
                :background-color="item.color"
                :items="lookUpTypes"
              />
            </v-col>

            <v-col cols="12" class="pa-1">
              <SearchField
                v-model="item.value"
                dense
                :background-color="item.color"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- EXTRA FIELDS -->
      <v-row no-gutters class="pa-1">
        <v-col cols="12" sm="4" md="2">
          <v-row no-gutters>
            <v-col cols="12" class="px-2">
              <span class="subtitle-2">
                {{ searchParameters.extraFields.object.label }}
              </span>
            </v-col>
            <v-col cols="12" class="px-1 pb-1">
              <SearchLookUpType
                v-model="searchParameters.extraFields.object.value"
                :items="objects"
              />
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" sm="4" md="2">
          <v-row no-gutters>
            <v-col cols="12" class="px-2">
              <span class="subtitle-2">
                {{ searchParameters.extraFields.url.label }}
              </span>
            </v-col>
            <v-col cols="12" class="px-1 pb-1">
              <SearchLookUpType
                v-model="searchParameters.extraFields.url.value"
                :items="url"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script>
import SearchLookUpType from "../input_wrappers/SelectWrapper";
import SearchField from "../input_wrappers/TextFieldWrapper";
export default {
  name: "Search",
  components: { SearchField, SearchLookUpType },
  data: () => ({
    showSearch: false,
    searchParameters: {
      textFields: {
        fullscientificname: {
          type: "Contains",
          value: "",
          label: "Scientific name",
          color: "red lighten-5"
        },
        highertaxon: {
          type: "Contains",
          value: "",
          label: "Higher taxon",
          color: "deep-purple lighten-5"
        },
        stratigraphy: {
          type: "Contains",
          value: "",
          label: "Stratigraphy",
          color: "teal lighten-5"
        },
        locality: {
          type: "Contains",
          value: "",
          label: "Locality",
          color: "orange lighten-5"
        },
        collectioncode: {
          type: "Contains",
          value: "",
          label: "Institution",
          color: "blue-grey lighten-5"
        },
        unitid: {
          type: "Contains",
          value: "",
          label: "Object ID",
          color: "green lighten-5"
        }
      },
      extraFields: {
        object: {
          value: "- Any -",
          label: "Object"
        },
        url: {
          value: "- Any -",
          label: "Multimedia"
        }
      }
    },
    lookUpTypes: [
      "Is equal to",
      "Is not equal to",
      "Contains",
      "Contains any word",
      "Contains all words",
      "Starts with",
      "Does not start with",
      "Ends with",
      "Does not end with",
      "Does not contains",
      "Length is shorter than",
      "Length is longer than",
      "Reqular expression"
    ],
    objects: ["- Any -", "Minerals only", "Fossils only"],
    url: ["- Any -", "Yes", "No"]
  }),

  watch: {
    searchParameters: {
      handler(newVal) {
        this.$emit("detailSearch:changed", newVal);
      },
      deep: true
    }
  }
};
</script>

<style scoped></style>
