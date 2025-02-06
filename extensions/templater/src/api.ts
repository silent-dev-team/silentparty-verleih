import { defineOperationApi } from '@directus/extensions-sdk';
import { Stream } from 'stream';
import { TemplateBuilder } from './templateParser';

type Options = {
	data: any;
	filename: string;
	templateId: string;
	folderId: string;
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
	handler: async ({ data, filename, templateId, folderId }, { services, getSchema }) => {
		const { AssetsService, FilesService } = services;
		const assets = new AssetsService({accountability: {admin: true, role: null, permissions: []}});
		const templateAsset = await assets.getAsset(templateId,{})
		const buff = await stream2buffer(templateAsset.stream);

		const templater = new TemplateBuilder(buff, data); 

		console.log('template builded');
		const files = new FilesService({schema: await getSchema(),accountability: {admin: true, role: null, permissions: []}});
		console.log('files works');
		const primKey = await files.uploadOne(
			templater.toStream(),
			{
			title: filename,
			filename_download : filename,
			//filename_disk: filename,
			storage: "local", 
			folder: folderId,
			type: "application/vnd.oasis.opendocument.text-template"
		});
		console.log('file created');

		console.log(primKey);
		return {newFile: primKey};
	}
});
