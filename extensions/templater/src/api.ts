import { defineOperationApi } from '@directus/extensions-sdk';

type Options = {
	text: string;
};

export default defineOperationApi<Options>({
	id: 'templater',
	handler: ({ text }) => {
		console.log(text);
	},
});
