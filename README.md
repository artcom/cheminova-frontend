# Cheminova Frontend

## Prerequisites

- node
- npm

## Development

**Install dependencies:**

```bash
npm i
```

**Start the development server (React Router + Vite)**

```bash
npm run dev
```

Open http://localhost:5173 in your browser. The server automatically reloads on file changes.

### Bundling

Bundle the application via the React Router build (powered by Vite/Rollup):

```bash
npm run build
```

### Previewing the production build

Build first, then serve the generated client bundle from `build/client` using Vite's preview server:

```bash
npm run preview
```

### Enable prettier (VSCode)

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    ".editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

# Talk

## Performance Opimization

**Reducing Bundle Size:**

- https://shaxadd.medium.com/optimizing-your-react-vite-application-a-guide-to-reducing-bundle-size-6b7e93891c96

```JSX
import React, { Suspense } from 'react';

const MyComponent = React.lazy(() => import('./MyComponent'));
function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyComponent />
    </Suspense>
  );
}
export default App;
```
