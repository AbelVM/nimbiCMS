# Example app

This folder contains a minimal example application demonstrating the `nimbi-cms` library using the local `example/content/` markdown files.

Run the example from the project root:

```bash
cd /data/projects/nimbiCMS_pre
npm install
npm run dev    # starts Vite (frontend)
npm start      # starts the example API server
```

Open http://localhost:5173/example/index.html

Notes
-----

- Syntax highlighting: the library auto-detects fenced-code languages and registers highlight.js languages on-demand rather than pre-registering them. If you need a language available immediately, call `registerLanguage()` from the library before rendering.
- Localization: you can pass `l10nFile` and `lang` to `initCMS()` to load and force a UI language for the example app.
