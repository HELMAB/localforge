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
      // Prettier owns formatting; disable Vue template style rules that conflict with it.
      "vue/max-attributes-per-line": "off",
      "vue/html-self-closing": "off",
      "vue/html-indent": "off",
      "vue/html-closing-bracket-newline": "off",
      "vue/singleline-html-element-content-newline": "off",
      
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
