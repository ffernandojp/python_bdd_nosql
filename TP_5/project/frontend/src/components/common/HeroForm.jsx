import { useState, useRef } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import marvel_logo from "../../assets/images/logos/Marvel-logo.png";
import dc_logo from "../../assets/images/logos/DC-logo.png";
import { Carousel } from "flowbite-react";
import { useSuperheroes } from "../../context/SuperheroesContext";

const HeroForm = ({ heroes }) => {
  let hero = "";
  if (heroes) {
    hero = Object.values(heroes)[0];
  }

  const marvel_images = require.context(
    "../../assets/images/characters/Marvel/",
    false,
    /\.(png|jpe?g|svg)$/
  );
  const dc_images = require.context(
    "../../assets/images/characters/DC/",
    false,
    /\.(png|jpe?g|svg)$/
  );

  const dc_keys = dc_images.keys();
  const marvel_keys = marvel_images.keys();

  const folder = hero?.house === "DC" ? dc_images : marvel_images;
  const imageKey = hero?.house === "DC" ? dc_keys : marvel_keys;
  const specificKey = hero?.images
    ? imageKey.find((key) => key.includes(hero?.images[0]))
    : "";

  // console.log(folder(), "folder")
  const imagesKey = hero?.images
    ? hero?.images?.map((image, index) =>
        imageKey.find((key) => key.includes(hero?.images[index]))
      )
    : "";

  const [form, setForm] = useState({
    name: hero?.name,
    characterName: hero?.characterName,
    biography: hero?.biography,
    house: hero?.house,
    yearOfAppearance: hero?.yearOfAppearance,
    affiliation: hero?.affiliation,
    equipment: hero?.equipment,
    images: hero?.images,
  });

  const { deleteData, updateData, createData } = useSuperheroes();

  const matchTitle = (str) => {
    if (str.toUpperCase() === "DC") {
      return "DC";
    } else {
      str = str.toLowerCase();
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  };

  const deleteHeroe = async (e, name) => {
    try {
      e.preventDefault();
      const confirm = window.confirm("Are you sure you want to delete this hero?");
      if (confirm) {
        
        const response = await deleteData(name);
        if (response.status === 200) {
          window.location.href = "/";
        }
      }

    } catch (error) {
      console.log(error);
    }
  };
  const updateHero = async (form) => {
    const response = await updateData(form);
    if (response.status === 200) {
      const confirm = window.confirm(
        "Hero updated successfully. Do you want to exit?"
      );
      if (confirm) {
        window.location.href = "/";
      }
    }
  };

  const checkFormComplete = (form) => {
    if (form) {
      if (form.name === "" ||  form.images === undefined || form.images === "" || form.house === "") {
        return false;
      } else {
        return true;
      }
    }
    else {
      console.log("h1 3")
      return false;
    }
  };

  const addHeroe = async (form) => {
    try{
      if (checkFormComplete(form)) {
        
        const response = await createData(form);
        if (response.status === 200) {
          const confirm = window.confirm(
            "Hero created successfully. Do you want to exit?"
          );
          if (confirm) {
            window.location.href = "/";
          } else {
            setForm({});
          }
        }
      }
      else {
        alert("All fields and images are required");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //? SELECT IMAGE
  const fileInputRef = useRef(null);
  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const [selectedFiles, setSelectedFiles] = useState("");

  const handleFileChange = (event) => {
    setSelectedFiles("");
    setForm({...form, images: ""})
    if (event.target.files && event.target.files[0]) {
      let filesUrl = Array.from(event.target.files).map((file) => {
        return URL.createObjectURL(file);
      });
      setSelectedFiles(filesUrl);
      let filesName = Array.from(event.target.files).map((file) => {
        return file.name;
      } );
      setForm({...form, images: filesName.join(",")});
    }
  };

  const changeImage = (e) => {
    handleFileClick();
  };

  return (
    <>
      <div className="container lg:flex items-center lg:items-start py-4 px-4 lg:pl-36 lg:space-x-44">
        <div className="flex flex-col">
          <div className="h-56 sm:h-64 xl:h-80 xl:min-w-80 2xl:h-96 lg:max-h-full">
            {form?.images?.length === 1 && (
              <img
                key={1}
                className="h-56 sm:h-64 xl:h-80 2xl:h-full 2xl:min-h-96 lg:max-h-full lg:max-w-full"
                src={specificKey !== "" ? folder(specificKey) : selectedFiles}
                alt={form?.name}
              />
            )}
            {form?.images?.length > 1 && selectedFiles === "" && (
              <Carousel slide={false}>
                {form?.images?.map((image, index) => (
                  <img
                    key={index}
                    className="h-56 sm:h-64 xl:h-80 2xl:h-full 2xl:min-h-96 lg:max-h-full lg:max-w-full"
                    src={
                      imagesKey[index] !== undefined
                        ? folder(imagesKey[index])
                        : selectedFiles
                    }
                    alt={form?.name}
                  />
                ))}
              </Carousel>
            )}
            {form?.images?.length >= 1 && selectedFiles !== "" && (
              <Carousel slide={false}>
                {Array.from(selectedFiles).map((image, index) => (
                  <img
                    className="h-56 sm:h-64 xl:h-80 2xl:h-full 2xl:min-h-96 lg:max-h-full lg:max-w-full"
                    src={image}
                    alt={form?.name}
                  />
                ))}
              </Carousel>
            )}
          </div>
      
          <button
            type="sumbit"
            className="lg:w-44 mx-auto w-32 h-10 bg-yellow-400 rounded-lg flex items-center"
            onClick={(e) => {
              changeImage(e);
            }}
            disabled={form?.house === "" ? true : false}
          >
            <div className="flex flex-row space-x-2 mx-auto">
              <MdModeEdit className="w-5 h-5" />{" "}
              <h4 className="text-center">
                {form?.name ? "Change Image" : "Add Image"}
              </h4>
            </div>
          </button>
          <h5 className="pt-2 mx-auto max-w-56 italic text-xl text-red-600">
            Select an image from the same house of your hero
          </h5>

          <input
            type="file"
            accept=".png"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
            multiple
          />
        </div>
        <form className="flex text-center flex-col lg:w-1/3 mx-5 lg:mx-auto mt-6 space-y-4">
          <div className="flex space-x-20">
            <span className="text-lg font-semibold text-left italic">Name</span>
            <input
              className="bg-transparent border-b-2 border-gray-500 px-2 py-1 outline-none"
              type="text"
              name="name"
              placeholder="name"
              defaultValue={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="flex space-x-20">
            <span className="text-lg font-semibold text-left italic">
              Character <br />
              Name
            </span>
            <input
              className="bg-transparent border-b-2 border-gray-500 px-2 py-1 outline-none"
              type="text"
              name="characterName"
              placeholder="characterName"
              defaultValue={form.characterName}
              onChange={(e) =>
                setForm({ ...form, characterName: e.target.value })
              }
            />
          </div>
          <div className="flex space-x-20">
            <span className="text-lg font-semibold align-super text-left italic">
              Biography
            </span>

            <textarea
              className="bg-transparent border-b-2 border-gray-500 px-2 py-1 w-96 h-36 outline-none"
              type="text"
              name="biography"
              placeholder="biography"
              defaultValue={form.biography}
              onChange={(e) => setForm({ ...form, biography: e.target.value })}
            />
          </div>
          <div className="flex space-x-20">
            <span className="text-lg font-semibold text-left italic">
              House
            </span>
            <div className="flex flex-col">
              <input
                className="bg-transparent border-b-2 border-gray-500 px-2 py-1 outline-none w-full"
                type="text"
                name="house"
                placeholder="Marvel, DC"
                defaultValue={form.house}
                onChange={(e) =>
                  setForm({ ...form, house: matchTitle(e.target.value) })
                }
              />
              <div className="w-16 h-16 pt-2">
                {(form.house === "DC" || form.house === "Marvel") && (
                  <img
                    className="w-full h-full"
                    src={
                      form.house === "DC"
                        ? dc_logo
                        : form.house === "Marvel"
                        ? marvel_logo
                        : ""
                    }
                    alt=""
                  />
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-20">
            <span className="text-lg font-semibold text-left italic">
              Year of <br /> Appearance
            </span>

            <input
              className="bg-transparent border-b-2 border-gray-500 px-2 py-1 outline-none"
              type="text"
              name="yearOfAppearance"
              placeholder="yearOfAppearance"
              defaultValue={form.yearOfAppearance}
              onChange={(e) =>
                setForm({ ...form, yearOfAppearance: e.target.value })
              }
            />
          </div>
          <div className="flex space-x-20">
            <span className="text-lg font-semibold text-left italic">
              Affiliation
            </span>

            <input
              className="bg-transparent border-b-2 border-gray-500 px-2 py-1 outline-none"
              type="text"
              name="affiliation"
              placeholder="item1,item2,item3"
              defaultValue={form.affiliation}
              onChange={(e) =>
                setForm({ ...form, affiliation: matchTitle(e.target.value) })
              }
            />
          </div>
          <div className="flex space-x-20">
            <span className="text-lg font-semibold text-left italic">
              Equipment
            </span>

            <input
              className="bg-transparent border-b-2 border-gray-500 px-2 py-1 outline-none"
              type="text"
              name="equipment"
              placeholder="equipment"
              defaultValue={form.equipment}
              onChange={(e) => setForm({ ...form, equipment: e.target.value })}
            />
          </div>
          <br />
          <div className="flex space-x-10 lg:ml-0 ml-5">
            {hero !== "" && (
              <button
                type="sumbit"
                className="lg:w-96 w-32 h-10 bg-yellow-400 rounded-lg flex items-center"
                onClick={(e) => {
                  e.preventDefault();
                  updateHero(form);
                }}
              >
                <div className="flex flex-row space-x-2 mx-auto">
                  <MdModeEdit className="w-5 h-5" />{" "}
                  <h4 className="text-center">Update Hero</h4>
                </div>
              </button>
            )}
            {hero === "" && (
              <button
                type="sumbit"
                className="lg:w-96 w-32 h-10 bg-green-400 rounded-lg flex items-center hover:bg-green-600"
                onClick={(e) => {
                  e.preventDefault();
                  addHeroe(form);
                }}
              >
                <div className="flex flex-row space-x-2 mx-auto">
                  <IoMdAdd className="w-5 h-6" />{" "}
                  <h4 className="text-center">Add Hero</h4>
                </div>
              </button>
            )}
            {hero !== "" && (
              <button
                type="delete"
                className="lg:w-52 w-32 h-10 bg-red-400 rounded-lg flex items-center hover:bg-red-800"
                onClick={(e) =>
                  deleteHeroe(e, form?.name)
                }
              >
                <div className="flex flex-row space-x-2 mx-auto">
                  <FaTrashAlt className="w-5 h-5" />
                  <h4 className="text-center">Delete</h4>
                </div>
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default HeroForm;
