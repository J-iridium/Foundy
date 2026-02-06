export const frameworks = ['laravel', 'wp', 'php'];

export const nav = {
	getting_started: {
		title: 'Getting Started',
		items: ['installation', 'authentication', 'first-request']
	},
	inbound: {
		title: 'Inbound Content',
		items: ['receiving-images', 'custom-types', 'webhooks']
	},
	reference: {
		title: 'Reference',
		items: ['endpoints', 'errors', 'rate-limits']
	}
};

export const content = {
	laravel: {
		installation: 'composer require foundy/laravel',
		authentication: 'Set FOUNDY_API_KEY in your .env file.',
		'first-request': `use Foundy\\Facades\\Foundy;\nFoundy::ping();`
	},
	wp: {
		installation: 'Install the Foundy plugin via wp-admin or ZIP.',
		authentication: 'Define FOUNDY_API_KEY in wp-config.php',
		'first-request': `do_action('foundy_ping');`
	},
	php: {
		installation: 'composer require guzzlehttp/guzzle',
		authentication: 'Pass API key via Authorization header',
		'first-request': `$client->get("/ping");`
	}
};
