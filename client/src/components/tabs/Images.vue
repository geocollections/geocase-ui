<template>
  <v-card flat v-if="response !== null">
    <v-card-title class="py-2">
      <v-icon left color="primary" large>mdi-file-image-outline</v-icon>
      <span class="mr-1">{{ response.numFound }}</span>
      <span class="mr-1">{{
        `image${response.numFound === 1 ? "" : "s"}`
      }}</span>
      <span class="hidden-sm-and-up">{{
        `(page: ${searchParameters.page})`
      }}</span>
    </v-card-title>

    <v-row class="mx-0 px-2 pb-2">
      <v-col
        v-for="(image, index) in response.docs"
        :key="index"
        class="d-flex child-flex"
        cols="6"
        sm="4"
        md="3"
        lg="2"
      >
        <v-tooltip bottom color="secondary" z-index="51000">
          <template v-slot:activator="{ on }">
            <v-card flat class="d-flex image-hover" v-on="on" hover>
              <v-img
                v-if="image.url"
                max-height="400"
                aspect-ratio="1"
                :src="image.url"
                :lazy-src="image.url"
                class="amber lighten-5"
                @click="openUrl(image.url)"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular indeterminate color="grey lighten-5" />
                  </v-row>
                </template>
              </v-img>

              <v-row align="center" v-else>
                <v-col class="text-center">
                  <div class="py-3">
                    <v-icon style="font-size: 6rem" class="grey--text"
                      >mdi-file</v-icon
                    >
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </template>

          <span>
            <b>ID:</b> {{ image.id }}<br />
            <span v-if="image.collectioncode">
              <b>Collection:</b> {{ image.collectioncode }}
              <br />
            </span>
            <span v-if="image.unitid">
              <b>Object ID:</b>
              {{ image.unitid }}
              <br />
            </span>
            <span v-if="image.fullscientificname">
              <b>Full Scientific Name:</b>
              {{ image.fullscientificname }}
              <br />
            </span>
            <span v-if="image.country">
              <b>Gathering Country (ISO Code):</b>
              {{ image.country }}
              <br />
            </span>
            <span v-if="image.locality">
              <b>Locality:</b>
              {{ image.locality }}
              <br />
            </span>
            <span v-if="image.stratigraphy">
              <b>Stratigraphy:</b>
              {{ image.stratigraphy }}
              <br />
            </span>
          </span>
        </v-tooltip>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: "Images",

  props: {
    response: {
      type: Object,
      required: true
    },

    searchParameters: {
      type: Object,
      required: true,
      default: function() {
        return {
          page: 1,
          paginateBy: 25,
          sortBy: ["id"],
          sortDesc: [true]
        };
      }
    }
  },

  methods: {
    openUrl(url) {
      window.open(url, "UrlWindow");
    }
  }
};
</script>

<style scoped></style>
