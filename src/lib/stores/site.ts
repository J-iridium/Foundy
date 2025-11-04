import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const STORAGE_KEY = 'selectedSite';

// Initialize store with stored value (only in browser)
const initialValue = browser ? JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') : null;

export const selectedSite = writable(initialValue);

// Persist to localStorage when changed (only in browser)
if (browser) {
	selectedSite.subscribe((value) => {
		if (value !== null && value !== undefined) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
		} else {
			localStorage.removeItem(STORAGE_KEY);
		}
	});
}
