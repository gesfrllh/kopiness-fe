import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    rules: {
      "no-multiple-empty-lines": ["error", { max: 1 }],
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: '^_' }],
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.object.name='console'][callee.property.name='log']",
          message: "Unexpected console.log. Please remove it."
        }
      ]
    }
  }
];

export default eslintConfig;
