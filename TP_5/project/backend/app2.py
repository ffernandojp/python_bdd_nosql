# import os

# # from PIL import Image
# import json


# characters_data = json.load(open("./backend/bd_scripts/characters.json", "r"))
# marvel_path = "./backend/bd_scripts/characters_pictures/images/Marvel/"
# dc_comics_path = "./backend/bd_scripts/characters_pictures/images/DC_Comics/"

# marvel_files = os.listdir(marvel_path)
# dc_comics_files = os.listdir(dc_comics_path)
# # batman = os.path.join(dc_comics_path, "Batman")
# # print(dc_comics_files)
# # print(os.path.exists(batman))

# # # ****** UPLOAD IMAGE TO DB *****

# # img = Image.open(batman)
# # img.show()
# # print(characters_data)
# # for key, value in characters_data.items():
# # print(f"{key}: {value}")
# print(len(characters_data))
# for character in characters_data:
#     # for key, value in character.items():
#     # print(f"{key}: {value}")
#     name = character["name"]
#     name = name.replace(" ", "-")
#     house = character["house"]
#     print(name)
#     print(character["images"])
#     if house == "DC":
#         # isInImages = os.path.join(dc_comics_path, name)
#         files = dc_comics_files
#     else:
#         files = marvel_files
#         # isInImages = os.path.join(marvel_path, name)

#     # isInImages = any(name in file for file in files)
#     character["images"] = []
#     for file in files:
#         if name in file:
#             character["images"].append(file)

#     json.dump(
#         characters_data, open("./backend/bd_scripts/characters.json", "w"), indent=2
#     )
#     # if isInImage:
#     #     for file in files:

#     #         return
#     #     return

#     # print(os.path.exists(isInImages))
#     # print(isInImages)

# #     print(character)
# # print(characters_data[0])

# # # ***** RENAME IMAGES SYSTEM *****
# # for file in marvel_files:
# #     # file_name = file.replace("Marvel-", "").replace("-square.png", ".png")
# #     file_name = file + ".png"
# #     os.rename(marvel_path + file, marvel_path + file_name)
# #     print(file_name)

# # for file in dc_comics_files:
# #     # #     file_name = file.replace("DC-Comics-", "").replace("-square.png", "")
# #     file_name = file + ".png"
# #     os.rename(dc_comics_path + file, dc_comics_path + file_name)
# # # #     print(file_name)


# # name = "Spider-Man"
# # names_bd = ["Spider-Man Syn", "Spider-Man", "Spiderman", "Spiderman", "Spiderman"]

# # for nme in names_bd:
# #     if name in nme:
# #         print(nme)


# data = {"data": {"name": "Spider-Man", "house": "DC", "equipment": []}}
# for obj in data["data"]:
#     print(data["data"][obj])

# data = {"data": "Thor"}
# print(data["data"])
