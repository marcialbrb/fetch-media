import { computed, nextTick, type ComputedRef, type WritableComputedRef } from 'vue';
import { useStorage, type RemovableRef } from '@vueuse/core';

export type Mode = 'default' | 'simple' | 'regular';
type Pref = boolean | null;

export const MODE_KEY = 'simple_mode';
// The simple mode lives at the root and the advanced one at /advanced.
export const SIMPLE_PATH = '/';
export const ADVANCED_PATH = '/advanced';

const YES = new Set(['1', 'true', 'yes', 'on']);
const NO = new Set(['0', 'false', 'no', 'off']);

let prefRef: RemovableRef<Pref> | null = null;

export const parseMode = (value: unknown): Pref => {
  if (Array.isArray(value)) {
    return parseMode(value[0]);
  }

  if ('boolean' === typeof value) {
    return value;
  }

  if ('number' === typeof value) {
    return value === 1 ? true : value === 0 ? false : null;
  }

  if ('string' !== typeof value) {
    return null;
  }

  const item = value.trim().toLowerCase();

  if (YES.has(item)) {
    return true;
  }

  if (NO.has(item)) {
    return false;
  }

  return null;
};

export const modeFromPref = (pref: Pref): Mode => {
  if (pref === null) {
    return 'default';
  }

  return pref ? 'simple' : 'regular';
};

export const prefFromMode = (mode: Mode): Pref => {
  if (mode === 'default') {
    return null;
  }

  return mode === 'simple';
};

export const isSimple = (pref: Pref, fallback: boolean): boolean => pref ?? fallback;

export const cleanPath = (path: string): string => path.replace(/\/+$/, '') || '/';

export const usePref = (): RemovableRef<Pref> => {
  if (prefRef === null) {
    prefRef = useStorage<Pref>(MODE_KEY, null, undefined, {
      serializer: {
        read: parseMode,
        write: (value) => (value === null ? 'null' : String(value)),
      },
      writeDefaults: false,
    });
  }

  return prefRef;
};

export const cookieDefault = (): Pref => parseMode(useCookie<string | null>(MODE_KEY).value);

export const savePref = (value: Pref): void => {
  const pref = usePref();
  pref.value = value;
};

export const useMode = (): {
  mode: WritableComputedRef<Mode>;
  on: ComputedRef<boolean>;
  def: ComputedRef<boolean>;
  save: (mode: Mode) => Promise<void>;
} => {
  const cfg = useYtpConfig();
  const route = useRoute();
  const pref = usePref();
  const def = computed(() => Boolean(cfg.is_loaded ? cfg.app.simple_mode : cookieDefault()));
  const on = computed(() => isSimple(pref.value, def.value));

  const save = async (value: Mode): Promise<void> => {
    savePref(prefFromMode(value));
    await nextTick();

    const simpleRoute = cleanPath(route.path) === SIMPLE_PATH;

    if (on.value !== simpleRoute) {
      await navigateTo(on.value ? SIMPLE_PATH : ADVANCED_PATH);
    }
  };

  const mode = computed<Mode>({
    get: () => modeFromPref(pref.value),
    set: (value) => {
      void save(value);
    },
  });

  return { mode, on, def, save };
};

/**
 * Returns the other mode's URL when the current path does not match the resolved mode.
 * `null` means "leave it where it is".
 */
export const routeTarget = (path: string, pref: Pref, fallback: boolean): string | null => {
  const current = cleanPath(path);

  if (current !== SIMPLE_PATH && current !== ADVANCED_PATH) {
    return null;
  }

  if (isSimple(pref, fallback)) {
    return current === ADVANCED_PATH ? SIMPLE_PATH : null;
  }

  return current === SIMPLE_PATH ? ADVANCED_PATH : null;
};
