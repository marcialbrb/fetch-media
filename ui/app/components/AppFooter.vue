<template>
  <!-- ═══════════════════════════════════════════════════════════════════════════
       FOOTER — edit only this object, the template needs no changes.

         copy    → left-hand text. Leave it empty ('') to use the translated copy
                   (app.footer.tagline in ui/i18n/locales/*.json).
         version → right-hand label; leave it empty ('') and it is not shown.
         links   → list of links. Each one is { label, labelKey, href }: an empty
                   label falls back to the translation of that `labelKey`.
                   If the list is empty ([]), no link is shown.

       Variants:
         variant="band" (advanced view) → footer band, taking the navbar as
             reference: top border, no box or shadow, starting where the content
             starts (beside the sidebar).
         default (simple mode)          → the usual floating box.

       Save the file and the dev server reloads on its own.
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
        {{ tagline }}
      </p>

      <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span v-if="info.version" class="text-muted">{{ info.version }}</span>

        <a
          v-for="link in links"
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

const { t } = useI18n();

const isBand = computed(() => props.variant === 'band');

type FooterLink = { label?: string; labelKey?: string; href: string };

const info: { copy: string; version: string; links: FooterLink[] } = {
  copy: '',
  version: 'v1.0',
  links: [
    {
      label: '',
      labelKey: 'app.footer.repository',
      href: 'https://github.com/marcialbrb/fetch-media',
    },
  ],
};

// Empty strings fall back to the translated copy, so the footer follows the UI language.
const tagline = computed(() => info.copy || t('app.footer.tagline'));
const links = computed(() =>
  info.links.map((link) => ({
    href: link.href,
    label: link.label || (link.labelKey ? t(link.labelKey) : link.href),
  })),
);
</script>
