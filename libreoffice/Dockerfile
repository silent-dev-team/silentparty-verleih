FROM fedora:38
RUN dnf update -y
RUN dnf install -y libreoffice-headless python3
WORKDIR /api
RUN mkdir /temp
COPY . /api
RUN pip install pipenv
RUN pipenv install
CMD ["pipenv","run","uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"]