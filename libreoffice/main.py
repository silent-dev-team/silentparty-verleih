from fastapi import FastAPI, UploadFile, logger, Response
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from starlette.background import BackgroundTasks
from dataclasses import dataclass
import subprocess, os
from datetime import datetime

app = FastAPI()

FOLDER = "./temp/"

@app.get("/")
async def root():
  return {"message": "Hello World"}

@app.post("/uploadfile", response_class=FileResponse)
async def create_upload_file(file: UploadFile, bg_tasks: BackgroundTasks): 
  try:
    name, ex = file.filename.split('.')
  except ValueError:
    return Response('not a convertable file', status_code=400)
  
  source_path = f'{FOLDER}{name}.{ex}'
  target_path = f'{FOLDER}{name}.pdf'

  with open(f'{FOLDER}{name}.{ex}', "wb") as buffer:
    buffer.write(file.file.read())

  proc = subprocess.run(["libreoffice","--headless","--convert-to","pdf",source_path,"--outdir",FOLDER+'pdf/'],capture_output=True)
  logger.logger.log(0,proc.stderr)
  
  bg_tasks.add_task(os.remove, source_path)
  bg_tasks.add_task(os.remove, target_path)
  return FileResponse(target_path, background=bg_tasks)