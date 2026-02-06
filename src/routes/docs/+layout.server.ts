import { frameworks, content } from '../../lib-depricated/docs/config';
import { error } from '@sveltejs/kit';

export function load({ params }) {
	const { version, framework, instruction } = params;
    
	if (!frameworks.includes(framework)) {
		throw error(404, 'Framework not supported');
	}

	return {
		version,
		framework,
		instruction
		// code: content[framework]?.[instruction] ?? '// Not implemented yet'
	};
}
