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

// El modo simple es la portada: la pestaña dice sólo "Fetch Media", sin el prefijo de sección.
// Antes faltaba este useHead, así que al entrar directo la pestaña se quedaba con el título
// de la plantilla de carga y sólo se corregía al volver del modo avanzado.
useHead(() => ({ title: APP_TITLE }));
</script>
