<template>
  <div class="shell-stage shell-surface flex min-h-screen flex-col">
    <AppNavbar />

    <div class="flex min-h-0 flex-1 flex-col">
      <slot />
    </div>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { APP_TITLE } from '~/utils';

// The simple mode is the landing page: the tab says only "Fetch Media", without the section prefix.
// This useHead used to be missing, so entering directly left the tab with the loading
// template's title and it only corrected itself when coming back from the advanced view.
useHead(() => ({ title: APP_TITLE }));
</script>
