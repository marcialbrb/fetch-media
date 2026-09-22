import { describe, expect, it } from 'bun:test';

import {
  ADVANCED_PATH,
  SIMPLE_PATH,
  isSimple,
  modeFromPref,
  parseMode,
  prefFromMode,
  routeTarget,
} from '~/composables/useMode';

describe('useMode', () => {
  it('parse', () => {
    expect(parseMode('true')).toBe(true);
    expect(parseMode('false')).toBe(false);
    expect(parseMode(true)).toBe(true);
    expect(parseMode(false)).toBe(false);
    expect(parseMode('null')).toBeNull();
    expect(parseMode('')).toBeNull();
  });

  it('resolve', () => {
    expect(isSimple(null, true)).toBe(true);
    expect(isSimple(null, false)).toBe(false);
    expect(isSimple(false, true)).toBe(false);
    expect(isSimple(true, false)).toBe(true);
  });

  it('map', () => {
    expect(modeFromPref(null)).toBe('default');
    expect(modeFromPref(true)).toBe('simple');
    expect(modeFromPref(false)).toBe('regular');
    expect(prefFromMode('default')).toBeNull();
    expect(prefFromMode('simple')).toBe(true);
    expect(prefFromMode('regular')).toBe(false);
  });

  it('route', () => {
    // '/' es el modo simple y '/advanced' el avanzado: cada uno redirige al otro sólo si
    // el modo resuelto no coincide con la URL.
    expect(routeTarget('/', null, true)).toBeNull();
    expect(routeTarget('/', null, false)).toBe(ADVANCED_PATH);
    expect(routeTarget(ADVANCED_PATH, null, true)).toBe(SIMPLE_PATH);
    expect(routeTarget(ADVANCED_PATH, null, false)).toBeNull();
    expect(routeTarget('/history', null, true)).toBeNull();
  });
});
