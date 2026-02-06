import { writable } from 'svelte/store';
import { createToaster } from '@skeletonlabs/skeleton-svelte';

// Create one global toaster instance
const toasterInstance = createToaster({});

// Export a writable so the layout can bind it
export const store_toast = writable(toasterInstance);

// Optional convenience wrapper
export function showToast(
	type: 'success' | 'warning' | 'error' | 'info',
	title: string,
	description?: string
) {
	store_toast.update((toaster) => {
		toaster[type]({
			title,
			description
		});
		return toaster;
	});
}
