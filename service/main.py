from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from models import *
from utils.docifyer import Docifyer
from utils.directus import Directus
import utils.transform
import os
import telegram
from datetime import date, time

### CONSTS ###

URL = os.environ['URL']
CMS = os.environ['CMS']
TG_TOKEN = os.environ['TG_TOKEN']
TG_GROUP = int(os.environ['TG_GROUP']) or None
TOKEN_SERVICE = os.environ['TOKEN_SERVICE']

TEMPLATE_PATH:str = "./templates"
TEMPORARY_PATH:str = "./static"

### INSTANCES ###

bot = telegram.Bot(TG_TOKEN)
directus: Directus = Directus(CMS)
app = FastAPI()

### MOUNTS

script_dir = os.path.dirname(__file__)
st_abs_file_path = os.path.join(script_dir, "static/")

app.mount("/static", StaticFiles(directory=st_abs_file_path), name="static")


### ROUTES

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/docify/angebot")
def docify_angebot(angebot: Angebot) -> dict:
    response: dict = {}
    thema: str = angebot.organisation if angebot.organisation != "" else angebot.vertreter_nname
    doc = Docifyer(name='angebot', data=angebot.dict())
    doc.run()
    name = doc.save(path=TEMPORARY_PATH, thema=thema, date=str(date.today()))
    url: str = URL+TEMPORARY_PATH[:2]+"/"+name
    response.update({'url': url})
    response.update(
        directus.import_file(
            url=url,
            title=name.replace('.docx', '')
        )
    )
    return response


@app.post("/notify/auftrag")
async def onAuftrag():
    bot.send_message(
        text="Neue Anfrage über das Ausleihformular!", chat_id=TG_GROUP)
    return {"message": "done"}
