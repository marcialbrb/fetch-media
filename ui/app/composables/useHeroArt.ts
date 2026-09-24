/**
 * Hero art (day/night) shared by the simple mode and the advanced view.
 * The images live in public/images/hero-day.png and hero-night.png.
 * It is returned with reactive() so templates can use `hero.image` directly
 * (Vue only unwraps top-level refs or refs inside reactive objects).
 */
export const useHeroArt = () => {
  const colorMode = useColorMode();

  const mode = computed<'day' | 'night'>(() => (colorMode.value === 'dark' ? 'night' : 'day'));
  const image = computed(() => `/images/hero-${mode.value}.png`);
  // Brand name, not the backend's `instance_title` (which is still "YTPTube").
  const alt = computed(() => 'Fetch Media');

  /** Preloads both variants so the theme switch does not flicker. */
  const preload = (): void => {
    for (const variant of ['day', 'night']) {
      const art = new Image();
      art.src = `/images/hero-${variant}.png`;
    }
  };

  return reactive({ mode, image, alt, preload });
};
