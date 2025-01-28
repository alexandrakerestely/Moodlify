import grpc
from concurrent import futures
import idm_pb2
import idm_pb2_grpc
from password_utils import PasswordUtils
from token_service import TokenService
from user import User
from user_service import UserService

class AuthServiceServicer(idm_pb2_grpc.AuthServiceServicer):
    def __init__(self):
        self.user_service = UserService()
        self.token_service = TokenService()

    def RegisterUser(self, request, context):

        is_valid, email, role = self.token_service.check_token(request.admin_token)

        if not is_valid or role != "admin":
            return idm_pb2.RegisterResponse(success=False)

        try:
            user = User(0, request.email, request.password, request.role)
            result = self.user_service.create_user(user)

            return idm_pb2.RegisterResponse(success=result)
        except Exception as e:
            return idm_pb2.RegisterResponse(success=False)

    def LoginUser(self, request, context):
        user = self.user_service.get_by_email(request.email)
        if user and PasswordUtils.check_password(request.password, user.password):
            token = self.token_service.generate_token(user)
            return idm_pb2.LoginResponse(success=True, token=token)
        return idm_pb2.LoginResponse(success=False, token="")

    def CheckToken(self, request, context):
        is_valid, email, role = self.token_service.check_token(request.token)
        if is_valid is False:
            email = ""
            role = ""
        return idm_pb2.CheckTokenResponse(valid=is_valid, email=email, role=role)

    def DestroyToken(self, request, context):
        result = self.token_service.destroy_token(request.token)
        return idm_pb2.DestroyTokenResponse(success=result)

    def UpdateUser(self, request, context):
        result = self.user_service.update_user_email(request.old_email, request.new_email)
        return idm_pb2.UpdateResponse(success=result)

    def DeleteUser(self, request, context):
        result = self.user_service.delete_user_by_email(request.email)
        return idm_pb2.DeleteResponse(success=result)

server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
idm_pb2_grpc.add_AuthServiceServicer_to_server(AuthServiceServicer(), server)
server.add_insecure_port("[::]:50051")
server.start()
print("gRPC AuthService running on port 50051")
server.wait_for_termination()