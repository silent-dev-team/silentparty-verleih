import logging
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from models import *
from objects.docifyer import Docifyer
import requests, os, telegram, json
from datetime import date, time

URL = os.environ['URL']
CMS = os.environ['CMS']
TG_TOKEN = os.environ['TG_TOKEN']
TG_GROUP = int(os.environ['TG_GROUP']) or None

bot = telegram.Bot(TG_TOKEN)
app = FastAPI()

script_dir = os.path.dirname(__file__)
st_abs_file_path = os.path.join(script_dir, "static/")
app.mount("/static", StaticFiles(directory=st_abs_file_path), name="static")

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/docify/angebot")
async def docify(angebot: Angebot):
    response:dict = {}
    thema:str = angebot.organisation if angebot.organisation != "" else angebot.vertreter_nname
    doc = Docifyer(name='angebot', data=angebot.dict())
    print("start parsing")
    doc.run()
    print("finish parsing")
    print("start saving")
    name = doc.save(path='./static',thema=thema, date=str(date.today()))
    print("saved")
    
    url:str = URL+"/static/"+name
    response.update({'url':url})
    
    print(f'temp-url: {url}')
    print(f'calling Directus')
    
    r = requests.post(
        url = CMS + '/files/import',
        json = {'url': url}
    )
    
    try:
        response.update(r.json())
        print(response)
    except:
        print(f'no response from directus')
    
    print(f'called Directus')
    return response

@app.post("/notify/auftrag")
async def onAuftrag():
    bot.send_message(text="Neue Anfrage über das Ausleihformular!", chat_id=TG_GROUP)
    return {"message": "done"}