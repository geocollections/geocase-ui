<script setup lang="ts">
interface SpecimenHeader {
  text: string;
  value: string;
}

type SpecimenItem = Record<string, unknown>;

withDefaults(
  defineProps<{
    headers?: SpecimenHeader[];
    items?: SpecimenItem[];
    density?: string;
    mobileBreakpoint?: number | string;
    disableSort?: boolean;
    disableFiltering?: boolean;
    disablePagination?: boolean;
    hideDefaultFooter?: boolean;
  }>(),
  {
    headers: () => [],
    items: () => [],
    density: "compact",
    mobileBreakpoint: undefined,
    disableSort: false,
    disableFiltering: false,
    disablePagination: false,
    hideDefaultFooter: false,
  },
);
</script>

<template>
  <div class="tw:min-w-0 tw:w-full">
    <table
      class="tw:block tw:w-full tw:table-fixed tw:border-collapse tw:text-left tw:md:table"
    >
      <tbody class="tw:block tw:md:table-row-group">
        <tr
          v-for="header in headers"
          :key="header.value"
          class="tw:block tw:border-b tw:border-default tw:last:border-b-0 tw:md:table-row"
        >
          <th
            scope="row"
            class="tw:block tw:w-full tw:px-4 tw:pt-3 tw:font-bold tw:text-highlighted tw:wrap-anywhere tw:md:table-cell tw:md:w-[190px] tw:md:py-3 tw:md:align-top"
          >
            {{ header.text }}
          </th>
          <td
            class="tw:block tw:min-w-0 tw:w-full tw:px-4 tw:pb-3 tw:leading-relaxed tw:wrap-anywhere tw:md:table-cell tw:md:w-auto tw:md:py-3 tw:md:align-top"
          >
            <slot
              :name="`item.${header.value}`"
              :item="items[0]"
              :value="items[0]?.[header.value]"
            >
              {{ items[0]?.[header.value] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
