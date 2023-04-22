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
	handler: async ({ data, template }, { services }) => {
		const { AssetsService, FilesService } = services;
		const assets = new AssetsService({accountability: {admin: true, role: null, permissions: []}});
		const templateAsset = await assets.getAsset('2b40920f-d240-426d-a0a0-f36d591496ef',{})
		//console.log(templateAsset.file);
		const buff = await stream2buffer(templateAsset.stream);

		const templater = new TemplateBuilder(buff, {'values': {}}); 
		//console.log(templater.xml);

		//console.log(templater.xml);

		// Hier muss eine neue File erzeugt werden, die dann als Asset zurückgegeben wird
		// -> https://github.com/directus/directus/blob/main/api/src/services/files.ts
		// -> createOne

		console.log('template builded');
		const files = new FilesService({accountability: {admin: true, role: null, permissions: []}});
		console.log('files works');
		//const primKey = await files.uploadOne(templateStream,file); // ruft createOne auf, daher testen wir damit erstmal
		const primKey = await files.createOne({
			filename_download : "test.odt",
			storage: "local", 
			folder: "baeacbe3-3779-4ce4-8c5b-d51b8318ceea",
			type: "application/vnd.oasis.opendocument.text-template"
		});
		// damn, das klappt noch nicht
		console.log('file created');

		console.log(primKey);


		return {'asset':templateAsset, 'buffer': buff};
	}
});
