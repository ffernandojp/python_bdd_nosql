from pymongo import MongoClient


def connection_as_admin():
    admin_username = "admin"
    admin_password = "mongospa"
    database = "webapp"
    username = "apiuser"
    password = "apipassword"
    try:
        client = MongoClient("mongodb://admin:mongospa@mongodb/admin")
        print(client)

        db = client[database]
        # if not db.user_exists(username):
        db.command(
            "createUser",
            username,
            pwd=password,
            roles=[{"role": "readWrite", "db": database}],
        )

        print("Successfully connected to MongoDB")
        return db

    except Exception as e:
        print(f"Could not connect to MongoDB: {e}")


connection_as_admin = connection_as_admin()
