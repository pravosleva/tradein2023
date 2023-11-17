# SmartPrice Trade-In v3

## ⚠️ Сборка

<details>
<summary markdown="span">На [test.smartprice.ru](https://test.smartprice.ru/tradein)</summary>

```bash
yarn build:staging
```
</details>

<details>
<summary markdown="span">На продакшен [smartprice.ru/tradein](https://smartprice.ru/tradein)</summary>

```bash
yarn build:prod
```
</details>

### Build product structure

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

## 🧪 Envs

```bash
VITE_BASE_API_URL=https://smartprice.ru
```

[See also about Vite envs](https://vitejs.dev/guide/env-and-mode.html)

```bash
.env                # ⛔ Dont touch! Loaded in all cases
.env.local          # ✅ Could be modified. Loaded in all cases, ignored by git
.env.[mode]         # ⛔ Dont touch! Only loaded in specified mode
.env.[mode].local   # ✅ Could be modified. Only loaded in specified mode, ignored by git
```

## Buisness logic

![User flow](/_etc/docs/studio-f4ab287d-d1a6-4a2f-b0b5-25f6a0d3f4af-dark.png "User flow")

## Bundle analyzer

Output file will be put to `./dist/stats.html`

![Treemap](/_etc/analyzer/treemap.png "Treemap")
![Network](/_etc/analyzer/network.png "Network")
![Sunbust](/_etc/analyzer/sunbust.png "Sunbust")

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
