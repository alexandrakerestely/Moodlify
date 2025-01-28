FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip && pip install --no-cache-dir -r requirements.txt

COPY . /app

RUN python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. idm.proto

EXPOSE 50051

RUN chmod +x start_app.sh

ENTRYPOINT ["/bin/bash", "/app/start_app.sh"]
