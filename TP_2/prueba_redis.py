from flask import Flask, jsonify, request
from redis import Redis

app = Flask(__name__)


def connect_db():
    conexion = Redis(host="localhost", port=6379, decode_responses=True)
    if conexion.ping():
        print("conectado a redis")
    else:
        print("error de conexion con redis")
    return conexion


def get_list(db, nombre_lista):
    lista = db.lrange(nombre_lista, 0, -1)
    return lista


@app.route("/", methods=["GET"])
def index():
    """Retorna la pagina index."""
    lista = None
    if request.method == "GET":
        con = connect_db()

        lista = get_list(con, "personajes")
    return jsonify(lista)


@app.route("/cargar", methods=["GET"])
def cargar():
    """Retorna la pagina index."""
    if request.method == "GET":
        con = connect_db()
        episode = request.args.get("episode")
        character_name = request.args.get("name")
        con.lpush(episode, character_name)

    return "OK"


@app.route("/listar_episodios", methods=["GET"])
def lista_by_episode():
    """Retorna la pagina index."""
    lista = None
    if request.method == "GET":
        con = connect_db()
        episode = request.args.get("episode")
        lista = get_list(con, episode)
    return jsonify(lista)


if __name__ == "__main__":
    app.run(host="localhost", port="5000", debug=True)
