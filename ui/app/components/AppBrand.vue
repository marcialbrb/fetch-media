<template>
  <!-- La marca es siempre un enlace (no envolverla en otro: quedarían links anidados).
       En el modo simple se le pasa to="/". -->
  <NuxtLink :to="props.to" class="app-brand min-w-0" :aria-label="brandName">
    <img
      src="/images/app-icon.png"
      :alt="brandName"
      class="app-brand__icon"
      width="32"
      height="32"
    />
    <span class="app-brand__text">Fetch&nbsp;<span class="app-brand__accent">Media</span></span>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ to?: string }>(), { to: '/' });

const brandName = 'Fetch Media';
</script>

<style scoped>
/* Dentro de @layer components para que las utilidades del navbar (`hidden sm:flex`)
   puedan ganarle: sin capa, `display: inline-flex` de acá pisa a Tailwind. */
@layer components {
  .app-brand {
    display: inline-flex;
    min-width: 0;
    align-items: center;
    gap: 0.5rem;
  }

  .app-brand__icon {
    width: 2.25rem;
    height: 2.25rem;
    flex-shrink: 0;
    object-fit: contain;
  }

  .app-brand__text {
    font-family: var(--font-serif, 'Fraunces', ui-serif, Georgia, serif);
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--ui-text-highlighted);
    white-space: nowrap;
  }

  .app-brand__accent {
    color: var(--ui-primary);
  }

  /* La marca se mantiene visible desde 340 px (21.25rem); por debajo, sólo el icono.
     El switch de modo conserva su propio corte en AppNavbar. */
  @media (width < 21.25rem) {
    .app-brand__text {
      display: none;
    }
  }
}
</style>
