---
name: localization
description: Use when implementing or modifying localized UI, translation resources, or namespaces.
---

# Localization

## Rules

- All user-facing text must be localized.
- Translation is performed only inside React components.
- Never translate outside React components.
- Organize translations by feature using namespaces.
- A namespace may be shared across multiple related routes belonging to the same feature.
- Reuse an existing namespace whenever appropriate.
- Create a new namespace only when introducing a new feature or business domain.
- Keep translation keys descriptive and scoped to their namespace.

---

## Contexts

| Context | Allowed | Pattern |
|----------|---------|---------|
| React Component | ✅ | `useTranslation()` |
| loader | ❌ | Load data only |
| clientLoader | ❌ | Load data only |
| meta | ❌ | No translation |
| action | ❌ | Not allowed |
| clientAction | ❌ | Not allowed |

---

## React Components

Use `useTranslation()`.

Example:

```tsx
const { t } = useTranslation(["common", "about"]);

return <Text>{t("about:title")}</Text>;
```

Multiple namespaces:

```tsx
const { t } = useTranslation([
  "common",
  "about",
  "profile",
]);
```

---

## Namespace Organization

Namespaces represent **features**, not routes.

Good:

```
common
about
profile
checkout
orders
```

Not:

```
home-page
page1
page2
route-a
```

Multiple route modules may share the same namespace.

---

## Adding a Namespace

1. Create

```
app/locales/en/<namespace>.json
app/locales/fa/<namespace>.json
```

2. Register the namespace in

```
app/locales/i18n.d.ts
```

Example:

```ts
interface Locales {
  en: {
    common: typeof import("~/locales/en/common.json");
    about: typeof import("~/locales/en/about.json");
  };

  fa: {
    common: typeof import("~/locales/fa/common.json");
    about: typeof import("~/locales/fa/about.json");
  };
}
```

3. Keep every locale synchronized.

---

## Translation Keys

Prefer feature-scoped keys.

Good:

```json
{
  "title": "...",
  "description": "...",
  "submit": "..."
}
```

Use:

```tsx
t("about:title")
```

Avoid generic keys that lose meaning across namespaces.

---

## `common` Namespace

`common` is the only global namespace.

Use it only for:

1. Truly global vocabulary shared across the application.
   Examples:
   - Month names
   - Weekday names
   - Country names
   - City names
   - Currency names
   - Language names
   - Generic units

2. Strings used by global application layouts or infrastructure.
   Examples:
   - Header
   - Navigation
   - Sidebar
   - Footer
   - Global dialogs
   - Global notifications
   - Shared UI outside feature boundaries

Do **not** add feature-specific translations to `common`.

Feature-specific strings belong to their corresponding feature namespace.

Good:
// common.json
{
  "months.january": "January",
  "currency.usd": "US Dollar",
  "layout.header.profile": "Profile",
  "layout.sidebar.dashboard": "Dashboard"
}

Bad:
// common.json
{
  "checkout.pay": "Pay",
  "profile.changePassword": "Change Password",
  "orders.empty": "No orders found"
}

Those belong in:
checkout.json
profile.json
orders.json

---

## Checklist

Before completing localization work:

- [ ] No hardcoded UI strings.
- [ ] Namespace exists for every locale.
- [ ] `i18n.d.ts` updated.
- [ ] Existing namespace reused when appropriate.
- [ ] Translation performed only inside React components.
