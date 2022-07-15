from fastapi import FastAPI
from models import *
from objects.docifyer import Docifyer

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/docify")
async def docify(angebot: Angebot):
    thema:str = angebot.organisation if angebot.organisation != "" else angebot.vertreter_nname
    doc = Docifyer(name='angebot', data=angebot.dict())
    doc.run()
    doc.save(thema=thema)
    return angebot

