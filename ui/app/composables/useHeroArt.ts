/**
 * Arte del hero (día/noche) compartido por el modo simple y la vista avanzada.
 * Las imágenes viven en public/images/hero-day.png y hero-night.png.
 * Se devuelve con reactive() para que en los templates se use `hero.image` a secas
 * (Vue sólo desenvuelve refs de nivel superior o dentro de objetos reactivos).
 */
export const useHeroArt = () => {
  const colorMode = useColorMode();

  const mode = computed<'day' | 'night'>(() => (colorMode.value === 'dark' ? 'night' : 'day'));
  const image = computed(() => `/images/hero-${mode.value}.png`);
  // Nombre de marca, no el `instance_title` del backend (que sigue siendo "YTPTube").
  const alt = computed(() => 'Fetch Media');

  /** Precarga las dos variantes para que el cambio de tema no parpadee. */
  const preload = (): void => {
    for (const variant of ['day', 'night']) {
      const art = new Image();
      art.src = `/images/hero-${variant}.png`;
    }
  };

  return reactive({ mode, image, alt, preload });
};
