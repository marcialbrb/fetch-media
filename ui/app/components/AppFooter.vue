<template>
  <!-- ═══════════════════════════════════════════════════════════════════════════
       FOOTER — editá sólo este objeto, no hace falta tocar el template.

         copy    → texto de la izquierda (acepta cualquier string).
         version → etiqueta de la derecha; si lo dejás vacío ('') no se muestra.
         links   → lista de enlaces. Cada uno es { label, href }.
                   Si la lista queda vacía ([]), no se muestra ningún enlace.

       Variantes:
         variant="band" (vista avanzada) → franja al pie, tomando el navbar como
             referencia: borde superior, sin caja ni sombra, arrancando donde arranca
             el contenido (al lado del sidebar).
         por defecto (modo simple)       → la cajita flotante de siempre.

       Guardás el archivo y el dev server recarga solo.
       ═══════════════════════════════════════════════════════════════════════════ -->
  <footer
    :class="
      isBand ? 'border-t border-default px-4 py-3 lg:-mx-6 lg:px-6' : 'px-3 pb-3 sm:px-4 sm:pb-4'
    "
  >
    <div
      class="flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between"
      :class="
        isBand
          ? ''
          : `ytp-card mx-auto w-full px-4 py-3 backdrop-blur-md ${props.wide ? 'max-w-none' : 'max-w-6xl'}`
      "
    >
      <p class="min-w-0 text-muted">
        {{ info.copy }}
      </p>

      <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span v-if="info.version" class="text-muted">{{ info.version }}</span>

        <a
          v-for="link in info.links"
          :key="link.href"
          :href="link.href"
          class="text-muted transition-colors hover:text-highlighted"
          target="_blank"
          rel="noopener"
        >
          {{ link.label }}
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{ wide?: boolean; variant?: 'card' | 'band' }>(), {
  wide: false,
  variant: 'card',
});

const isBand = computed(() => props.variant === 'band');

const info = {
  copy: 'Fetch Media — descargas para tu red local.',
  version: 'v1.0',
  links: [{ label: 'Repositorio', href: 'https://github.com/marcialbrb/fetch-media' }],
};
</script>
