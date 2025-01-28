class User:
    id : int
    email : str
    password : str
    role : str

    def __init__(self, user_id, email, password, role):
        self.id = user_id
        self.email = email
        self.password = password
        self.role = role

