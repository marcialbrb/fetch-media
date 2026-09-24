<template>
  <!-- The brand is always a link (do not wrap it in another one: that would nest links).
       In the simple mode it is passed to="/". -->
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
/* Inside @layer components so the navbar utilities (`hidden sm:flex`)
   can win: without a layer, `display: inline-flex` from here beats Tailwind. */
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

  /* The brand stays visible from 340 px (21.25rem) up; below that, icon only.
     The mode switch keeps its own cutoff in AppNavbar. */
  @media (width < 21.25rem) {
    .app-brand__text {
      display: none;
    }
  }
}
</style>
