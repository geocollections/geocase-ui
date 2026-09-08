<template>
  <v-table density="compact">
    <tbody>
      <tr v-for="header in headers" :key="header.value">
        <th scope="row">{{ header.text }}</th>
        <td>
          <slot
            :name="`item.${header.value}`"
            :item="items[0]"
            :value="items[0]?.[header.value]"
            >{{ items[0]?.[header.value] }}</slot
          >
        </td>
      </tr>
    </tbody>
  </v-table>
</template>
<script setup>
defineProps({
  headers: { type: Array, default: () => [] },
  items: { type: Array, default: () => [] },
});
</script>
<style scoped>
th {
  width: 35%;
  font-weight: 700;
}
th,
td {
  padding: 10px 16px;
  overflow-wrap: anywhere;
  vertical-align: top;
}
</style>
