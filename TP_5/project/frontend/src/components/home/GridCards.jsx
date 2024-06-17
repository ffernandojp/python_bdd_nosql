import { useEffect, useState } from "react";
import Card from "./Card";
import axios from "axios";
import { useSuperheroes } from "../../context/SuperheroesContext";

const GridCards = ({
  superHeroes,
  getData,
  getDataByHouse,
  houseFilter = "",
}) => {
  const {
    setSuperHeroeName,
    filterName,
    setFilterName,
    getDataByName,
    originalSuperheroes,
  } = useSuperheroes();

  const requestUploadData = () => {
    axios
      .get("http://localhost:5000/api/uploadData")
      .then((res) => {
        getData();
      })
      .catch((error) => console.log(error));
  };
  const updateFilter = async (houseFilter) => {
    await getDataByHouse(houseFilter);
  };
  useEffect(() => {
    if (houseFilter) {
      updateFilter(houseFilter);
    } else {
      getData();
    }
  }, [getDataByHouse, houseFilter]);

  useEffect(() => {
    setSuperHeroeName(null);
  }, []);

  const filterData = async (word) => {
    if (filterName !== "") {
      await getDataByName(word, houseFilter);
    } else if (houseFilter !== "" && filterName === "") {
      await getDataByHouse(houseFilter);
    } else if (houseFilter === "" && filterName === "") {
      await getData();
    }
  };

  useEffect(() => {
    filterData(filterName);
  }, [filterName, houseFilter]);

  useEffect(() => {
    setFilterName("");
  }, []);

  return (
    <>
      {/* <h5 className="absolute lg:left-96 lg:top-36 left-28 italic text-gray-300">
        ({superHeroes?.length} superheroes cards)
      </h5> */}

      <div className="grid mt-0 py-5 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12">
        {superHeroes &&
          superHeroes.length > 0 &&
          superHeroes?.map(
            (hero, id) => hero !== null && <Card key={id} heroe={hero} />
          )}
      </div>
      {superHeroes && originalSuperheroes?.length === 0 && (
        <div className="min-h-screen">
          <h1 className="text-center text-5xl mb-5">No hay heroes</h1>
          <button
            type="button"
            className="text-white bg-green-700 my-5 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            onClick={requestUploadData}
          >
            <h4 className="text-center text-md">Agregar Heroes</h4>
          </button>
        </div>
      )}
      {superHeroes?.message?.includes("Error") && (
        <div className="min-h-screen">
          <h1 className="text-center text-5xl mb-5">Error </h1>
          {/* <button
            type="button"
            className="text-white bg-green-700 my-5 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            onClick={requestUploadData}
          >
            <h4 className="text-center text-md">Agregar Heroes</h4>
          </button> */}
          <p className="text-center text-2xl">
            Error retreiving data. Please try again
          </p>
        </div>
      )}
    </>
  );
};

export default GridCards;
