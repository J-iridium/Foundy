import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const name = 'selectedSite';
const stored = browser ? localStorage.getItem(name) : null;

export const selectedSite = writable(stored ? JSON.parse(stored) : null);

if (browser) {
	selectedSite.subscribe((value, prev) => {
		if (value) {
			localStorage.setItem(name, JSON.stringify(value));
			// Only reload if the site actually changed
			if (prev && value !== prev) {
				location.reload();
			}
		} else {
			localStorage.removeItem(name);
			location.reload(); // Optional: reload if cleared
		}
	});
}