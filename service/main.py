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