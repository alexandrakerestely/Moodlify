from fastapi import Request, HTTPException, status
from src.security import GRPCServiceClient


def check_token(request: Request):

    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authorization token missing")

    token = auth_header.split(" ")[1]
    grpc_client = GRPCServiceClient.GRPCServiceClient()
    valid, _, _ = grpc_client.check_token(token)

    if not valid:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

    return {"token_valid": True}