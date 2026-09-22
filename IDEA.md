YTPTube personalizado con una interfaz simple y avanzada, una version más amigable al usuario y más parecido a cobalt.tools para un uso hogareño.

Media-suite:
Tipografía: 
-Titulares (Primary Font): Fuente con estilo Serif clásico. 
-Cuerpo de Texto (Secondary Font): Noto Sans.

MODO DIA:
Fondo Principal (Off-White): #F5F0E6
Contenido Secundario (Earth Brown): #A17855
Botones / Llamados a la Acción (Harvest Orange): #FF8F30
Acentos y Detalles (Leek Green): #6CBF6E
Texto Principal (Deep Bark): #4A3525

MODO NOCHE:
Fondo Principal (Dark Charcoal): #2B2624
Contenido Secundario / Tarjetas (Muted Grey-Brown): #403935
Texto Principal (Light Leek Beige): #E6DFD5
Botones / Llamados a la Acción (Golden Beak): #F2B134
Acentos y Detalles (Forest Leek Green): #315935

Dónde vive cada modo en el código:
ui/app/pages/simple.vue — la vista simple en sí (hero viajero + barra de link + botón día/noche).
ui/app/components/AppRoot.vue — el shell del modo estándar/avanzado (con todo el menú lateral de Downloads/Automation/Configuration/Tools).
ui/app/composables/useMode.ts — la lógica que decide qué modo mostrar y guarda la preferencia (localStorage + cookie)
ui/app/components/SettingsPanel.vue — toggle real que ve el usuario para cambiar entre modos

Dónde vive la paleta y la tipografía:
ui/app/assets/css/tailwind.css — la paleta completa (rama :root/.light y .dark). Sobreescribe los
  tokens de Nuxt UI v4 (--ui-bg, --ui-text, --ui-primary, --ui-color-*) con los colores de arriba;
  los ramps 50..950 se interpolaron en OKLab desde esas anclas, así los hovers/bordes/estados siguen
  la misma familia. También viven ahí .shell-surface (fondo) y el @theme de --font-sans/--font-serif.
ui/app/app.config.ts — sólo el punto de partida de Nuxt UI (nombres de color) + el color de texto
  sobre los botones sólidos primary (el naranja no llega a 4.5:1 con blanco, sí con el bark).
ui/app/spa-loading-template.html — pantalla de carga (misma paleta, muestra el hero según el tema del sistema).
ui/public/images/hero-day.png y hero-night.png — el arte del hero (originales en hero/).
Las fuentes (Noto Sans + Fraunces) se declaran en nuxt.config.ts (bloque fonts) y @nuxt/fonts las
self-hostea en build: el deploy no depende de Google.

ui/public/ — logo, favicon, colores base, impacta los dos modos por igual sin tocar lógica. Si querés textos/layout distintos entre simple y avanzado, ahí sí entra a tocar simple.vue y AppRoot.vue por separado.