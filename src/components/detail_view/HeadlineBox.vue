<template>
    <div>
        <v-row justify="space-between">
            <v-col>
                <div class="mb-1">
                    <template v-if="isItemFossil || isItemMineral || isItemRock || isItemMeteorite">
                      <span class="mr-2">
                        <v-icon small color="primary" v-if="isItemFossil">fas fa-fish</v-icon>
                        <v-icon small color="primary" v-else-if="isItemMineral">far fa-gem</v-icon>
                        <v-icon small color="primary" v-else-if="isItemRock">fas fa-mountain</v-icon>
                        <v-icon small color="primary" v-else-if="isItemMeteorite">fas fa-meteor</v-icon>
                      </span>

                        <span>{{ $t(`detail.specimenType.${getSpecimenType}`) }}</span>
                    </template>

                    <template v-if="(isItemFossil ||isItemMineral || isItemRock || isItemMeteorite) && (item.collectioncode || item.unitid)">
                        &ndash;
                    </template>

                    <span class="font-weight-bold" v-if="item.collectioncode || item.unitid">
                        <span v-if="item.collectioncode">{{ item.collectioncode }}</span>
                        <template v-if="item.collectioncode && item.unitid">{{ '&nbsp;' }}</template>
                        <span v-if="item.unitid">{{ item.unitid }}</span>
                    </span>
                </div>

                <h1 :class="{ 'font-italic': isItemFossil }" class="font-weight-bold mb-1" style="font-size: 2rem" v-if="item.fullscientificname">
                    {{ item.fullscientificname }}
                </h1>

                <h2 style="font-size: 1.25rem" v-if="filteredNames.length > 0">
                    <span class="font-weight-regular">{{ $t("detail.otherIdentification") }}<span v-if="filteredNames.length > 1">s</span>:</span>
                    <span :class="{ 'font-italic': isItemFossil }" v-for="(entity, index) in filteredNames" :key="index">
                      <span class="font-weight-bold">{{ entity }}</span>
                      <span class="mx-1" v-if="index < filteredNames.length - 1">|</span>
                    </span>
                </h2>

                <div v-if="!item.fullscientificname && !filteredNames">
                    GeoCASe ID: {{ item.geocase_id }}
                </div>
            </v-col>

            <v-col v-if="logoURI" cols="auto">
                <v-img :src="logoURI" :max-height="$vuetify.breakpoint.mdAndDown ? '75' : '100'" :max-width="$vuetify.breakpoint.mdAndDown ? '75' : '100'" contain :alt="`${item.datasetowner} logo`"></v-img>
            </v-col>
        </v-row>
    </div>
</template>

<script>

  export default {
    name: 'DetailViewHeadlineBox',
    props: {
      item: {
        type: Object,
        required: true
      },
      logoURI: {}
    },
    computed: {
      isItemFossil () {
        return this.item.recordbasis === 'Fossil'
      },
      isItemMineral () {
        return this.item.recordbasis === 'Mineral'
      },
      isItemRock () {
        return this.item.recordbasis === 'Rock'
      },
      isItemMeteorite () {
        return this.item.recordbasis === 'Meteorite'
      },
      filteredNames () {
        if (this.item.names) {
          return this.item.names.filter((name) => name !== this.item.fullscientificname)
        }
        return []
      },
      getSpecimenType () {
        let type = "fossil"
        if (this.isItemMineral) {
          type = "mineral"
        } else {
          if (this.isItemRock) {
            type = "rock"
          } else {
            if (this.isItemMeteorite) {
              type = "meteorite"
            }
          }
        }
        return type
      }
    }
  }

</script>