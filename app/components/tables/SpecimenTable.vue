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
  <div class="tw:w-full tw:overflow-x-auto">
    <table class="SpecimenTable tw:w-full tw:border-collapse tw:text-left">
      <tbody>
        <tr
          v-for="header in headers"
          :key="header.value"
          class="SpecimenTable__mobile-row tw:border-b tw:border-slate-200 tw:last:border-b-0"
        >
          <th
            scope="row"
            class="SpecimenTable__mobile-row__header tw:w-[35%] tw:p-2.5 tw:px-4 tw:align-top tw:font-bold tw:break-words"
          >
            {{ header.text }}
          </th>
          <td
            class="SpecimenTable__mobile-row__cell tw:p-2.5 tw:px-4 tw:align-top tw:break-words"
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
