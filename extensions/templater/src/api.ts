import { defineOperationApi } from '@directus/extensions-sdk';
import { Stream } from 'stream';
import { TemplateBuilder } from './templateParser';
import * as AdmZip from "adm-zip";

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
		const templateAsset = await assets.getAsset('2b40920f-d240-426d-a0a0-f36d591496ef',{})
		const buff = await stream2buffer(templateAsset.stream);

		const templater = new TemplateBuilder(buff, {'values': {}}); 

		console.log(templater.xml);

		// Hier muss eine neue File erzeugt werden, die dann als Asset zurückgegeben wird

		return {'asset':templateAsset, 'buffer': buff};
	}
});
