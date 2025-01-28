import jwt
import datetime
import uuid

from db_config import SECRET_KEY


class TokenService:
    def __init__(self):
        self.token_blacklist = set()

    def generate_token(self, user):
        payload = {
            "iss": "gRPC-IDM-Service",
            "sub": user.email,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1),
            "jti": str(uuid.uuid4()),
            "role": user.role
        }
        return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

    def check_token(self, token):
        if token in self.token_blacklist:
            return False, None, None

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

            email = payload.get("sub")
            role = payload.get("role")

            if not email or not role:
                return False, None, None

            return True, email, role
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, KeyError) as e:
            print(f"Token decoding error: {e}")
            return False, None, None

    def destroy_token(self, token):
        if token in self.token_blacklist:
            return False

        self.token_blacklist.add(token)
        return True