from distutils.log import error
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from models import *
from utils.docifyer import Docifyer
from utils.directus import Directus
import utils.transform
import os, shutil
import telegram
from datetime import date, time

### CONSTS ###

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

@app.post("/docify/angebot")
def docify_angebot(angebot: Angebot) -> dict:
    response: dict = {}
    thema: str = angebot.organisation if angebot.organisation != "" else angebot.vertreter_nname
    doc = Docifyer(name='angebot', data=angebot.dict(), template_path=TEMPLATE_PATH, temporary_path=TEMPORARY_PATH)
    doc.run()
    name = doc.save(path=TEMPORARY_PATH, thema=thema, date=str(date.today()))
    url: str = URL+TEMPORARY_PATH[:2]+"/"+name
    #response.update({'url': url})
    response.update(
        directus.import_file(
            url=url,
            title=name.replace('.docx', '').replace(' ','_').replace('.',''),
            folder='02d04f5e-cb0a-4fc9-a0a5-63a481d2fbae'
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

#@app.post("/notify/auftrag")
#async def onAuftrag():
#    bot.send_message(
#        text="Neue Anfrage über das Ausleihformular!", chat_id=TG_GROUP)
#    return {"message": "done"}
