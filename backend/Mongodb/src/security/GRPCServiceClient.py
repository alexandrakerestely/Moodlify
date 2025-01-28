import grpc

import idm_pb2
import idm_pb2_grpc

class GRPCServiceClient:
    def __init__(self, server_address="idm-service:50051"):
        self.channel = grpc.insecure_channel(server_address)
        self.stub = idm_pb2_grpc.AuthServiceStub(self.channel)

    def check_token(self, token):
        request = idm_pb2.CheckTokenRequest(token=token)
        response = self.stub.CheckToken(request)
        return response.valid, response.email, response.role

