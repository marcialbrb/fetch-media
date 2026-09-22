<template>
  <UButton
    color="neutral"
    variant="ghost"
    size="sm"
    :icon="icon"
    :square="square"
    :aria-label="title"
    :title="title"
    @click="
      () => {
        color.preference = next;
      }
    "
  >
    <span v-if="showLabel" :class="labelClass">{{ title }}</span>
  </UButton>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    square?: boolean;
    showLabel?: boolean;
    labelClass?: string;
    /** Sólo alterna claro/oscuro (sin estado 'sistema'). */
    twoState?: boolean;
  }>(),
  {
    square: false,
    showLabel: true,
    labelClass: '',
    twoState: false,
  },
);

const { t } = useI18n();

type Choice = 'system' | 'light' | 'dark';

const color = useColorMode();
const order = computed<Choice[]>(() => (props.twoState ? ['light', 'dark'] : ['system', 'light', 'dark']));
const current = computed<Choice>(() => {
  const pref = color.preference as Choice;

  if (props.twoState) {
    // Sin 'sistema': si la preferencia guardada es 'system', arrancamos del modo resuelto.
    return pref === 'light' || pref === 'dark' ? pref : color.value === 'dark' ? 'dark' : 'light';
  }

  return order.value.includes(pref) ? pref : 'system';
});
const next = computed<Choice>(() => {
  const opts = order.value;

  return opts[(opts.indexOf(current.value) + 1) % opts.length] ?? opts[0] ?? 'system';
});
const icon = computed(() => {
  if (current.value === 'light') {
    return 'i-lucide-sun';
  }

  if (current.value === 'dark') {
    return 'i-lucide-moon';
  }

  return 'i-lucide-monitor';
});
const title = computed(() => {
  if (current.value === 'light') {
    return t('app.theme.light');
  }

  if (current.value === 'dark') {
    return t('app.theme.dark');
  }

  return t('app.theme.system');
});
</script>
