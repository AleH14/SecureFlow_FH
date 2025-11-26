# Styles Organization

This folder contains all the custom styles for the SecureFlow FH application, organized into separate files for better maintainability.

## File Structure

```
src/styles/
├── index.css          # Main entry point - imports all other style files
├── variables.css      # Color palette and CSS custom properties
├── buttons.css        # Button styles and variants
├── forms.css          # Input, select, and form-related styles
├── components.css     # Card, alert, and component styles
├── layouts.css        # Page layouts and containers
└── responsive.css     # Media queries and responsive styles
```

## Usage

All styles are automatically imported through the main layout file:
- `src/app/layout.js` imports `src/styles/index.css`
- `index.css` imports all individual style files

## Style Categories

### 1. **Variables (variables.css)**
- CSS custom properties for colors
- Theme variables
- Color utility classes

### 2. **Buttons (buttons.css)**
- `.btn-custom-primary`
- `.btn-custom-secondary`
- `.btn-custom-outline`
- Hover and focus states

### 3. **Forms (forms.css)**
- `.custom-input`
- `.custom-select`
- `.form-check-input`
- Form validation styles

### 4. **Components (components.css)**
- `.custom-card` and related classes
- `.custom-alert` variants
- Component-specific styles

### 5. **Layouts (layouts.css)**
- `.login-container`
- `.register-container`
- Background gradients and overlays

### 6. **Responsive (responsive.css)**
- Media queries
- Mobile-first responsive styles
- Animations and transitions

## Color Palette

The application uses a consistent color palette defined in `variables.css`:
- **Navy**: `#000080` (Primary)
- **Crayola Blue**: `#2c75ff` (Secondary)
- **Silver**: `#c6bfbf` (Neutral)
- **Black**: `#000000`
- **White**: `#ffffff`

## Adding New Styles

1. Identify the appropriate category for your new styles
2. Add styles to the relevant file
3. If creating a new category, create a new file and import it in `index.css`
4. Use CSS custom properties for colors when possible