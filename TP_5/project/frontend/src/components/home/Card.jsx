import { Link } from "react-router-dom";
import { useSuperheroes } from "../../context/SuperheroesContext";

const Card = ({ heroe }) => {
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
  const folder = heroe?.house === "DC" ? dc_images : marvel_images;
  const imageKey = heroe?.house === "DC" ? dc_keys : marvel_keys;
  const specificKey = heroe?.images
    ? imageKey.find((key) => key.includes(heroe?.images[0]))
    : "";

  const biography = heroe?.biography.substring(0, 60) + "...";

  const { setSuperHeroeName } = useSuperheroes();
  const handleClick = () => {
    setSuperHeroeName(heroe?.name);
  };

  return (
    <>
      <div className="lg:max-w-2xl min-w-fit mx-auto px-2 md:px-0 lg:px-0 hover:scale-105 duration-300">
        <div className="bg-white shadow-md border border-gray-200 rounded-lg max-w-sm dark:bg-gray-800 dark:border-gray-700">
          <img
            className="rounded-t-lg"
            src={specificKey !== ("" || undefined) ? folder(specificKey) !== undefined ? folder(specificKey) : "" : ""}
            alt=""
          />
          <div className="p-2 lg:p-5 md:p-5">
            <h5 className="text-gray-900 font-bold text-2xl tracking-tight mb-2 dark:text-white">
              {heroe?.name}
            </h5>
            <p className="font-normal text-gray-700 mb-3 dark:text-gray-400">
              {biography}
            </p>
            <Link
              to={`/${heroe?.house.toLowerCase()}/${heroe?.name
                .replace(" ", "_")
                .toLowerCase()}`}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center  dark:bg-blue-600 dark:hover:bg-blue-900 dark:focus:ring-blue-800 hover:text-red-700 duration-300"
            >
              <button className="inline-flex" onClick={handleClick}>
                View Details
                <svg
                  className="-mr-1 ml-2 h-5 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
