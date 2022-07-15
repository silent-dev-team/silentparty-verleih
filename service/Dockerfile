FROM python:3.10
WORKDIR /app
COPY ./api /app
RUN pip install pipenv
RUN pipenv install
CMD ["pipenv","run","uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]