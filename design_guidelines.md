# DecorAR Design Guidelines

## Design Approach
**Reference-Based Approach** inspired by:
- **Canva**: Intuitive canvas-based editing with clean sidebar controls
- **Pinterest**: Visual grid browsing for furniture discovery
- **IKEA**: Product showcase with clear categorization
- **Figma**: Professional workspace layout with tools panel

**Key Principles**: Workspace clarity, visual hierarchy separating editing from browsing, touch-friendly controls, contextual toolbars

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, and 8 (p-2, p-4, p-6, p-8, gap-4, etc.)

**Primary Layout**: Split-screen workspace
- Left sidebar (280px): Furniture library, categories, filters
- Center canvas (flexible): Image editing workspace with uploaded room photo
- Right panel (300px, collapsible): Properties, color picker, style controls
- Top toolbar (64px): Actions (upload, save, download, undo/redo)

**Responsive Breakpoints**:
- Mobile: Stack vertically - toolbar → canvas → drawer menu for furniture
- Tablet: Canvas full-width, floating panels
- Desktop: Three-panel layout as described

## Typography

**Font Stack**: 
- Primary: Inter (Google Fonts) - UI elements, buttons, labels
- Secondary: Plus Jakarta Sans (Google Fonts) - headings, feature text

**Hierarchy**:
- Page title: text-2xl font-semibold
- Section headers: text-lg font-medium
- Furniture names: text-base font-medium
- Labels/metadata: text-sm font-normal
- Helper text: text-xs

## Component Library

### Core Workspace
**Canvas Container**: Central white workspace with subtle drop shadow, min-height of 70vh, contains uploaded room image with draggable furniture overlays

**Furniture Item Cards**: 
- Grid layout (grid-cols-2 in sidebar)
- Square thumbnail with 1:1 aspect ratio
- Product name below image
- Quick-add button overlay on hover
- Category badges (text-xs)

**Sidebar Navigation**:
- Sticky category tabs at top
- Scrollable furniture grid below
- Search bar with icon (h-10)
- Filter chips for style/color (rounded-full, px-4, h-8)

### Controls & Tools

**Top Toolbar**:
- Icon buttons (w-10 h-10) with tooltips
- Primary action buttons (Upload Photo, Save Design)
- History controls (Undo/Redo)
- Download/Share buttons on right

**Properties Panel**:
- Collapsible sections with accordion pattern
- Color swatches in grid-cols-5 layout
- Sliders for size/rotation (h-2 track)
- Style dropdown menus
- "Suggested Combinations" section at bottom

**Canvas Controls** (when furniture selected):
- Floating transformation handles
- Rotate icon at corner
- Delete/duplicate quick actions
- Dimension indicators (text-xs)

### Upload Experience
**Empty State**: 
- Dashed border container (h-96)
- Upload icon (large, h-16 w-16)
- Primary CTA button
- "or drag and drop" helper text
- Supported formats list (text-xs)

**Active Canvas**:
- Room photo as background layer
- Furniture items as draggable overlays with subtle shadows
- Selection highlight with border
- Snap-to-grid visual guides

### Furniture Library
**Category Tabs**: Horizontal scrolling tabs (h-12)
- Categories: Living Room, Bedroom, Kitchen, Office, Outdoor
- Active state with bottom border indicator

**Furniture Grid**:
- Masonry layout for varied sizes
- Lazy loading as user scrolls
- "IKEA" badge on applicable items
- Price display (text-sm)
- Quick view on click

## Animations
Use sparingly:
- Smooth drag transitions (transition-transform duration-200)
- Panel slide-in/out (transition-all duration-300)
- Furniture add animation (scale up from 0.8 to 1)
- No scroll-based or complex animations

## Images

**Hero Section**: None - launch directly into workspace

**Product Images**:
- Furniture thumbnails: 400x400px, transparent PNG backgrounds
- Room examples in "Gallery" tab: 800x600px
- Tutorial screenshots: 1200x800px

**Placement**:
- Furniture sidebar: Grid of product images
- Empty state: Illustration/icon for upload area
- Help section: Step-by-step tutorial images

This application is a **utility-focused creative tool**, not a marketing site, so no traditional hero section is needed.