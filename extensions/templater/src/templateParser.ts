import * as AdmZip from "adm-zip";
import {XMLSerializer,DOMParser } from "xmldom";
import { TemplateData } from "./types";

export class TemplateBuilder{
    private parser = new DOMParser();
    private serializer = new XMLSerializer();
    private zip: AdmZip;

    public xml: Document;

    constructor(buff: Buffer, private data:TemplateData) {
        const amdzip = AdmZip.default;
        this.zip = new amdzip(buff);
        const xmlEntry = this.zip.getEntries().find(entry => entry.entryName === 'content.xml');
        if (!xmlEntry) {
            throw new Error('No content.xml found in template');
        }
        const xmlString = this.zip.readAsText(xmlEntry);
        this.xml = this.parser.parseFromString(xmlString, "text/xml");
        this._placeData();
    }

    private _placeData() {
        this._placeTables();
        this._placeValues();
    }

    private _placeValues() {
        let items = this.xml.getElementsByTagName("office:text")[0].childNodes as NodeListOf<Element>;
        for(var i = 0; i < items.length; i++){
            while(items[i].getElementsByTagName("text:user-field-get").length>0){

                let els = items[i].getElementsByTagName("text:user-field-get");
                let vname = els[0].getAttribute("text:name");
                if(vname == null) throw new Error("text:user-field-get has no text:name attribute");

                if(this.data.values[vname] != undefined){
                    els[0]?.parentNode?.replaceChild(this.xml.createTextNode(this.data.values[vname]), els[0]);
                }else{
                    els[0]?.parentNode?.replaceChild(this.xml.createTextNode(vname+" not found!"), els[0]);
                }

        
            }
        
        }
    }

    private _placeTables() {
        if(this.data.tables == undefined) return;
        let items = this.xml.getElementsByTagName("office:text")[0].childNodes as NodeListOf<Element>;

        for(var i = 0; i < items.length; i++){
            
            if(items[i].nodeName == "table:table"){
                let rows = items[i].getElementsByTagName("table:table-row");
                let tableName = items[i].getAttribute("table:name");

                if(tableName == null) throw new Error("table:table has no table:name attribute");
                if(rows.length == 0) throw new Error("table:table has no table:table-row children");

                if(!(tableName in this.data.tables)){
                    continue;
                }
                let insertCount = 0;
                for(var j = 0; j < rows.length; j++){
                    let rowValues = rows[j].getElementsByTagName("text:user-field-get");
                    let hasDynamicValues = false;
                    for(var k = 0; k < rowValues.length; k++){
                        let vname = rowValues[k].getAttribute("text:name");
                        if(vname == null) throw new Error("text:user-field-get has no text:name attribute");
                        if(this.data.tables[tableName].rows[0][vname] != undefined){
                            hasDynamicValues = true;
                            break;
                        }
                    }
                    if(hasDynamicValues){
                        const ref = rows[j];
                        let template = rows[j].cloneNode(true) as Element;
                        insertCount = 0;
                        for(let rowData of this.data.tables[tableName].rows){
                            let newRow = template.cloneNode(true) as Element;
                            let newRowValues = newRow.getElementsByTagName("text:user-field-get");
                            
                            for(var k = 0; k < newRowValues.length; k++){
                                console.log("k"+k+"/"+newRowValues.length);
                                let vname = newRowValues[k].getAttribute("text:name");
                                if(vname == null) throw new Error("text:user-field-get has no text:name attribute");
                                let parent = newRowValues[k]?.parentNode as Element;
                                if(rowData[vname] != undefined && parent != null){
                                    console.log("replace "+vname+" with "+rowData[vname]);
                                    parent.replaceChild(this.xml.createTextNode(rowData[vname]), newRowValues[k]);
                                    k--;
                                }else{
                                    parent.replaceChild(this.xml.createTextNode("-"), newRowValues[k]);
                                    k--;
                                }
                            }
                            ref.parentNode?.insertBefore(newRow, ref);
                            insertCount++;
                        }
                        
                        ref.parentNode?.removeChild(ref);
                        
                        j=j+insertCount-1;
                    }
        
                }

            }
        }
    }


    save(filename: string ) {
        const modifiedXmlString = this.serializer.serializeToString(this.xml);
        this.zip.updateFile('content.xml', Buffer.from(modifiedXmlString));
        this.zip.writeZip(filename);
    }



}

