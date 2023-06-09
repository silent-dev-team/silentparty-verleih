import { defineOperationApp } from '@directus/extensions-sdk';

export default defineOperationApp({
	id: 'doc-converter',
	name: 'DocumentConverter',
	icon: 'box',
	description: 'This is a client for the LibreOffice document converter API.',
	overview: ({ url, fileId, folder }) => [
		{
			label: 'url',
			text: url,
		},
		{
			label: 'fileId',
			text: fileId,
		},
		{
			label: 'folder',
			text: folder,
		},
	],
	options: [
		{
			field: 'url',
			name: 'URL to LibreOffice API',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'input',
			},
		},
		{
			field: 'fileId',
			name: 'UUID of original document',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'input',
			},
		},
		{
			field: 'folder',
			name: 'UUID of taget folder',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'input',
			},
		},
	],
});
