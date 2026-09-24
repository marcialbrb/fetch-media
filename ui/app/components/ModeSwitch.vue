<template>
  <div class="mode-switch" role="group" :aria-label="t('common.switchMode')">
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      class="mode-switch__btn"
      :class="{ 'is-active': opt.value === current }"
      :aria-pressed="opt.value === current"
      :title="opt.label"
      :aria-label="opt.label"
      @click="select(opt.value)"
    >
      <!-- In compact mode (advanced navbar) only the icon is left; the name goes in
           the tooltip and the aria-label. -->
      <UIcon :name="opt.icon" class="mode-switch__icon size-4" :class="compact ? '' : 'hidden'" />
      <span v-if="!compact">{{ opt.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

/**
 * `compact` = on small screens it shows only the icons and reveals the labels
 * from `sm` up. Without the prop it behaves as always (labels only).
 */
defineProps<{ compact?: boolean }>();

const { t } = useI18n();
const { mode } = useMode();
const route = useRoute();

// The active tab follows the route (what you see), not the stored preference,
// so "Advanced" is not highlighted while on /.
const current = computed<'simple' | 'regular'>(() =>
  cleanPath(route.path) === SIMPLE_PATH ? 'simple' : 'regular',
);

const options = computed<Array<{ value: 'simple' | 'regular'; label: string; icon: string }>>(() => [
  { value: 'simple', label: t('common.modeSimple'), icon: 'i-lucide-sparkles' },
  { value: 'regular', label: t('common.modeAdvanced'), icon: 'i-lucide-layout-dashboard' },
]);

/** useMode().save() se encarga de persistir y de navegar a / (simple) o /advanced. */
const select = (value: 'simple' | 'regular'): void => {
  if (value !== current.value) {
    mode.value = value;
  }
};
</script>

<style scoped>
/* All inside @layer components: without a layer this CSS beats Tailwind's
   utilities (which live in @layer utilities, declared later) and breaks classes
   like `hidden` / `sm:inline-flex` that the navbar passes to hide it on mobile. */
@layer components {
.mode-switch {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px;
  border-radius: 9999px;
  border: 1px solid var(--ui-border-accented);
  background-color: color-mix(in oklab, var(--ui-bg-elevated) 65%, transparent);
}

.mode-switch__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.8125rem;
  line-height: 1.15rem;
  font-weight: 600;
  color: var(--ui-text-muted);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.mode-switch__btn:hover {
  color: var(--ui-text-highlighted);
}

.mode-switch__btn.is-active {
  background-color: var(--ui-primary);
  color: #2b2624;
}
}
</style>
