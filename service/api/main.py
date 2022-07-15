
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from models import *
from objects.docifyer import Docifyer
import requests

import os, telegram

URL = os.environ['URL']
CMS = os.environ['CMS']
TG_TOKEN = os.environ['TG_TOKEN']
TG_GROUP = int(os.environ['TG_GROUP']) or None

app = FastAPI()
bot = telegram.Bot(TG_TOKEN)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/docify/angebot")
async def docify(angebot: Angebot):
    thema:str = angebot.organisation if angebot.organisation != "" else angebot.vertreter_nname
    doc = Docifyer(name='angebot', data=angebot.dict())
    doc.run()
    name = doc.save(path='./static',thema=thema)

    directus_import: dict = {
        "url": URL+"/static/"+name
    }
    
    r = requests.post(
        url = CMS + '/files/import',
        data = directus_import
    )
    return r.json() #return URL+"/static/"+name

script_dir = os.path.dirname(__file__)
st_abs_file_path = os.path.join(script_dir, "static/")
app.mount("/static", StaticFiles(directory=st_abs_file_path), name="static")

@app.post("/notify/auftrag")
async def onAuftrag():
    bot.send_message(text="Neue Anfrage über das Ausleihformular!", chat_id=TG_GROUP)
    return {"message": "done"}