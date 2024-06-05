# `import.meta.env.VITE_BRAND` Trade-In v3

## ⚠️ Сборка

<details>
<summary markdown="b">На [test.example.ru](https://test.example.ru/tradein)</summary>

```bash
yarn build:staging
```
</details>

<details>
<summary markdown="b">На продакшен [example.ru/tradein](https://example.ru/tradein)</summary>

```bash
yarn build:prod
```
</details>

<details>
<summary markdown="span">Build product structure</summary>

```bash
sp.offline-tradein-2023.mtsmain.xstate/
├─ node_modules/

# --- NOTE: Вот что нужно доставить на прод после сборки:
├─ dist/
│  ├─ assets/
│  ├─ static3/
│  ├─ index.html # Main
│  ├─ stats.html # Bundle analyzer
# ---

├─ src/
│  ├─ common/
│  ├─ ...
│  ├─ main.tsx
├─ ...
├─ package.json
```
</details>

## 🧪 Envs

<details>
<summary markdown="span">How to use</summary>

```bash
VITE_BASE_API_URL=https://example.ru
```

[See also about Vite envs](https://vitejs.dev/guide/env-and-mode.html)

```bash
.env                # ⛔ Dont touch! Loaded in all cases
.env.local          # ✅ Could be modified. Loaded in all cases, ignored by git
.env.[mode]         # ⛔ Dont touch! Only loaded in specified mode
.env.[mode].local   # ✅ Could be modified. Only loaded in specified mode, ignored by git
```
</details>

## Business logic

<details>
<summary markdown="span">stepMachine</summary>

![User flow](/_etc/docs/studio-f4ab287d-d1a6-4a2f-b0b5-25f6a0d3f4af-dark.png "User flow")
</details>

## Bundle analyzer

<details>
<summary markdown="span">Output file will be put to `./dist/stats.html`</summary>

![Treemap](/_etc/analyzer/treemap.png "Treemap")
![Network](/_etc/analyzer/network.png "Network")
![Sunbust](/_etc/analyzer/sunbust.png "Sunbust")
</details>

See also [about vite-bundle-visualizer](https://www.npmjs.com/package/vite-bundle-visualizer)

## See also about loading JavaScript module scripts

Loading JavaScript module scripts (aka ES6 modules) using `<script type="module">` Includes support for the nomodule attribute.

https://caniuse.com/?search=modules

# Original template notes

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
parserOptions: {
  ecmaVersion: 'latest',
  sourceType: 'module',
  project: ['./tsconfig.json', './tsconfig.node.json'],
  tsconfigRootDir: __dirname,
},
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
