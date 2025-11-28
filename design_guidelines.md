# Enchanted Tome - Medieval Bookstore Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from Pride-and-Prejudice-era aesthetics combined with magical medieval bookshop ambiance. Think warm candlelit libraries, aged parchment, leather-bound volumes, and intimate reading nooks.

## Core Aesthetic Principles
- **Atmosphere**: Walking into a centuries-old bookshop at dusk—wooden shelves, amber candlelight, floating dust motes, story-soaked warmth
- **Magical Realism**: Enchanted yet grounded, romantic yet functional
- **Material Feel**: Aged wood, leather bindings, parchment paper, wax seals, gilded edges
- **Motion**: Breathing, alive—like old wood settling and pages turning in a breeze

## Color Themes

**Light Theme (Parchment Glow)**
- Background: Warm ivory (#F7F3E9), aged parchment tones
- Primary text: Deep sepia brown (#3E2723)
- Accents: Antique gold (#C9A961), amber highlights
- Shadows: Soft sepia with warm undertones

**Dark Theme (Walnut Night)**
- Background: Rich walnut brown (#2C1810), deep mahogany
- Primary text: Aged gold (#E8D4A0), warm cream
- Accents: Burnished bronze (#B8860B), candlelit amber
- Shadows: Deep brown-black with golden rim lighting

## Typography
- **Primary Font**: Crimson Text, Libre Baskerville, or EB Garamond (elegant serif, book-like)
- **Display/Headers**: Playfair Display or Cinzel (ornate, classical)
- **Accent/Decorative**: UnifrakturMaguntia or similar old English script (sparingly)
- **Hierarchy**: Large ornate headers (48-72px), body text (16-18px for readability), small caps for labels

## Layout & Spacing
**Spacing System**: Tailwind units of 4, 6, 8, 12, 16, 24 for consistent rhythm
- Generous padding around content blocks (p-8 to p-16)
- Breathing room between book cards (gap-6 to gap-8)
- Intimate text containers (max-w-4xl) for readable prose

## Component Library

**Navigation Bar**
- Carved wooden signboard aesthetic with grain texture
- Ornate brackets/scrollwork at edges
- Warm glow effect behind text
- Sticky position with subtle shadow depth

**Book Cards (Leather-Bound Tomes)**
- 3D card design mimicking standing books
- Embossed title on spine
- Aged leather texture with gold foil accents
- Cast shadow suggesting depth on shelf
- Hover: Gentle tilt/pull-out animation (3-5 degrees)

**Buttons**
- Primary: Wax seal design—circular with embossed family crest
- Secondary: Gilded bookmark shape with pointed bottom
- Background: Blur effect when over images (backdrop-blur-md)
- No additional hover states needed (inherent button styling handles this)

**Modals/Detail Views**
- Open like a book cover lifting
- Parchment-textured background
- Ornate corner flourishes
- Soft vignette edges

**Forms (Login/Signup)**
- Input fields styled as ink-written entries on parchment
- Decorative quill icon placements
- Warm focus glow (amber/gold)
- Validation messages in calligraphic style

**Admin Dashboard**
- Wooden desk/ledger aesthetic
- Book inventory displayed as catalog cards
- CRUD actions styled as wax-sealed documents
- Add/Edit forms as manuscript pages

## Animations & Atmospheric Effects

**Ambient Motion (Always Active)**
- Floating dust motes across viewport (50-100 particles, slow drift)
- Gentle candlelight flicker on backgrounds
- Subtle parallax on hero section

**Interaction Animations**
- Book card hover: 3D tilt + slight lift (transform: rotateY, translateY)
- Page turn effect for navigation/modal transitions
- Fade-in on scroll (IntersectionObserver) with stagger delays
- Button press: Wax seal impression effect

**Cinematic Touches**
- Hero entrance: Slow fade-up with dust particles settling
- Book grid: Cascade entry animation (stagger by 50ms per card)
- Modal open: Book cover lifting with page flip sound (visual only)

## Images

**Hero Section**
- Large atmospheric image: Medieval library interior with wooden shelves, warm candlelight streaming through arched windows, leather-bound books visible in soft focus
- Overlay: Subtle dark gradient (bottom-up) for text legibility
- CTA buttons with backdrop-blur-md backgrounds

**Book Covers**
- Individual book product images showcasing leather texture, gold embossing
- Aspect ratio: 2:3 (portrait, book-like)

**Decorative Elements**
- Ornate corner flourishes (SVG)
- Scrollwork dividers between sections
- Candle/lantern icons for ambiance

## Page-Specific Layouts

**Homepage**
- Hero: Full-height section with library background image, centered ornate title, floating dust motes
- Featured Books: 3-4 column grid (responsive to single column mobile) with leather-tome cards
- About/Philosophy section: Single column prose with decorative borders

**Book Listing**
- Sidebar filters styled as wooden drawer labels
- Grid: 3-4 columns desktop, 2 tablet, 1 mobile
- Search bar: Ornate with quill icon
- Empty states: "No tomes found" with decorative messaging

**Book Detail Modal**
- Split layout: Book cover image left (40%), details right (60%)
- Parchment texture background
- Add-to-cart button as gilded bookmark
- Close button as wax seal

**Auth Pages**
- Centered form on aged parchment background
- Minimal distractions, focus on the ritual of entry
- "Welcome to the Tome" messaging
- Theme toggle as day/night candle icon

## Depth & Atmosphere
- Layered shadows: Multiple box-shadows for dimensional depth
- Warm glow effects: Radial gradients simulating candlelight
- Texture overlays: Subtle paper grain, wood grain on components
- Vignette edges: Darker corners drawing eye to content center

**Accessibility Notes**
- Maintain WCAG contrast ratios despite aged color palette
- Ensure text remains readable on textured backgrounds
- Dust motes purely decorative (not interactive elements)