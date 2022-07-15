FROM python:3.10
WORKDIR /code
COPY ./app /code/app
RUN pip install pipenv
RUN pipenv install
CMD ["pipenv","run","uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]