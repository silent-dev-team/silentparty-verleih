import { defineOperationApp } from '@directus/extensions-sdk';

export default defineOperationApp({
	id: 'doc-converter',
	name: 'DocumentConverter',
	icon: 'box',
	description: 'This is a client for the LibreOffice document converter API.',
	overview: ({ fileId, folder }) => [
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
