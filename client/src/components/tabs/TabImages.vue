<template>
  <v-card flat>
    <v-row class="mx-0" v-if="images.length > 0">
      <v-col
        v-for="(image, index) in images"
        :key="index"
        class="d-flex child-flex"
        cols="6"
        sm="4"
        md="3"
        lg="2"
      >
        <v-tooltip bottom color="secondary" z-index="51000" max-width="250">
          <template v-slot:activator="{ on, value }">
            <v-card
              flat
              class="d-flex image-hover"
              color="transparent"
              v-on="on"
              :elevation="value ? 12 : 0"
              hover
              :to="{ path: `detail/${image.id}` }"
            >
              <v-img
                v-if="image.url"
                max-height="400"
                max-width="400"
                contain
                aspect-ratio="1"
                :src="image.url"
                :lazy-src="image.url"
                class="transparent"
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
                      >far fa-image</v-icon
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
              <b>Country:</b>
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

    <v-row class="mx-0" justify="center" v-else>
      <v-col cols="12" style="max-width: 500px;">
        <v-alert
          class="mb-0"
          text
          border="left"
          icon="fas fa-search"
          color="secondary"
        >
          Couldn't find any images with these search parameters.
        </v-alert>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: "TabImages",

  props: {
    responseResults: {
      type: Array,
      required: true
    },
    responseResultsCount: {
      type: Number,
      required: true
    }
  },

  computed: {
    images() {
      if (this.responseResultsCount > 0) {
        return this.responseResults.filter(image => !!image.url);
      } else return [];
    }
  }
};
</script>

<style scoped></style>
