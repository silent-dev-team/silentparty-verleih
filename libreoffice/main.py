import logging
from fastapi import FastAPI, UploadFile, Response
from fastapi.responses import FileResponse
from starlette.background import BackgroundTasks
import subprocess, os

FOLDER = "./temp/"

logger = logging.getLogger(__name__)

app = FastAPI()

@app.get("/")
async def root():
  return {"message": "Hello World"}

@app.post("/convert-to-pdf", response_class=FileResponse)
async def create_upload_file(file: UploadFile, bg_tasks: BackgroundTasks): 
  try:
    name, ex = file.filename.split('.')
  except ValueError:
    return Response('not a convertable file', status_code=400)
  
  source_path = f'{FOLDER}{name}.{ex}'
  target_path = f'{FOLDER}{name}.pdf'

  with open(source_path, "wb") as buffer:
    buffer.write(file.file.read())

  proc = subprocess.run(["libreoffice","--headless","--convert-to","pdf",source_path,"--outdir",FOLDER],capture_output=True)
  logger.info(proc.stdout)
  logger.error(proc.stderr)
  
  bg_tasks.add_task(os.remove, source_path)
  bg_tasks.add_task(os.remove, target_path)
  return FileResponse(target_path, background=bg_tasks)