import { defineOperationApi } from '@directus/extensions-sdk';
import { Stream } from 'stream';
import fetch from 'node-fetch';
import { RequestInit } from 'node-fetch';

type Options = {
	fileId: string;
	folder: string;
};

const URL = 'https://converter.silentparty-hannover.de/convert-to';

function streamToBlob (stream:Stream, mimeType:string|null = null): Promise<Blob> {
  if (mimeType != null && typeof mimeType !== 'string') {
    throw new Error('Invalid mimetype, expected string.')
  }
  return new Promise((resolve, reject) => {
    const chunks:any[] = []
    stream
      .on('data', chunk => chunks.push(chunk))
      .once('end', () => {
        const blob = mimeType != null
          ? new Blob(chunks, { type: mimeType })
          : new Blob(chunks)
        resolve(blob)
      })
      .once('error', reject)
  })
}

export default defineOperationApi<Options>({
	id: 'doc-converter',
	handler: async ({ fileId, folder }, { services, getSchema }) => {
		const { AssetsService, FilesService } = services;
		const assets = new AssetsService({accountability: {admin: true, role: null, permissions: []}});
		
		const sourceDoc = await assets.getAsset(fileId,{});
		const old_filename = sourceDoc.file.filename_download;
		const old_ext = old_filename.split('.').pop();
		const new_filename = old_filename.replace(/\.[^/.]+$/, "") + '.pdf';
		const stream:Stream = sourceDoc.stream;
		
		console.log(`converting ${old_filename} to ${new_filename}`);
		
		const blob = await streamToBlob(stream, `application/${old_ext}`);
		
		let form = new FormData();
		form.set('file', blob, old_filename);

		const requestOptions: RequestInit = {
			method: "POST",
			body: form
		};

		console.log('request to ', URL);
		const resp = await fetch(URL, requestOptions)
		const respStream = (await resp.blob()).stream();

		const files = new FilesService({schema: await getSchema(),accountability: {admin: true, role: null, permissions: []}});
		const primKey = await files.uploadOne(
			respStream,
			{
				title: new_filename,
				filename_download : new_filename,
				storage: "local", 
				folder: folder,
				type: "application/pdf"
			}
		);

		console.log(primKey);
		return {newFile: primKey};
	},
});
