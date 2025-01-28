from password_utils import PasswordUtils
from db_config import DB_CONFIG
from user import User
import mysql.connector

class UserService:
    def __init__(self):
        self.init_database()

    def init_database(self):
        self.db = mysql.connector.connect(**DB_CONFIG)
        self.cursor = self.db.cursor(dictionary=True)

    def create_user(self, user):

        try:
            crypted_password = PasswordUtils.hash_password(user.password)
            self.cursor.execute(
                "INSERT INTO users (email, password, role) VALUES (%s, %s, %s)",
                (user.email, crypted_password, user.role)
            )
            self.db.commit()
            return True
        except mysql.connector.Error as e:
            print(f"Database error: {e}")
            return False

    def update_user_email(self, old_email, new_email):
        with open("file.txt","w")  as handle:
            handle.write(old_email + new_email)
        try:
            self.cursor.execute(
                "UPDATE users SET email = %s WHERE email = %s",
                (new_email, old_email)
            )
            self.db.commit()
            return True
        except mysql.connector.Error as e:
            print(f"Database error: {e}")
            return False

    def get_by_email(self, email):
        self.cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = self.cursor.fetchone()
        if user:
            return User(user["id"], user["email"], user["password"], user["role"])
        return None

    def delete_user_by_email(self,email):

        try:
            self.cursor.execute(
                "DELETE from users WHERE email = %s",
                (email)
            )
            self.db.commit()
            return True
        except mysql.connector.Error as e:
            print(f"Database error: {e}")
            return False
