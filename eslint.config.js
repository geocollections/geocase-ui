import js from "@eslint/js";
import vue from "eslint-plugin-vue";
import ts from "typescript-eslint";
import globals from "globals";
export default [
  {
    ignores: [
      ".nuxt/**",
      ".output/**",
      "node_modules/**",
      "dist/**",
      "test-results/**",
      "playwright-report/**",
    ],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...vue.configs["flat/essential"],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...Object.fromEntries(
          [
            "defineNuxtConfig",
            "defineNuxtPlugin",
            "defineNuxtRouteMiddleware",
            "definePageMeta",
            "defineEventHandler",
            "setResponseHeader",
            "useRuntimeConfig",
            "proxyRequest",
            "getRequestURL",
            "useNuxtApp",
            "useRoute",
            "useHead",
            "useSeoMeta",
            "navigateTo",
            "abortNavigation",
            "watch",
            "onMounted",
            "computed",
            "ref",
            "onBeforeUnmount",
          ].map((key) => [key, "readonly"]),
        ),
      },
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "vue/multi-word-component-names": "off",
      "vue/valid-v-slot": "off",
    },
  },
  {
    files: ["**/*.vue"],
    languageOptions: { parserOptions: { parser: ts.parser } },
  },
];
