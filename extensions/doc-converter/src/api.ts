import { defineOperationApi } from '@directus/extensions-sdk';
import { Stream } from 'stream';

type Options = {
	url: string;
	id: string;
	folder: string;
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
	id: 'doc-converter',
	handler: async ({ url, id, folder }, { services, getSchema }) => {
		const { AssetsService, FilesService } = services;
		const assets = new AssetsService({accountability: {admin: true, role: null, permissions: []}});
		const sourceDoc = await assets.getAsset(id,{})
		sourceDoc

		const files = new FilesService({schema: await getSchema(),accountability: {admin: true, role: null, permissions: []}});
    const filename = files.filename;  //TODO: check
		fetch(url,{
			method: 'POST',
			//...
		})

		const primKey = await files.uploadOne(
			//STREAM,
			{
			title: filename,
			filename_download : filename,
			storage: "local", 
			folder: folder,
			type: "application/pdf"
		});

		console.log(primKey);
		return {newFile: primKey};
	},
});
