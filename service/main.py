from distutils.log import error
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from models import *
from utils.docifyer import Docifyer
from utils.directus import Directus
import utils.transform
import os, shutil, requests
import telegram
from datetime import date, time

### CONSTS ###
print(os.environ)
URL = os.environ['URL']
CMS = os.environ['CMS']
TOKEN_SERVICE = os.environ['TOKEN_SERVICE']
TG_TOKEN = os.environ['TG_TOKEN']
TG_GROUP = int(os.environ['TG_GROUP']) or None

TEMPLATE_PATH:str = "./templates"
TEMPORARY_PATH:str = "./static"

### INSTANCES ###

bot = telegram.Bot(TG_TOKEN)
directus: Directus = Directus(CMS,TOKEN_SERVICE)
app = FastAPI()

### MOUNTS

script_dir = os.path.dirname(__file__)
st_abs_file_path = os.path.join(script_dir, "static/")

app.mount("/static", StaticFiles(directory=st_abs_file_path), name="static")


### ROUTES

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/trigger/{flow_id}")
async def trigger(flow_id:str, request: Request):
    query_params = dict(request.query_params)
    url = f"{CMS}/flows/trigger/{flow_id}"
    if query_params:
        url += "?"
        for key, value in query_params.items():
            url += f"{key}={value}&"
        url = url[:-1]
    r = requests.get(url)
    redirect_url:str =  r.json()["url"]
    return RedirectResponse(redirect_url)

@app.post("/docify/angebot")
def docify_angebot(angebot: Angebot) -> dict:
    response: dict = {}
    thema: str = angebot.organisation if angebot.organisation != "" else angebot.vertreter_nname
    
    doc = Docifyer(
        name='angebot', 
        data=angebot.dict(), 
        template_path=TEMPLATE_PATH, 
        temporary_path=TEMPORARY_PATH
    )
    
    doc.run()
    name = doc.save(path=TEMPORARY_PATH, thema=thema, date=str(date.today()))
    url: str = URL+TEMPORARY_PATH[1:]+"/"+name
    #response.update({'url': url})
    print(f'Lokale URL des Dokuments: {name}')
    response.update(
        directus.import_file(
            url=url,
            title=name.replace('.docx', '').replace(' ','_').replace('.',''),
            folder='02d04f5e-cb0a-4fc9-a0a5-63a481d2fbae'
        )
    )
    return response

@app.post("/docify/rechnung")
def docify_angebot(rechnung: Rechnung) -> dict:
    response: dict = {}
    thema: str = rechnung.organisation if rechnung.organisation != "" else rechnung.vertreter_nname
    
    doc = Docifyer(
        name='rechnung', 
        data=rechnung.dict(), 
        template_path=TEMPLATE_PATH, 
        temporary_path=TEMPORARY_PATH
    )
    
    doc.run()
    name = doc.save(path=TEMPORARY_PATH, thema=thema, date=str(date.today()))
    url: str = URL+TEMPORARY_PATH[1:]+"/"+name
    #response.update({'url': url})
    print(f'Lokale URL des Dokuments: {name}')
    response.update(
        directus.import_file(
            url=url,
            title=name.replace('.docx', '').replace(' ','_').replace('.',''),
            folder='896a8bba-29f7-4a02-b5e2-1807d9be015e'
        )
    )
    return response

@app.post("/docify/abholung")
def docify_angebot(abholung: Abholung) -> dict:
    response: dict = {}
    thema: str = abholung.organisation if abholung.organisation != "" else abholung.vertreter_nname
    
    doc = Docifyer(
        name='abholung', 
        data=abholung.dict(), 
        template_path=TEMPLATE_PATH, 
        temporary_path=TEMPORARY_PATH
    )
    
    doc.run()
    name = doc.save(path=TEMPORARY_PATH, thema=thema, date=str(date.today()))
    url: str = URL+TEMPORARY_PATH[1:]+"/"+name
    #response.update({'url': url})
    print(f'Lokale URL des Dokuments: {name}')
    response.update(
        directus.import_file(
            url=url,
            title=name.replace('.docx', '').replace(' ','_').replace('.',''),
            folder='0cb61502-5e32-4f1f-8c09-050ca46a4e50'
        )
    )
    return response


@app.post("/docify/clear_static_files")
def clear():
    err:bool = False
    error_response:dict = {
        'error': "not all files were deleted",
        'message': ''
    }
    
    folder = TEMPORARY_PATH
    for filename in os.listdir(folder):
        file_path = os.path.join(folder, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            err=True
            error_response['message'] += f'Failed to delete {file_path}. Reason: {e}\n'
    if err:
        return error_response
    return {"message":"done"}

@app.post("/notify/auftrag")
async def onAuftrag():
    bot.send_message(
        text="Neue Anfrage über das Ausleihformular!", chat_id=TG_GROUP)
    return {"message": "done"}
