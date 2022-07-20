FROM python:3.10
WORKDIR /code
COPY . /code
RUN pip install pipenv
RUN pipenv install
CMD ["pipenv","run","uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]