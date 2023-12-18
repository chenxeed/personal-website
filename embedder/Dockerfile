FROM python:3.9

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt
RUN pip install chromadb

COPY . .
RUN chmod +x ./start.sh
CMD ./start.sh
