import { defineOperationApi } from '@directus/extensions-sdk';

type Options = {
	url: string;
	id: string;
	folder: string;
};

export default defineOperationApi<Options>({
	id: 'doc-converter',
	handler: ({ url, id, folder }) => {
		console.log(url, id, folder);
	},
});
