FROM python:3.10

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip && pip install --no-cache-dir -r requirements.txt

COPY . /app

RUN python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. proto/idm.proto

RUN rm -rf data && mkdir -p data && chmod -R 777 data

EXPOSE 8000

CMD ["sh", "-c", "rm -rf data && mkdir -p data && chmod -R 777 data && uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload"]
