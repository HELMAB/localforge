import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";

export default [
  js.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  {
    files: ["**/*.{js,mjs,cjs,vue}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      ecmaVersion: 2022,
      sourceType: "module",
    },
    rules: {
      // Vue specific rules
      "vue/multi-word-component-names": "off",
      "vue/no-v-html": "warn",
      
      // JavaScript rules
      "no-console": "warn",
      "no-debugger": "warn",
      "no-unused-vars": ["error", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_" 
      }],
      "prefer-const": "error",
      "no-var": "error",
    },
  },
  {
    // Ignore patterns
    ignores: [
      "node_modules/**",
      "dist/**",
      "dist-builder/**",
      "dist-electron/**",
      "src/renderer/dist/**",
      "*.config.js",
      "*.config.mjs",
    ],
  },
];
