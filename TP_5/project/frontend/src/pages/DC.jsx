import React, { useEffect } from "react";
import GridCards from "../components/home/GridCards";
import { useSuperheroes } from "../context/SuperheroesContext";

const DC = () => {
  const { superHeroes, getDataByHouse, getData, loading } = useSuperheroes();
  
  
  
  
  const houseFilter = "DC";
  useEffect(() => {
    getDataByHouse(houseFilter);
  }, [getDataByHouse, houseFilter]);

  return (
    <div className="min-h-screen bg-green-900">
      {loading && <h1>Loading...</h1>}
      {superHeroes && (
        <h1 className="text-center text-4xl mb-5 underline underline-offset-8 decoration-red-400">
          Heroes DC
        </h1>
      )}
      {!loading && superHeroes.length === 0 && <h1>No heroes found</h1>}
      {superHeroes && (
        <GridCards
          superHeroes={superHeroes}
          getData={getData}
          getDataByHouse={getDataByHouse}
          houseFilter={houseFilter}
        />
      )}
    </div>
  );
};

export default DC;
