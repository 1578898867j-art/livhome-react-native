import * as SecureStore from 'expo-secure-store';

const LOGIN_STATE_KEY = 'livhome.auth.logged-in';
const LOGGED_IN_VALUE = '1';

function fallbackStorage() {
  if (!globalThis.localStorage) throw new Error('Persistent storage is unavailable.');
  return globalThis.localStorage;
}

async function readValue() {
  if (await SecureStore.isAvailableAsync()) {
    return SecureStore.getItemAsync(LOGIN_STATE_KEY);
  }
  return fallbackStorage().getItem(LOGIN_STATE_KEY);
}

export async function hasLoginState() {
  try {
    return (await readValue()) === LOGGED_IN_VALUE;
  } catch {
    return false;
  }
}

export async function saveLoginState() {
  if (await SecureStore.isAvailableAsync()) {
    await SecureStore.setItemAsync(LOGIN_STATE_KEY, LOGGED_IN_VALUE);
    return;
  }
  fallbackStorage().setItem(LOGIN_STATE_KEY, LOGGED_IN_VALUE);
}

export async function clearLoginState() {
  if (await SecureStore.isAvailableAsync()) {
    await SecureStore.deleteItemAsync(LOGIN_STATE_KEY);
    return;
  }
  fallbackStorage().removeItem(LOGIN_STATE_KEY);
}
