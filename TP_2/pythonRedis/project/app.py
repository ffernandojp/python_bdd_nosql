from flask import Flask, render_template, request, redirect, url_for
from redis import Redis
import json

app = Flask(__name__, template_folder="./templates")
# redis = Redis(host="redis", port=6379)
# r = Redis(host="localhost", port=6379, decode_responses=True)

# TODO: PRUEBA REDIS
# print(r.set("foo", "bar"))
# True
# print(r.get("foo"))
# bar


def connect_db():
    print("Connecting to DB")
    conexion = Redis(host="localhost", port=6379, decode_responses=True, db=1)
    if conexion.ping():
        print("DB Connected")
    else:
        print("Error connecting to DB")

    return conexion


def get_personajes(db, list_name):
    lista = db.hgetall(list_name)

    return lista


def get_episode(db, list_name, person):
    episode = db.hget(list_name, person)
    return episode


def set_personajes(db, list_name, person, episode):
    db.hset(list_name, person, episode)

    return True


def delete_personaje(db, list_name, person):
    db.hdel(list_name, person)

    return True


@app.route("/", methods=["GET"])
def index():
    lista = get_personajes(connect_db(), "lista_personajes")
    lista_filtrada = filtrar_personajes_episodios(
        connect_db(), "lista_personajes", "26"
    )
    lista_personajes = (
        "<ul style='list-style-type: none;'>"
        + "".join(
            f"<li style='margin-bottom: 2px;'><form action='/eliminarPersonaje' method='POST'><input type='hidden' name='personaje' value={item}> Nombre: {item}, episodios: {get_episode(connect_db(), 'lista_personajes', item)}<button class='btn-delete' type='submit'>Eliminar</button></form></li>"
            for item in lista
        )
        + "</ul>"
    )

    episodios_array = []
    episodios_filtered = []
    for item in lista:
        if (
            get_episode(connect_db(), "lista_personajes", item)
            not in episodios_filtered
        ):
            episodios_filtered.append(
                get_episode(connect_db(), "lista_personajes", item)
            )

    numbers = [int(value) for value in episodios_filtered]

    episodios_array = sorted(numbers)

    episodios = (
        "<select name='episodes' id='episodes'>"
        + "<option value=0>0</option>"
        + "".join(f"<option value={item}>{item}</option>" for item in episodios_array)
        + "</select>"
    )

    lista_por_episodios = (
        "<ul style='list-style-type: none;'>"
        + "".join(
            f"<li style='margin-bottom: 2px;'>Nombre: {item}, episodios: {get_episode(connect_db(), 'lista_personajes', item)}</li>"
            for item in lista_filtrada
        )
        + "</ul>"
    )

    return render_template("index.html", list=lista_personajes, episodes=episodios)


def filtrar_personajes_episodios(db, list_name, episodios):
    lista = db.hgetall(list_name)
    filtrado_personajes_episodios = []
    for item in lista:
        if get_episode(connect_db(), "lista_personajes", item) == episodios:
            filtrado_personajes_episodios.append(item)
    return filtrado_personajes_episodios


@app.route("/listarEpisodios", methods=["POST"])
def listarEpisodios():
    episodios = request.form["episodes"]
    personajes_filtrados = filtrar_personajes_episodios(
        connect_db(), "lista_personajes", episodios
    )
    lista_personajes_episodios = (
        "<ul>"
        + "".join(
            f"<li style='margin-bottom: 2px;'>{item}</li>"
            for item in personajes_filtrados
        )
        + "</ul>"
    )

    return render_template(
        "listarEpisodios.html",
        episodes=episodios,
        list_by_episodes=lista_personajes_episodios,
    )


@app.route("/agregarPersonaje", methods=["POST"])
def agregarPersonaje():
    nombre = request.form["nombre"]
    episodios = request.form["episodios"]
    set_personajes(connect_db(), "lista_personajes", nombre, episodios)
    return redirect(url_for("index"))


@app.route("/eliminarPersonaje", methods=["POST"])
def eliminarPersonaje():
    personaje = request.form["personaje"]
    delete_personaje(connect_db(), "lista_personajes", personaje)
    return redirect(url_for("index"))


@app.route("/redis/get")
def getData():
    return r.get("foo")


if __name__ == "__main__":
    app.run(debug=True)
