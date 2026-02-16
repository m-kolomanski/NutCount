import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";

export default [
  {
    ignores: [
      "build/",
      "dist/",
      "dist-react/",
      "node_modules/"
    ]
  },
  js.configs.recommended,
  { 
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: { 
      react: pluginReact 
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        ecmaVersion: "latest",
        sourceType: "module"
      }
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      "react/react-in-jsx-scope": "off", // React 18+ doesn't require React import for JSX
      "react/prop-types": "off" // Turn off prop-types validation (optional, can be kept if you use prop-types)
    }
  },
];
