import { defineOperationApp } from '@directus/extensions-sdk';

export default defineOperationApp({
	id: 'templater',
	name: 'Templater',
	icon: 'box',
	description: 'This is the templater operation!',
	overview: ({ text }) => [
		{
      label: "Data",
      data
    },
    {
      label: "Template ID",
      template
    },
  ],
  options: [
    {
      field: "data",
      name: "Daten",
      type: "string",
      meta: {
        width: "full",
        interface: "input"
      }
    },
    {
      field: "template",
      name: "Template",
      type: "string",
      meta: {
        width: "full",
        interface: "input"
      }
    }
	],
});
