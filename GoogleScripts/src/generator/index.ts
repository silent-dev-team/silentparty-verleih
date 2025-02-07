import { defineEndpoint } from '@directus/extensions-sdk';
import { Router } from "express";

export default {
	id:"generator",
	handler: async (router: Router, { services }: any) => {
		const { ItemsService } = services;
		router.get('/:operation/:id', async (_req:any, res) => {
			let id = _req.params.id;
			let operation = _req.params.operation;

			let itemService = new ItemsService("Anfragen", {
				schema: _req.schema,
				accountability: _req.accountability,
			  });
			let gitemService = new ItemsService("GoogleScripts", {
				schema: _req.schema,
				accountability: _req.accountability,
			  });
			console.log(operation);
			let script = await gitemService.readByQuery({filter:{'name':{_eq:operation}}});
			console.log(script);
			if(script.length != 1){
				res.send({error:"wrong operation"});
				return;
			}
			
			let el = await itemService.readByQuery({filter:{'id':{_eq:id}}, fields:["*","Tarif.*","*"]});
			if(el.length!=1){
				res.send({error:"error"});
				return;
			}
			el = el[0];
			console.log(el);

			let kh_kost = el.kh_anzahl * el.Tarif.kh_price as number;
			let snd_kost = el.sr_anzahl * el.Tarif.sr_price as number;
			let pauschal = el.Tarif.pauschale as number;
			let gesammt = kh_kost+snd_kost+pauschal;
			let deadline = new Date();
			deadline.setDate(deadline.getDate()+10);
			let data = 
			  {
				"anfrage_id":id,
				"document_name":operation+ "_" +new Date().toLocaleString("de-DE"),
				"felder": {
				  "headline": "",
				  "organisation": el.organisation,
				  "vertreter_vname": el.vorname,
				  "vertreter_nname": el.nachname,
				  "strasse": el.strasse,
				  "hausnummer": el.hausnummer,
				  "plz": el.plz,
				  "ort": el.ort,
				  "date": new Date().toLocaleDateString("de-DE"),
				  "r_num": "INV-2025-001",
				  "p_summe": gesammt.toFixed(2),
				  "deadline": deadline.toLocaleDateString("de-DE"),
				  "d_gueltig_bis":deadline.toLocaleDateString("de-DE"),
				  'd_veranstaltung': new Date(el.start).toLocaleDateString("de-DE"),
				  "d_angebot": new Date(el.start).toLocaleDateString("de-DE")
				},
				"table": [
				  {
					"pos": "1",
					"bezeichnung": "Kopfhörer",
					"menge": el.kh_anzahl+"",
					"einzelpreis": el.Tarif.kh_price.toFixed(2),
					"gesamtpreis": kh_kost.toFixed(2)
				  },
				  {
					"pos": "2",
					"bezeichnung": "Sender",
					"menge": el.sr_anzahl+"",
					"einzelpreis": el.Tarif.sr_price.toFixed(2),
					"gesamtpreis": snd_kost.toFixed(2)
				  },
				  {
					"pos": "3",
					"bezeichnung": "Pauschale",
					"menge": 1+"",
					"einzelpreis": pauschal.toFixed(2),
					"gesamtpreis": pauschal.toFixed(2)
				  }
				]
			}
			let jdata = JSON.stringify(data);
			res.redirect(script[0].url+"?data="+encodeURIComponent(jdata));
		});
	}
}

