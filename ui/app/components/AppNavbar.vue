<template>
  <header class="app-navbar px-3 pt-3 sm:px-4 sm:pt-4">
    <div class="mx-auto w-full max-w-6xl">
      <div
        class="ytp-card flex items-center justify-between gap-2 px-3 py-2 backdrop-blur-md sm:gap-3 sm:px-4"
      >
        <div class="flex min-w-0 items-center gap-2">
          <slot name="left" />

          <!-- The brand is already a link; in this mode it points to the simple view root. -->
          <AppBrand to="/" />
        </div>

        <div class="flex shrink-0 items-center gap-1 sm:gap-2">
          <div class="nav-mode-switch flex">
            <!-- The same icons as the advanced navbar (without the words). -->
            <ModeSwitch compact />
          </div>

          <ThemeButton two-state data-theme-toggle :show-label="false" />

          <UButton
            v-if="socket.connectionStatus !== 'connected'"
            color="neutral"
            variant="ghost"
            size="sm"
            icon="i-lucide-rotate-cw"
            :loading="socket.connectionStatus === 'connecting'"
            :disabled="socket.connectionStatus === 'connecting'"
            :aria-label="t('common.reconnect')"
            :title="t('common.reconnect')"
            square
            @click="socket.reconnect"
          />

          <UDropdownMenu :items="accountMenu" :content="{ align: 'end' }">
            <UButton
              color="neutral"
              variant="ghost"
              size="sm"
              icon="i-lucide-user-round"
              :aria-label="accountLabel"
              :title="accountLabel"
              square
            />
          </UDropdownMenu>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { DropdownMenuItem } from '@nuxt/ui';

const { t } = useI18n();
const auth = useAuth();
const socket = useAppSocket();

const authVisible = computed(() => auth.status.value?.disabled !== true);
const accountLabel = computed(() => auth.status.value?.user?.username || t('auth.account'));

const logout = async (): Promise<void> => {
  await auth.logout();
  await navigateTo('/login');
};

const accountMenu = computed<DropdownMenuItem[][]>(() => {
  const items: DropdownMenuItem[] = [
    ...(authVisible.value
      ? [
          {
            label: t('auth.account'),
            icon: 'i-lucide-user-round',
            onSelect: (): void => {
              // The AccountModal lives in AppRoot (inside UApp) and listens for this event.
              window.dispatchEvent(new CustomEvent('ytp:open-account'));
            },
          },
        ]
      : []),
    {
      label: t('common.webuiSettings'),
      icon: 'i-lucide-settings-2',
      onSelect: (): void => {
        // AppRoot (inside each page) is the one holding the settings panel.
        window.dispatchEvent(new CustomEvent('ytp:open-settings'));
      },
    },
  ];

  const actions: DropdownMenuItem[] = authVisible.value
    ? [
        {
          label: t('auth.logout'),
          icon: 'i-lucide-log-out',
          color: 'error' as const,
          onSelect: (): void => {
            void logout();
          },
        },
      ]
    : [];

  return actions.length > 0 ? [items, actions] : [items];
});
</script>

<style scoped>
.app-navbar {
  position: relative;
  z-index: 30;
}

/* Below 450px the switch gets in the way: only the brand with its icon is left. */
@media (width < 28.125rem) {
  .nav-mode-switch {
    display: none;
  }
}
</style>
