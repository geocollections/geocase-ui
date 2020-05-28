<template>
  <v-card class="detail-search">
    <v-card-title class="px-3 py-2">
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
                :items="lookUpTypes.common"
              />
            </v-col>

            <v-col cols="12" class="pa-1">
              <SearchField v-model="item.value" dense />
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- EXTRA FIELDS -->
      <v-row no-gutters class="pa-1" v-if="false">
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
                :items="lookUpTypes.objects"
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
                :items="lookUpTypes.url"
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
import { mapActions, mapState } from "vuex";
import cloneDeep from "lodash/cloneDeep";

export default {
  name: "Search",

  components: { SearchField, SearchLookUpType },

  data: () => ({
    showSearch: true,
    searchParameters: null
  }),

  computed: {
    ...mapState("search", ["lookUpTypes", "detailSearch"])
  },

  created() {
    this.searchParameters = cloneDeep(this.detailSearch);
  },

  watch: {
    searchParameters: {
      handler(newVal, oldVal) {
        if (oldVal !== null) this.updateDetailSearch(newVal);
      },
      deep: true
    }
  },

  methods: {
    ...mapActions("search", ["updateDetailSearch"])
  }
};
</script>

<style scoped />
