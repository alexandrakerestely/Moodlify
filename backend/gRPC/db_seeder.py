import mysql.connector

from password_utils import PasswordUtils
from db_config import DB_CONFIG

def seed():

    db = mysql.connector.connect(**DB_CONFIG)
    cursor = db.cursor()

    print("Starting Python gRPC Seeder...")

    cursor.execute("SELECT * FROM users WHERE email='admin@example.com'")
    if cursor.fetchone():
        print("Admin user already exists. Skipping seed.")
    else:
        admin_user = ("admin@example.com",PasswordUtils.hash_password("admin123"), "admin")
        cursor.execute("INSERT INTO users (email, password, role) VALUES (%s, %s, %s)", admin_user)
        
        teachers = [
            ("ion.popescu@example.com", PasswordUtils.hash_password("teacher123"), "teacher"),
            ("maria.ionescu@example.com", PasswordUtils.hash_password("teacher123"), "teacher"),
            ("ana.georgescu@example.com", PasswordUtils.hash_password("teacher123"), "teacher")
        ]

        for email, password, role in teachers:
            cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
            if cursor.fetchone():
                print(f"Teacher {email} already exists. Skipping.")
            else:
                cursor.execute("INSERT INTO users (email, password, role) VALUES (%s, %s, %s)", (email, password, role))
                print(f"Teacher {email} created successfully.")

        students = [
            ("ion.popescu@example.com", PasswordUtils.hash_password("student123"), "student"),
            ("maria.ionescu@example.com", PasswordUtils.hash_password("student123"), "student"),
            ("andrei.georgescu@example.com", PasswordUtils.hash_password("student123"), "student"),
            ("elena.dumitrescu@example.com", PasswordUtils.hash_password("student123"), "student")
        ]

        for email, password, role in students:
            cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
            if cursor.fetchone():
                print(f"Student {email} already exists. Skipping.")
            else:
                cursor.execute("INSERT INTO users (email, password, role) VALUES (%s, %s, %s)", (email, password, role))
                print(f"Student {email} created successfully.")

        db.commit()

    cursor.close()
    db.close()

    print("Seeding completed successfully!")

if __name__ == "__main__":
    seed()
