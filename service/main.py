
from models import *
from objects.docifyer import Docifyer
import os, telegram
from fastapi import FastAPI

TG_TOKEN = os.getenv('TG_TOKEN')
TG_GROUP = int(os.getenv('TG_GROUP')) or None

app = FastAPI()
bot = telegram.Bot(TG_TOKEN)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/notify_auftrag")
async def onAuftrag():
    bot.send_message(text="Neue Anfrage über das Ausleihformular!", chat_id=TG_GROUP)
    return {"message": "done"}

@app.post("/docify")
async def docify(angebot: Angebot):
    thema:str = angebot.organisation if angebot.organisation != "" else angebot.vertreter_nname
    doc = Docifyer(name='angebot', data=angebot.dict())
    doc.run()
    doc.save(thema=thema)
    return angebot

