from flask import Flask, render_template, request, redirect, url_for
from redis import Redis
import json


app = Flask(__name__, template_folder="./templates")


def connect_db():
    print("Connecting to DB")
    # conexion = Redis(host="localhost", port=6379, decode_responses=True, db=2)
    conexion = Redis(host="db-redis", port=6379, decode_responses=True, db=2)

    if conexion.ping():
        print("DB Connected")
    else:
        print("Error connecting to DB")

    return conexion


def get_places_by_key(db, key, longitude, latitude):
    # lista = db.geosearch(
    #     key, "FROMLONLAT", longitude, latitude, "BYRADIUS", 5, "km", "ASC"
    # )
    lista = db.georadius(
        key, longitude=longitude, latitude=latitude, radius=5, unit="km"
    )
    return lista


def get_all_places(db, groups, longitude=0, latitude=0):
    places = []
    for place in groups:
        places.append(get_places_by_key(db, place, longitude, latitude))
    return places


def get_keys(db):
    return db.keys()


def get_all_places_with_name(db, groups, longitude=0, latitude=0):
    places = {}
    for place in groups:
        places[place] = get_places_by_key(db, place, longitude, latitude)
    return places


@app.route("/", methods=["GET"])
def index():
    # longitude = -58.222
    # latitude = -32.263
    groups = [
        "cervecerias_artesanales",
        "universidades",
        "supermercados",
        "centros_de_emergencia",
        "farmacias",
    ]

    my_location = get_my_location(connect_db())

    if my_location:
        longitude = my_location[0]
        latitude = my_location[1]
    else:
        longitude = 0
        latitude = 0
    # longitude = request.args.get("longitude", type=float, default=-58.222)
    # latitude = request.args.get("latitude", type=float, default=-32.253)

    places = get_all_places_with_name(connect_db(), groups, longitude, latitude)

    int_places = 0
    keys = get_keys(connect_db())
    for group in groups:
        if group in keys:
            int_places = 1

    if int_places == 0:
        buttonCargar = "<button type='submit' class='btn-submit'><a style='text-decoration: none; color: white;' href='/cargarData'>Cargar grupos</a></button>"
    else:
        buttonCargar = "<input type='hidden'>"

    if int_places == 1:
        puntos_de_interes = (
            "<ul style='list-style-type: none;'>"
            + "".join(
                (
                    f"<li style='margin-bottom: 2px;'><p class='place-name'>{place}:</p><p>{', '.join(places[place])}</p></li>"
                    if len(places[place]) > 0
                    else f"<li style='margin-bottom: 2px;'><p class='place-name'>{place}:</p><p color='gray' style='font-style: italic'>No hay lugares en este radio</p></li>"
                )
                for place in places
            )
            + "</ul>"
        )
    else:
        puntos_de_interes = ""

    all_places = get_all_places(connect_db(), groups, longitude, latitude)

    places_array = []
    for place in places:
        for item in places[place]:
            places_array.append([place, item])

    select_places = (
        "<select name='select_places' id='select_places' style='margin-bottom: 5px;'>"
        + "<option value=0>Seleccione un lugar</option>"
        + "".join(
            f"<option value={(item[0])}?{item[1].replace(' ', '_')}>{item[1]}</option>"
            for item in places_array
        )
        + "</select>"
    )

    select_group = (
        "<select name='select_group' id='select_group' style='margin-bottom: 5px;'>"
        + "<option value=0>Seleccione un grupo</option>"
        + "".join(
            f"<option value={item}>{item.replace('_', ' ')}</option>" for item in groups
        )
        + "</select>"
    )

    return render_template(
        "index.html",
        puntos_de_interes=puntos_de_interes,
        select_places=select_places,
        longitude=longitude,
        latitude=latitude,
        select_group=select_group,
        buttonCargar=buttonCargar,
    )


def add_my_location(db, longitude, latitude):
    db.geoadd("mylocation", (longitude, latitude, "mylocation"))


def get_my_location(db):
    pos = db.geopos("mylocation", "mylocation")[0]
    return pos


@app.route("/agregarUbicacion", methods=["POST"])
def agregar_ubicacion():
    longitude = request.form["mylongitude"]
    latitude = request.form["mylatitude"]
    add_my_location(connect_db(), longitude, latitude)
    return redirect(url_for("index"))


def add_place(db, group, name, longitude, latitude):
    db.geoadd(group, (longitude, latitude, name))
    return redirect(url_for("index"))


@app.route("/agregarLugar", methods=["POST"])
def agregar_lugar():
    establecimiento = request.form["establecimiento"]
    longitude = request.form["longitude"]
    latitude = request.form["latitude"]
    group = request.form["select_group"]

    add_place(connect_db(), group, establecimiento, longitude, latitude)

    return redirect(url_for("index"))


def get_distance(db, place, longitude, latitude):
    group, name = place
    pos = db.geopos(group, name)[0]
    place_longitude = pos[0]
    place_latitude = pos[1]

    db.geoadd("distancia", (longitude, latitude, "mylocation"))
    db.geoadd("distancia", (place_longitude, place_latitude, name))

    distance = db.geodist("distancia", "mylocation", name, "km")
    db.delete("distancia")
    return distance


@app.route("/distancia_calculada", methods=["POST"])
def calcular_distancia():
    place = request.form["select_places"]
    place = place.split("?")
    place[1] = place[1].replace("_", " ")
    # mylongitude = request.form["mylongitude"]
    # mylatitude = request.form["mylatitude"]
    my_location = get_my_location(connect_db())
    mylongitude = my_location[0]
    mylatitude = my_location[1]
    distance = get_distance(connect_db(), place, mylongitude, mylatitude)
    return render_template(
        "distancia.html",
        distance=distance,
        place_name=place[1],
    )


@app.route("/cargarData")
def cargarData():
    data = [
        'cervecerias_artesanales -58.1524239 -32.2358254 "La Maltera"',
        'cervecerias_artesanales -58.1540469 -32.2285644 "La Taberna del Grano"',
        'cervecerias_artesanales -58.1429637 -32.2119948 "El Barril Encantado"',
        'cervecerias_artesanales -58.1359399 -32.2207154 "El Desierto"',
        'cervecerias_artesanales -58.1464829 -32.2154334 "Rustica El Dorado"',
        'cervecerias_artesanales -58.2008079 -32.1936774 "Cerveceria El Paso"',
        'cervecerias_artesanales -58.2279303 -32.2214044 "Cerveceria El Abismo"',
        'cervecerias_artesanales -58.2145413 -32.1781374 "Cerveceria El Cairo"',
        'cervecerias_artesanales -58.2914859 -32.268824 "Cerveceria La Escondida"',
        'universidades -58.1869359 -32.1928424 "Universidad San Jose"',
        'universidades -58.2214999 -32.2014924 "UNED"',
        'universidades -58.1377769 -32.2251814 "Universidad de Huesca"',
        'universidades -58.2246679 -32.2182334 "Universidad de Zaragoza"',
        'universidades -58.1426029 -32.2225664 "Universidad de Colon"',
        'universidades -58.1345319 -32.2238954 "UADER"',
        'universidades -58.1379763 -32.2541594 "Universidad Rural"',
        'universidades -58.2242323 -32.1779844 "Universidad Costa Alta"',
        'farmacias -58.1336983 -32.2542364 "Farmacia El Ejido"',
        'farmacias -58.2189279 -32.2105544 "Farmacia y Drogueria San Martin"',
        'farmacias -58.1626369 -32.2106684 "Farmacia del Pueblo"',
        'farmacias -58.1551899 -32.2261614 "Farmacia Francia"',
        'farmacias -58.1686799 -32.2160514 "Farmacia La Salvacion"',
        'farmacias -58.1529033 -32.2550484 "Farmacia El Viajero"',
        'centros_de_emergencia -58.1517939 -32.2279944 "Centro Emergencias 24/7"',
        'centros_de_emergencia -58.1522449 -32.2212984 "Centro de Emergecias Ciudadano Urgente"',
        'centros_de_emergencia -58.1333719 -32.2297444 "Centro Salvando Vidas"',
        'centros_de_emergencia -58.1575629 -32.2369974 "Centro de Salud Vital"',
        'centros_de_emergencia -58.1347749 -32.2287574 "Centro de Cuidado Intensivo"',
        'centros_de_emergencia -58.2261713 -32.2421624 "Centro de Recuperacion Veras"',
        'supermercados -58.1951003 -32.2723324 "Supermecado El Sigsal"',
        'supermercados -58.1846733 -32.1829524 "Supermecado La Economia"',
        'supermercados -58.2414613 -32.2302644 "Supermecado El Ahorro"',
        'supermercados -58.1985233 -32.1780304 "Supermecado La Plaza"',
        'supermercados -58.1436909 -32.2264074 "Supermecado La Familia"',
        'supermercados -58.1447409 -32.2303004 "Supermercado El Ahorrista"',
        'supermercados -58.1500039 -32.2330554 "Supermercado El Centro"',
        'supermercados -58.2132673 -32.2418054 "Supermercado Rural"',
    ]
    connect_db().geoadd("mylocation", (-58.2414613, -32.2330554, "mylocation"))
    for item in data:
        item_splited = item.split(maxsplit=3)
        group = item_splited[0]
        longitude = float(item_splited[1])
        latitude = float(item_splited[2])
        place = item_splited[3]
        print(item_splited)
        connect_db().geoadd(group, (longitude, latitude, place))

    return redirect(url_for("index"))


# @app.route("/redis/get")
# def getData():
#     return r.get("foo")


if __name__ == "__main__":
    # app.run(host="localhost", port="5000", debug=True)
    app.run(host="web-api-flask", port="5000", debug=True)
