export default defineAppConfig({
  ui: {
    // The colour names below are only the starting point: the real palette
    // (day/night) lives in app/assets/css/tailwind.css and overrides the
    // --ui-color-* tokens and the semantic ones (--ui-bg, --ui-text, --ui-primary, ...).
    primary: 'orange',
    colors: {
      primary: 'orange',
      secondary: 'stone',
      success: 'green',
      neutral: 'stone',
    },
    formField: {
      slots: {
        label: 'block font-bold text-default',
      },
    },
    tooltip: {
      slots: {
        content: 'pointer-events-auto',
      },
    },
    dropdownMenu: {
      slots: {
        content: 'ytp-floating-surface',
      },
    },
    popover: {
      slots: {
        content: 'ytp-floating-surface',
      },
    },
    select: {
      slots: {
        content: 'ytp-floating-surface',
      },
      variants: {
        variant: {
          outline: 'bg-elevated/40 hover:bg-elevated/55 disabled:bg-elevated/20',
        },
      },
    },
    selectMenu: {
      slots: {
        content: 'ytp-floating-surface',
      },
      variants: {
        variant: {
          outline: 'bg-elevated/40 hover:bg-elevated/55 disabled:bg-elevated/20',
        },
      },
    },
    button: {
      compoundVariants: [
        {
          color: 'primary',
          variant: 'solid',
          class: 'text-[var(--ytp-cta-ink)]',
        },
        {
          color: 'neutral',
          variant: 'outline',
          class:
            'bg-transparent hover:bg-elevated/30 active:bg-elevated/40 disabled:bg-transparent aria-disabled:bg-transparent',
        },
        {
          color: 'neutral',
          variant: 'soft',
          class:
            'bg-elevated/30 hover:bg-elevated/45 active:bg-elevated/55 disabled:bg-elevated/20 aria-disabled:bg-elevated/20',
        },
        {
          color: 'neutral',
          variant: 'ghost',
          class: 'hover:bg-elevated/30 active:bg-elevated/40 focus-visible:bg-elevated/30',
        },
      ],
      defaultVariants: {
        size: 'sm',
      },
    },
  },
});
