## Styles

This folder contains **global CSS only**.

Rules:

- Only global styles (reset, typography, layout primitives, vendor CSS & ...)
- All files must be imported via `index.css`
- `index.css` is imported **once** in the application entry (`root.tsx`)
- Component and feature styles **must use CSS Modules** and must not be placed here

Violations of these rules will cause style leakage and ordering bugs.
