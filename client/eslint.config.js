import js from '@eslint/js';
import globals from 'globals';
import hooks from 'eslint-plugin-react-hooks';
export default [{ignores: ['src/shared/**']}, js.configs.recommended, {files: ['**/*.{js,jsx}'], languageOptions: {ecmaVersion: 'latest', sourceType: 'module', globals: globals.browser, parserOptions: {ecmaFeatures: {jsx: true}}}, plugins: {'react-hooks': hooks}, rules: {...hooks.configs.recommended.rules, 'no-unused-vars': ['error', {varsIgnorePattern: '^(motion|[A-Z_])', argsIgnorePattern: '^(Icon|_)'}]}}];
