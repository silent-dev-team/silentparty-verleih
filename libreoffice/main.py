from fastapi import FastAPI, UploadFile
from fastapi.staticfiles import StaticFiles
import subprocess

app = FastAPI()

FOLDER = "./temp/"

@app.get("/")
async def root():
  return {"message": "Hello World"}

@app.get("/ls")
async def ls():
  proc = subprocess.run(["ls"],capture_output=True)
  return {"message": proc.stdout.decode("utf-8")}

@app.post("/uploadfile")
async def create_upload_file(file: UploadFile):
  with open(FOLDER+file.filename.strip().replace(' ','_'), "wb") as buffer:
    buffer.write(file.file.read())
  return {"filename": file.filename}