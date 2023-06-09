import { defineOperationApi } from '@directus/extensions-sdk';
import { Stream } from 'stream';

type Options = {
	url: string;
	fileId: string;
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
	handler: async ({ url, fileId, folder }, { services, getSchema }) => {
		const { AssetsService, FilesService } = services;
		const assets = new AssetsService({accountability: {admin: true, role: null, permissions: []}});
		console.log(fileId);
		const sourceDoc = await assets.getAsset(fileId,{});
		const stream = sourceDoc.stream;
		console.log(stream);
		return {msg: 'ok'};
		const buff = await stream2buffer(sourceDoc.stream);
		const blob = new Blob([buff]);
		var data = new FormData()
		data.append('file', blob)
		return {blob: blob};

		//const files = new FilesService({schema: await getSchema(),accountability: {admin: true, role: null, permissions: []}});
    //const filename = files.filename;  //TODO: check

		fetch(url,{
			method: 'POST',
			body: data
		})

		return {msg: 'ok'};

		const primKey = await files.uploadOne(
			//STREAM,
			{
				title: filename,
				filename_download : filename,
				storage: "local", 
				folder: folder,
				type: "application/pdf"
			}
		);

		console.log(primKey);
		return {newFile: primKey};
	},
});
