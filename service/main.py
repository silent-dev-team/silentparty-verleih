from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from models import *
from objects.docifyer import Docifyer
import requests

URL = 'http://localhost:8000'
CMS = 'https://cms.silentparty-hannover.de'

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/docify/angebot")
async def docify(angebot: Angebot):
    thema:str = angebot.organisation if angebot.organisation != "" else angebot.vertreter_nname
    doc = Docifyer(name='angebot', data=angebot.dict())
    doc.run()
    path, name = doc.save(thema=thema)
    """
    directus_import: dict = {
        "url": 'https://www.orimi.com/pdf-test.pdf', #path,
        "data": { 
            "url": 'https://www.orimi.com/pdf-test.pdf',
            "folder": "Dokumente/Angebote",
            "title": name,
        }
    }
    
    r = requests.post(
        url = CMS + '/files/import',
        data = directus_import
    )
    return r.json()
    """
    return URL+"/parsed_files/"+name

app.mount("/parsed_files", StaticFiles(directory="parsed_files"), name="parsed_files")