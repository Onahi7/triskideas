# Color Customization Guide

## Overview
The TRISKIDEAS website now has a complete color customization system that allows you to change the site's color scheme without touching any code.

## How to Change Colors

### 1. Access Admin Settings
1. Go to `/admin/login` and log in with your admin credentials
2. Click on "Settings" in the admin sidebar
3. Scroll down to the "Color Theme" section

### 2. Customize Colors
You'll see four color options:

- **Primary Color** - Main brand color used for buttons, links, and key UI elements
  - Default: `#d97706` (Amber-700)
  
- **Primary Dark Color** - Darker shade for headings, text, and hover states
  - Default: `#92400e` (Amber-900)
  
- **Accent Color** - Secondary highlight color for backgrounds and decorative elements
  - Default: `#fed7aa` (Amber-200)
  
- **Background Color** - Light background color for sections and cards
  - Default: `#fffbeb` (Amber-50)

### 3. How to Set Colors
Each color can be adjusted in two ways:

1. **Color Picker**: Click the color box to open a visual color picker
2. **Hex Code**: Enter a hex color code (e.g., `#ff5733`) directly in the text field

### 4. Preview
A live preview box shows how your colors will look together before you save.

### 5. Save Changes
Click the "Save Settings" button at the bottom to apply your new color scheme across the entire website.

### 6. Reset to Defaults
If you want to go back to the original color scheme, click "Reset to Default Colors" button.

## Color Scheme Recommendations

### Professional & Trustworthy
- Primary: `#2563eb` (Blue)
- Primary Dark: `#1e40af` (Dark Blue)
- Accent: `#bfdbfe` (Light Blue)
- Background: `#eff6ff` (Sky)

### Warm & Energetic
- Primary: `#ea580c` (Orange)
- Primary Dark: `#9a3412` (Dark Orange)
- Accent: `#fed7aa` (Peach)
- Background: `#fff7ed` (Cream)

### Natural & Calming
- Primary: `#059669` (Green)
- Primary Dark: `#064e3b` (Dark Green)
- Accent: `#a7f3d0` (Mint)
- Background: `#f0fdf4` (Light Green)

### Elegant & Sophisticated
- Primary: `#7c3aed` (Purple)
- Primary Dark: `#5b21b6` (Dark Purple)
- Accent: `#ddd6fe` (Lavender)
- Background: `#faf5ff` (Light Purple)

## Technical Details

### CSS Variables
The color system uses CSS custom properties (variables) that are updated dynamically:

```css
--color-primary: Your primary color
--color-primary-dark: Your primary dark color
--color-accent: Your accent color
--color-background: Your background color
```

### Using Theme Colors in Code (For Developers)

If you're developing and want to use the theme colors, you can:

1. **CSS Classes** - Use these predefined classes:
   ```html
   <div class="bg-theme-primary text-white">Button</div>
   <h1 class="text-theme-primary-dark">Heading</h1>
   <div class="bg-theme-background">Section</div>
   ```

2. **Inline Styles** - Use CSS variables directly:
   ```jsx
   <div style={{ backgroundColor: 'var(--color-primary)' }}>
     Content
   </div>
   ```

3. **Tailwind (Legacy)** - The old amber classes still work but won't change with theme:
   ```html
   <button class="bg-amber-700 hover:bg-amber-800">
     Static Amber Button
   </button>
   ```

### Database Storage
Colors are stored in the `site_settings` table with these keys:
- `primary_color`
- `primary_dark_color`
- `accent_color`
- `background_color`

## Tips for Choosing Colors

1. **Contrast**: Ensure good contrast between text and background colors for readability
2. **Consistency**: Use shades of the same color family for a cohesive look
3. **Brand Identity**: Match your website colors to your brand or personal style
4. **Accessibility**: Use tools like [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) to verify accessibility
5. **Test on Mobile**: Preview your site on different devices after changing colors

## Troubleshooting

### Colors not updating?
1. Make sure you clicked "Save Settings"
2. Hard refresh your browser (Ctrl+F5 or Cmd+Shift+R)
3. Clear your browser cache

### Colors look wrong?
1. Check that hex codes start with `#` and have 6 characters (e.g., `#ff5733`)
2. Try resetting to default colors and starting over
3. Make sure your Primary Dark color is darker than your Primary color

## Need Help?
If you need assistance with color selection or have questions about the customization system, please reach out to your developer or check the project documentation.
