Customized YTPTube with a simple and an advanced interface: friendlier to the user and closer to
cobalt.tools, meant for home use.

Media-suite:
Typography:
-Headings (Primary Font): classic Serif style.
-Body Text (Secondary Font): Noto Sans.

DAY MODE:
Main Background (Off-White): #F5F0E6
Secondary Content (Earth Brown): #A17855
Buttons / Calls to Action (Harvest Orange): #FF8F30
Accents and Details (Leek Green): #6CBF6E
Main Text (Deep Bark): #4A3525

NIGHT MODE:
Main Background (Dark Charcoal): #2B2624
Secondary Content / Cards (Muted Grey-Brown): #403935
Main Text (Light Leek Beige): #E6DFD5
Buttons / Calls to Action (Golden Beak): #F2B134
Accents and Details (Forest Leek Green): #315935

Where each mode lives in the code:
ui/app/pages/index.vue — the simple view itself (travelling hero + link bar), route `/`.
ui/app/pages/advanced.vue — the advanced view (top row with hero + URL card, queue, history), route `/advanced`.
ui/app/components/AppRoot.vue — the shell of the standard/advanced mode (with the whole Downloads/Automation/Configuration/Tools sidebar).
ui/app/composables/useMode.ts — the logic that decides which mode to show and stores the preference (localStorage + cookie); SIMPLE_PATH = '/' and ADVANCED_PATH = '/advanced'.
ui/app/components/SettingsPanel.vue — the actual toggle the user sees to switch between modes.

Where the palette and the typography live:
ui/app/assets/css/tailwind.css — the full palette (:root/.light and .dark branches). It overrides the
  Nuxt UI v4 tokens (--ui-bg, --ui-text, --ui-primary, --ui-color-*) with the colours above;
  the 50..950 ramps were interpolated in OKLab from those anchors, so hovers/borders/states stay in
  the same family. .shell-surface (background) and the @theme of --font-sans/--font-serif also live there.
ui/app/app.config.ts — only the Nuxt UI starting point (colour names) + the text colour
  on solid primary buttons (orange does not reach 4.5:1 with white, it does with bark).
ui/app/spa-loading-template.html — loading screen (same palette, shows the hero according to the system theme).
ui/public/images/hero-day.png and hero-night.png — the hero art (originals in hero/).
The fonts (Noto Sans + Fraunces) are declared in nuxt.config.ts (fonts block) and @nuxt/fonts
self-hosts them at build time: the deploy does not depend on Google.

ui/public/ — logo, favicon, base colours; it affects both modes equally without touching logic. If you want different texts/layouts between simple and advanced, that is when index.vue and advanced.vue need to be edited separately.
