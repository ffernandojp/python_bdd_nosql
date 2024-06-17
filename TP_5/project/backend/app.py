import datetime
import os

from flask import Flask, Response, request, render_template, redirect, url_for, jsonify
from flask_cors import CORS, cross_origin

# from flask_mongoengine import MongoEngine
from pymongo import MongoClient
from bson import json_util

import json


app = Flask(__name__)
CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"
# app.config['MONGODB_SETTINGS'] = {
#     'host': os.environ['MONGODB_HOST'],
#     'username': os.environ['MONGODB_USERNAME'],
#     'password': os.environ['MONGODB_PASSWORD'],
#     'db': 'webapp'
# }

# db = MongoEngine()
# db.init_app(app)


def connection():
    try:
        client = MongoClient(
            f"mongodb://{os.environ['MONGODB_USERNAME']}:{os.environ['MONGODB_PASSWORD']}@{os.environ['MONGODB_HOST']}/webapp"
        )

        db = client["webapp"]
        print("Successfully connected to MongoDB")
        return db
    except Exception as e:
        print(f"Could not connect to MongoDB: {e}")


# def connection_as_admin():
#     try:
#         client = MongoClient(
#             f"mongodb://admin:mongospa@{os.environ['MONGODB_HOST']}/admin"
#         )

#         db = client["webapp"]
#         print("Successfully connected to MongoDB")
#         return db
#     except Exception as e:
#         print(f"Could not connect to MongoDB: {e}")


# class Todo(db.Document):
#     title = db.StringField(max_length=60)
#     text = db.StringField()
#     done = db.BooleanField(default=False)
#     pub_date = db.DateTimeField(default=datetime.datetime.now)

# @app.route("/api")
# def index():
#     Todo.objects().delete()
#     Todo(title="Simple todo A", text="12345678910").save()
#     Todo(title="Simple todo B", text="12345678910").save()
#     Todo.objects(title__contains="B").update(set__text="Hello world")
#     todos = Todo.objects().to_json()
#     return Response(todos, mimetype="application/json", status=200)


@app.route("/api/uploadData", methods=["GET"])
def upload_data():
    status = upload_heroes()
    return {"message": status}


def upload_heroes():
    with open("bd_scripts/characters.json") as f:
        characters_data = json.load(f)
        try:
            connection().superheroes.insert_many(characters_data)
            message = True
        except Exception as e:
            message = False
    return message


def get_heroes_img():
    # folder_path = "../bd_scripts/characters_pictures/images/Marvel"
    script_dir = os.path.dirname(__file__)
    content = os.listdir(script_dir)
    # print(content)
    bd_scripts_dir = os.path.join(script_dir, "bd_scripts")
    characters_pictures = os.path.join(bd_scripts_dir, "characters_pictures")
    images = os.path.join(characters_pictures, "images")
    marvel = os.path.join(images, "Marvel")
    dc_comics = os.path.join(images, "DC_Comics")

    if os.path.exists(images):
        if os.path.isdir(images):
            files = os.listdir(marvel)
            for file in files:
                file_name = file.replace("Marvel-", "").replace("-square.png", "")
                print("marvel", file)

            files = os.listdir(dc_comics)
            for file in files:
                file_name = file.replace("DC_Comics-", "").replace("-square.png", "")
                print("dc_comics", file)
        else:
            print(f"The path '{folder_path}' exists but is not a directory.")
    else:
        print(f"The directory '{folder_path}' does not exist.")
    return


# def upload_heroes(heroes=None):
#     get_heroes_img()
#     return


def get_imgs():
    script_dir = os.path.dirname(__file__)
    bd_scripts_dir = os.path.join(script_dir, "bd_scripts")
    characters_pictures = os.path.join(bd_scripts_dir, "characters_pictures")
    images = os.path.join(characters_pictures, "images")
    marvel = os.path.join(images, "Marvel")
    dc_comics = os.path.join(images, "DC_Comics")

    if os.path.exists(images):
        if os.path.isdir(images):
            files = os.listdir(marvel)
            images_marvel = [i for i in files]
            files = os.listdir(dc_comics)
            images_dc_comics = [i for i in files]
            files = {"Marvel": images_marvel, "DC": images_dc_comics}
        else:
            print(f"The path '{folder_path}' exists but is not a directory.")
    else:
        print(f"The directory '{folder_path}' does not exist.")
    return files


#! ESTO NO VA AL PARECER (BORRAR CUANDO ESTE TERMINADO EL PROYECTO)
def modify_img_json():
    images = get_imgs()

    for key, value in images.items():
        print(key, value)

    marvel_images = images["Marvel"]
    dc_images = images["DC"]

    characters = connection().superheroes.find()
    characters = list(characters)
    for character in characters:
        character_name = character["name"].replace(" ", "-")
        character["images"] = []
        if character["house"] == "Marvel":
            images = marvel_images
        elif character["house"] == "DC":
            images = dc_images
        for img_name in images:
            if img_name in character_name:
                character["images"].append(img_name)

    print(characters)
    return


@app.route("/api/superheroes/house", methods=["POST", "GET"])
def get_superheroes_by_house():
    try:
        data = request.get_json()
        house = data["data"]
        heroes = connection().superheroes.find({"house": house})
        heroes = list(heroes)
        return json_util.dumps(heroes, indent=4)
    except Exception as e:
        print(e)
        return jsonify({"message": "Error getting superheroes: " + str(e)})


@app.route("/api/superheroes/name", methods=["POST", "GET"])
def get_superheroes_by_name():
    try:
        data = request.get_json()
        print(data, "data")
        name = data["data"]["name"]
        house = data["data"]["house"]
        print(name, house)
        if house != "" and name != "":
            heroes = connection().superheroes.find(
                {
                    "name": {"$regex": "(?i).*" + name + ".*", "$options": "i"},
                    "house": house,
                }
            )
        elif house == "" and name != "":
            heroes = connection().superheroes.find(
                {"name": {"$regex": "(?i).*" + name + ".*", "$options": "i"}}
            )
        elif house != "" and name == "":
            heroes = connection().superheroes.find({"house": house})

        heroes = list(heroes)
        return json_util.dumps(heroes, indent=4)
    except Exception as e:
        print(e)
        return jsonify({"message": "Error getting superheroes: " + str(e)})


@app.route("/api/superheroes", methods=["POST", "GET"])
def get_superheroes():
    try:
        heroes = connection().superheroes.find()
        heroes = list(heroes)
        return json_util.dumps(heroes, indent=4)
    except Exception as e:
        print(e)
        return jsonify({"message": "Error getting superheroes: " + str(e)})


@app.route("/api/superheroe", methods=["POST", "GET"])
def get_superheroe():
    try:
        data = request.get_json()
        name = data["data"]
        heroes = connection().superheroes.find({"name": name})
        heroes = list(heroes)
        return json_util.dumps(heroes, indent=4)
    except Exception as e:
        print(e)
        return jsonify({"message": "Error getting superhero: " + str(e)})


@app.route("/api/superheroes/update", methods=["POST", "GET"])
def update_heroe():
    data = request.get_json()
    for obj in data["data"]:
        if (type(data["data"][obj])) == str:
            if data["data"][obj] == "":
                data["data"][obj] = "None"
    if (type(data["data"]["equipment"])) == str:
        if data["data"]["equipment"] != "None":
            data["data"]["equipment"] = data["data"]["equipment"].split(",")
    if (type(data["data"]["images"])) == str:
        if data["data"]["images"] != "None":
            data["data"]["images"] = data["data"]["images"].split(",")
    try:
        connection().superheroes.update_one(
            {"name": data["data"]["name"]}, {"$set": data["data"]}
        )
        return jsonify({"message": "Superhero updated successfully"})
        # return "OK"
    except Exception as e:
        print(e)
        return jsonify({"message": "Error updating superhero: " + str(e)})
        # return "ERROR"


@app.route("/api/superheroes/delete", methods=["POST", "GET", "DELETE"])
def delete_heroe():
    try:
        data = request.get_json()
        name = data["name"]
        connection().superheroes.delete_one({"name": name})
        return jsonify({"message": "Superhero deleted successfully"})
    except Exception as e:
        print(e)
        return jsonify({"message": "Error deleting superhero: " + str(e)})


@app.route("/api/superheroes/add", methods=["POST", "GET"])
def add_heroe():
    data = request.get_json()
    for obj in data["data"]:
        if (type(data["data"][obj])) == str:
            if data["data"][obj] == "":
                data["data"][obj] = "None"
    if (type(data["data"]["equipment"])) == str:
        if data["data"]["equipment"] != "None":
            data["data"]["equipment"] = data["data"]["equipment"].split(",")
    if (type(data["data"]["images"])) == str:
        if data["data"]["images"] != "None":
            data["data"]["images"] = data["data"]["images"].split(",")
    try:
        connection().superheroes.insert_one(data["data"])
        return jsonify({"message": "Superhero added successfully"})
    except Exception as e:
        print(e)
        return jsonify({"message": "Error adding superhero: " + str(e)})


@app.route("/upload_json", methods=["POST"])
def upload_json():
    with open("bd_scripts/characters.json") as f:
        data = json.load(f)
        connection().superheroes.insert_many(data)
    return redirect(url_for("index"))


@app.route("/", methods=["GET"])
def index():
    heroes = connection().superheroes.find()
    heroes = list(heroes)

    if not heroes:
        upload_json()
        heroes = connection().superheroes.find()
        heroes = list(heroes)
        heroes_json = json_util.dumps(heroes, indent=4)
    else:
        heroes = list(heroes)
        heroes_json = json_util.dumps(heroes, indent=4)
    # print(modify_img_json())
    # for doc in heroes:
    #     print(doc, end="\n\n")
    # upload_heroes(heroes)
    return heroes_json

    # return render_template("index.html", heroes=heroes_json)


if __name__ == "__main__":
    app.run(debug=True, port=5000, host="api")
