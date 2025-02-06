import { defineOperationApp } from '@directus/extensions-sdk';

export default defineOperationApp({
	id: 'templater',
	name: 'Templater',
	icon: 'box',
	description: 'This is the templater operation!',
	overview: ({ data, filename, templateId, folderId }) => [
		{
      label: "Data",
      data
    },
    {
      label: "Filename",
      filename
    },
    {
      label: "Template ID",
      templateId
    },
    {
      label: "Folder ID",
      folderId
    },
  ],
  options: [
    {
      field: "data",
      name: "Daten",
      type: "json",
      meta: {
        width: "full",
        interface: "input"
      }
    },
    {
      field: "filename",
      name: "Filename",
      type: "string",
      meta: {
        width: "full",
        interface: "input"
      }
    },
    {
      field: "templateId",
      name: "Template ID",
      type: "string",
      meta: {
        width: "full",
        interface: "input"
      }
    },
    {
      field: "folderId",
      name: "Folder ID",
      type: "string",
      meta: {
        width: "full",
        interface: "input"
      }
    }
	],
});
