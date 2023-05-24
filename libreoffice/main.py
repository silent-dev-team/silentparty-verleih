import logging
from fastapi import FastAPI, UploadFile, Response
from fastapi.responses import FileResponse, RedirectResponse
from starlette.background import BackgroundTasks
import subprocess, os
from typing import Literal

FOLDER = "./temp/"
formats = Literal['pdf','docx','doc','odt','ott','html','epub','xlsx','xls','ods','csv']

logger = logging.getLogger(__name__)

app = FastAPI()

@app.get("/", include_in_schema=False)
async def docs_redirect():
    return RedirectResponse(url='/docs')

@app.post("/convert-to", response_class=FileResponse)
async def create_upload_file(file: UploadFile,bg_tasks: BackgroundTasks,format:formats = 'pdf'): 
  """Converts a file to a specified format \n

  Args:
      file (document): Document for conversion |
      format (string, optional): target format. Defaults to 'pdf'.

  Returns:
      binary string: file in target format
  """
  try:
    name, ex = file.filename.split('.')
  except ValueError:
    return Response('not a convertable file', status_code=400)
  
  source_path = f'{FOLDER}{name}.{ex}'
  target_path = f'{FOLDER}{name}.{format}'

  with open(source_path, "wb") as buffer:
    buffer.write(file.file.read())

  proc = subprocess.run(["libreoffice","--headless","--convert-to",format,source_path,"--outdir",FOLDER],capture_output=True)
  logger.info(proc.stdout)
  logger.error(proc.stderr)
  
  bg_tasks.add_task(os.remove, source_path)
  bg_tasks.add_task(os.remove, target_path)
  return FileResponse(target_path, background=bg_tasks)