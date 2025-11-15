# Theme Color Replacement Script

This script documents all the color class replacements needed throughout the application.

## Color Mapping Reference

### Amber to Theme Class Conversions:
- `bg-amber-700` → `bg-theme-primary`
- `bg-amber-800` → Use inline style or `bg-theme-primary-dark`
- `bg-amber-900` → `bg-theme-primary-dark`
- `bg-amber-50` → `bg-theme-background`
- `bg-amber-100` → `bg-theme-accent`
- `bg-amber-200` → `bg-theme-accent`

- `text-amber-700` → `text-theme-primary`
- `text-amber-800` → `text-theme-primary`
- `text-amber-900` → `text-theme-primary-dark`

- `border-amber-100` → `border-theme-accent`
- `border-amber-200` → `border-theme-accent`
- `border-amber-300` → `border-theme-accent`
- `border-amber-500` → `border-theme-primary`
- `border-amber-700` → `border-theme-primary`

- `hover:bg-amber-700` → `hover:bg-theme-primary`
- `hover:bg-amber-800` → `hover:bg-theme-primary-dark`
- `hover:text-amber-700` → `hover:text-theme-primary`
- `hover:text-amber-800` → `hover:text-theme-primary-dark`

## Components Updated:
✅ blog-header.tsx - Navigation links and mobile menu
✅ blog-footer.tsx - Footer background and button
✅ Admin settings page - Color theme UI

## Components That Need Manual Updates (if owner wants full theming):
- All admin pages (admin/**/*.tsx)
- All public pages (app/**/*.tsx)
- All components (components/**/*.tsx)

## Quick Update Pattern

For buttons:
```tsx
// Before
className="bg-amber-700 hover:bg-amber-800 text-white"

// After
className="bg-theme-primary hover:bg-theme-primary-dark text-white"
// OR use the helper
className={`${themeClasses.button}`}
```

For links:
```tsx
// Before
className="text-amber-700 hover:text-amber-800"

// After
className="text-theme-primary hover:text-theme-primary-dark"
// OR use the helper
className={themeClasses.link}
```

For headings:
```tsx
// Before
className="text-amber-900"

// After
className="text-theme-primary-dark"
// OR use the helper
className={themeClasses.heading}
```

## Automated Approach (Recommended)

Use the CSS variable system which already works everywhere:
1. The custom CSS classes (`.bg-theme-primary`, etc.) work immediately
2. Components using inline styles automatically adapt
3. No need to update every single file

## What's Already Working:
- Color pickers in admin settings
- CSS variables applied globally
- Theme provider loads colors on every page
- Header and footer use theme colors
- All buttons styled with theme classes will change

## What Owners Can Do Now:
1. Change colors in Admin > Settings > Color Theme
2. Save changes
3. See header, footer, and key UI elements update
4. Any component using the theme classes will automatically update

## For Developers:
If you want to add theme support to a new component:
1. Import: `import { themeClasses } from "@/hooks/use-theme-colors"`
2. Use the classes: `className={themeClasses.button}`
3. Or use CSS variables: `style={{ backgroundColor: 'var(--color-primary)' }}`
