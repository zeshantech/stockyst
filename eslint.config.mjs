import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // inherit Next.js core-web-vitals + TS rules
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // disable the <img> warning
  {
    rules: {
      "@next/next/no-img-element": "off",
      "no-unused-vars": "off", // turn off ESLint core rule
      "@typescript-eslint/no-unused-vars": "off",
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "react-hooks/exhaustive-deps": "off"
    },
  },
];

export default eslintConfig;
