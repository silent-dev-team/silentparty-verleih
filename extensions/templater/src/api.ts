import { defineOperationApi } from '@directus/extensions-sdk';
import { Stream } from 'stream';
import { TemplateBuilder } from './templateParser';

type Options = {
	text: string;
};

async function stream2buffer(stream: Stream): Promise<Buffer> {

	return new Promise < Buffer > ((resolve, reject) => {
			const _buf = Array < any > ();
			stream.on("data", chunk => _buf.push(chunk));
			stream.on("end", () => resolve(Buffer.concat(_buf)));
			stream.on("error", err => reject(`error converting stream - ${err}`));
	});
} 

export default defineOperationApi<Options>({
	id: 'templater',
	handler: async ({ data, template}, { services }) => {
		const { AssetsService } = services;
		const assets = new AssetsService({accountability: {admin: true, role: null, permissions: []}});
		//return {'data': data, 'template': template, 'assets': assets}
		//console.log(assets);
		const asset = await assets.getAsset('2b40920f-d240-426d-a0a0-f36d591496ef',{})
		const buff = await stream2buffer(asset.stream);
		console.log(buff); // das funktioniert bis hierhin

		const templater = new TemplateBuilder(buff, data); // hier kommt kommen wir nicht weiter
		/*
			evtl. funktoioniert der buffer nicht als input für den Templater
			evtl. sind die dipendensies nicht richtig installiert
		*/

		console.log(templater.xml);
		return {'asset':asset, 'buffer': buff};
		//assets.getAsset(id='2b40920f-d240-426d-a0a0-f36d591496ef').then((asset) => {
		//	console.log(asset);
		//});
	}
});
