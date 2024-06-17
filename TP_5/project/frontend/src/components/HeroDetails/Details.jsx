import marvel_logo from "../../assets/images/logos/Marvel-logo.png";
import dc_logo from "../../assets/images/logos/DC-logo.png";
import { MdModeEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Carousel } from "flowbite-react";

const Details = ({ hero }) => {

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
  
  const imagesKey = hero?.images ? hero?.images?.map((image, index) => imageKey.find((key) => key.includes(hero?.images[index]) )) : ""

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div id="details" className="container lg:flex justify-between items-center py-4 px-4 lg:pl-24 lg:space-x-32">
        <div className="flex-column">
          <div className="h-56 sm:h-64 xl:h-80 xl:min-w-80 2xl:h-96 lg:max-h-full">
            {hero?.images?.length > 1 && <Carousel slide={false}>
              {hero?.images?.map((image, index) => (
                <img
                  key={index}
                  className="h-56 sm:h-64 xl:h-80 2xl:h-full 2xl:min-h-96 lg:max-h-full lg:max-w-full"
                  src={imagesKey[index] !== (undefined) ? folder(imagesKey[index]) : ""}
                  alt={hero?.name}
                />
              ))}
            </Carousel>}
            {hero?.images?.length === 1 && (
              <img
                key={hero?.images[0]}
                className="h-56 sm:h-64 xl:h-80 2xl:h-full 2xl:min-h-96 lg:max-h-full lg:max-w-full"
                src={ folder(specificKey)}
                alt={hero?.name}
              />
            )}
          </div>
          <h1 className="text-3xl">{hero?.name}</h1>
        </div>

        <div className="text-center space-y-6">
          <div className="flex flex-row lg:space-x-32 space-x-12">
            <div className="pb-5">
              <h2 className="text-lg italic text-lime-400 text-left">
                Character Name
              </h2>
              <p className="text-xl text-left">{hero?.characterName}</p>
            </div>
            <div className="pb-5">
              <h2 className="text-lg italic text-lime-400 text-left">House</h2>
              <p className="text-xl text-left">{hero?.house}</p>
            </div>
            <div className="pb-5">
              <h2 className="text-lg italic text-lime-400 text-left">
                Year of Appearance
              </h2>
              <p className="text-xl text-left">{hero?.yearOfAppearance}</p>
            </div>
          </div>
          <div className="flex flex-row space-x-24">
            <div className="pb-5 lg:pr-5">
              <h2 className="text-lg italic text-lime-400">Affiliation</h2>
              {hero?.house === "Marvel" && (
                <img
                  className="h-12 w-15"
                  src={marvel_logo}
                  alt="Marvel Logo"
                />
              )}{" "}
              {hero?.house === "DC" && (
                <img className="h-12 w-15" src={dc_logo} alt="DC Logo" />
              )}{" "}
            </div>
            <div className="pb-5">
              <h2 className="text-lg italic text-lime-400 text-left">
                Equipment
              </h2>
              <p className="text-xl text-left">
                {Array.isArray(hero?.equipment) &&
                  hero?.equipment.map((equipment) => (
                    <li key={equipment}>{equipment}</li>
                  ))}
                {!Array.isArray(hero?.equipment) && (
                  <span className="text-xl text-left">No equipment</span>
                )}
              </p>
            </div>
          </div>
          <div className="pb-5 max-w-96">
            <h2 className="text-lg italic text-lime-400 text-left">
              Biography
            </h2>
            <p className="text-xl text-left">{hero?.biography}</p>
          </div>
        </div>
        <div className="w-96 space-y-6 space-x-6 lg:space-x-0">
          <Link to={`/edit/${hero?.name}`} state={{ heroName: hero?.name }}>
            <button className="lg:w-36 w-32 h-10 bg-yellow-400 rounded-lg flex items-center">
              <div className="flex flex-row space-x-2 mx-auto">
                <MdModeEdit className="w-5 h-5" />{" "}
                <h4 className="text-center">Edit</h4>
              </div>
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Details;
