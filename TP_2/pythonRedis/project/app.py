from flask import Flask, render_template, request, redirect, url_for
from redis import Redis
import json

app = Flask(__name__, template_folder="./templates")


def connect_db():
    print("Connecting to DB")
    # conexion = Redis(host="localhost", port=6379, decode_responses=True, db=1)
    conexion = Redis(host="db-redis", port=6379, decode_responses=True, db=1)

    if conexion.ping():
        print("DB Connected")
    else:
        print("Error connecting to DB")

    return conexion


def get_personajes(db, list_name):
    lista = db.hgetall(list_name)
    return lista


def get_episode_character(db, list_name, person):
    episode = db.hget(list_name, person)
    return episode


def set_personajes(db, list_name, person, episode):
    db.hset(list_name, person, episode)
    return True


def delete_personaje(db, list_name, person):
    db.hdel(list_name, person)
    return True


# *** ALQUILER CAPITULOS THE_mandalorian ***


def get_mandalorian_episodes(db, list_name):
    lista = db.lrange(list_name, 0, -1)
    return lista


def get_episode_status(db, episode):
    status = db.get(episode)

    if status is None:
        status = "Disponible"
        db.set(episode, status)
    return status


def get_episode_position(db, list_name, episode):
    position = db.lpos(list_name, episode)
    return position


def get_episode_the_mandalorian(db, list_name, position):
    episode = db.lindex(list_name, position)
    return episode


def set_key_for_episode(db, episode, status):
    db.set(episode, status)
    return True


def set_expire_time_to_episode(db, episode, status):
    if status == "Reservado":
        db.set(episode, status)
        db.expire(episode, 240)

    if status == "Alquilado":
        db.set(episode, status)
        db.expire(episode, 86400)

    return True


def get_expire_time_episode(db, episode):
    return db.ttl(episode)


@app.route("/", methods=["GET"])
def index():
    lista = get_personajes(connect_db(), "lista_personajes")
    lista_filtrada = filtrar_personajes_episodios(
        connect_db(), "lista_personajes", "26"
    )
    lista_personajes = (
        "<ul style='list-style-type: none;'>"
        + "".join(
            f"<li style='margin-bottom: 2px;'><form action='/eliminarPersonaje' method='POST'><input type='hidden' name='personaje' value={item}> Nombre: {item}, episodios: {get_episode_character(connect_db(), 'lista_personajes', item)}<button class='btn-delete' type='submit'>Eliminar</button></form></li>"
            for item in lista
        )
        + "</ul>"
    )

    episodios_array = []
    episodios_filtered = []
    for item in lista:
        if (
            get_episode_character(connect_db(), "lista_personajes", item)
            not in episodios_filtered
        ):
            episodio = get_episode_character(connect_db(), "lista_personajes", item)
            if episodio.count(",") > 0:
                episodio = episodio.split(",")
            episodios_filtered.append(
                get_episode_character(connect_db(), "lista_personajes", item)
            )

    # Dividir la cadena por la coma solo si contiene comas
    split_array = [
        sub.split(",") if "," in sub else [sub] for sub in episodios_filtered
    ]
    # Concatenate the resulting array with the desired separator
    result = [value for sub in split_array for value in sub] + episodios_filtered[0:2]
    # Convert strings to integers and remove duplicates
    episodios_array = sorted(set(int(value) for value in result))

    episodios = (
        "<select name='episodes' id='episodes'>"
        + "<option value=0>0</option>"
        + "".join(f"<option value={item}>{item}</option>" for item in episodios_array)
        + "</select>"
    )

    lista_por_episodios = (
        "<ul style='list-style-type: none;'>"
        + "".join(
            f"<li style='margin-bottom: 2px;'>Nombre: {item}, episodios: {get_episode_character(connect_db(), 'lista_personajes', item)}</li>"
            for item in lista_filtrada
        )
        + "</ul>"
    )

    the_mandalorian_list = get_mandalorian_episodes(
        connect_db(), "the_mandalorian_episodes"
    )
    if len(the_mandalorian_list) == 0:
        buttonCargar = "<button type='submit' class='btn-submit'><a style='text-decoration: none; color: white;' href='/cargarEpisodios'>Cargar episodios</a></button>"
    else:
        buttonCargar = "<input type='hidden'>"
    lista_the_mandalorian = (
        "<ul style='list-style-type: none;'>"
        + "".join(
            f"<li style='margin-bottom: 2px;'><form action={'/episodioAlquilado' if get_episode_status(connect_db(), item.split(',')[0]) == 'Alquilado' else '/reservarEpisodio'} method='POST'><input type='hidden' name='episodio_position' value={get_episode_position(connect_db(), 'the_mandalorian_episodes', item)}>{item.split(',')[0]} ({get_episode_status(connect_db(), item.split(',')[0])})<button class='{'btn-pagar' if get_episode_status(connect_db(), item.split(',')[0]) == 'Reservado' else 'btn-alquilado' if get_episode_status(connect_db(), item.split(',')[0]) == 'Alquilado' else 'btn-reserva' }' type='submit'>{'Pagar Reserva'if get_episode_status(connect_db(), item.split(',')[0]) == 'Reservado' else 'Alquilado' if get_episode_status(connect_db(), item.split(',')[0]) == 'Alquilado' else 'Reservar'}</button></form></li>"
            for item in the_mandalorian_list
        )
        + "</ul>"
    )
    return render_template(
        "index.html",
        list=lista_personajes,
        episodes=episodios,
        list_mandalorian=lista_the_mandalorian,
        buttonCargar=buttonCargar,
    )


def filtrar_personajes_episodios(db, list_name, episodios):
    lista = db.hgetall(list_name)
    filtrado_personajes_episodios = []
    for item in lista:
        result = get_episode_character(connect_db(), "lista_personajes", item)
        result = result.split(",")
        if episodios in result:
            filtrado_personajes_episodios.append(item)
    return filtrado_personajes_episodios


@app.route("/listarEpisodiosPersonajes", methods=["POST"])
def listarEpisodiosPersonajes():
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
        "listarEpisodiosPersonajes.html",
        episodes=episodios,
        list_by_episodes=lista_personajes_episodios,
    )


def get_personaje(db, list_name, person):
    personaje = db.hget(list_name, person)
    return personaje


@app.route("/agregarPersonaje", methods=["POST"])
def agregarPersonaje():
    nombre = request.form["nombre"]
    episodios = request.form["episodios"]
    episodio_value = get_personaje(connect_db(), "lista_personajes", nombre)
    if episodio_value:
        if episodios not in episodio_value:
            set_personajes(
                connect_db(),
                "lista_personajes",
                nombre,
                episodio_value + "," + episodios,
            )
    else:
        set_personajes(connect_db(), "lista_personajes", nombre, episodios)
    return redirect(url_for("index"))


@app.route("/eliminarPersonaje", methods=["POST"])
def eliminarPersonaje():
    personaje = request.form["personaje"]
    delete_personaje(connect_db(), "lista_personajes", personaje)
    return redirect(url_for("index"))


# *** RESERVA DE EPISODIO ***


@app.route("/cargarEpisodios")
def cargarEpisodios():
    list_name = "the_mandalorian_episodes"
    data = [
        "Capitulo 1: The Mandalorian, 450",
        "Capitulo 2: The Child, 2132",
        "Capitulo 3: The Sin, 3400",
        "Capitulo 4: Sanctuary, 780",
        "Capitulo 5: The Gunslinger, 890",
        "Capitulo 6: The Prisoner, 987",
        "Capitulo 7: The Reckoning, 1035",
        "Capitulo 8: Redemption, 2750",
        "Capitulo 9: The Marshal, 1860",
        "Capitulo 10: The Passenger, 1200",
        "Capitulo 11: The Heiress, 3000",
        "Capitulo 12: The Siege, 2074",
        "Capitulo 13: The Jedi, 2300",
        "Capitulo 14: The Tragedy, 4350",
        "Capitulo 15: The Believer, 3025",
        "Capitulo 16: The Rescue, 1800",
    ]

    for item in data:
        connect_db().rpush(list_name, item)

    return redirect(url_for("index"))


@app.route("/reservarEpisodio", methods=["POST"])
def reservarEpisodio():
    episodio_position = request.form["episodio_position"]
    episodio = get_episode_the_mandalorian(
        connect_db(), "the_mandalorian_episodes", episodio_position
    )
    episodio_name = episodio.split(",")[0]
    episodio_price = int(episodio.split(",")[1])

    if get_expire_time_episode(connect_db(), episodio_name) < 0:
        set_expire_time_to_episode(connect_db(), episodio_name, "Reservado")

    expire_time = get_expire_time_episode(connect_db(), episodio_name)

    return render_template(
        "reservarEpisodio.html",
        episode=episodio_name,
        expireTime=expire_time,
        price=episodio_price,
        episodePosition=episodio_position,
    )


@app.route("/pagarReserva", methods=["POST"])
def pagarEpisodio():
    episodio_position = request.form["episodio_position"]
    episodio = get_episode_the_mandalorian(
        connect_db(), "the_mandalorian_episodes", episodio_position
    )
    episodio_name = episodio.split(",")[0]
    episodio_price = int(episodio.split(",")[1])

    if get_expire_time_episode(connect_db(), episodio_name) < 0:
        set_expire_time_to_episode(connect_db(), episodio_name, "Alquilado")

    expire_time = get_expire_time_episode(connect_db(), episodio_name)

    return redirect(url_for("index"))


@app.route("/episodioAlquilado", methods=["POST"])
def episodioAlquilado():
    episodio_position = request.form["episodio_position"]
    episodio = get_episode_the_mandalorian(
        connect_db(), "the_mandalorian_episodes", episodio_position
    )
    episodio_name = episodio.split(",")[0]

    expire_time = get_expire_time_episode(connect_db(), episodio_name)

    return render_template(
        "episodioAlquilado.html", expireTime=expire_time, episode=episodio_name
    )


# @app.route("/redis/get")
# def getData():
#     return r.get("foo")


if __name__ == "__main__":
    # app.run(debug=True)
    app.run(host="web-api-flask", port="5000", debug=True)
