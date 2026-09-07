<template>
  <NuxtLayout name="default">
    <v-container class="static-page">
      <v-card class="pa-4 pa-md-6">
        <v-row>
          <v-col cols="12" md="3">
            <v-list nav>
              <v-list-item
                v-for="item in settings.staticPages"
                :key="item.name"
                :to="item.to"
                :title="item.text"
                :prepend-icon="item.icon"
              />
            </v-list>
          </v-col>
          <v-col cols="12" md="9"><slot /></v-col>
        </v-row>
      </v-card>
    </v-container>
  </NuxtLayout>
</template>
<script setup>
import { useSettingsStore } from "@/stores/settings";
const settings = useSettingsStore();
</script>
<style scoped>
.static-page {
  max-width: 1100px;
}
</style>
