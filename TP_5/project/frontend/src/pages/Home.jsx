import { useEffect } from "react";
import GridCards from "../components/home/GridCards";
import { useSuperheroes } from "../context/SuperheroesContext";

const Home = () => {
  const { superHeroes, getData, loading, setHouseFilter } = useSuperheroes();

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div className="min-h-screen bg-green-900">
      {loading && !superHeroes.length && <h1>Loading...</h1>}
      {superHeroes && (
        <h1 className="text-center text-gray-100 text-4xl mb-5 underline underline-offset-8 decoration-red-400">
          Heroes
        </h1>
      )}
      {!loading && superHeroes.length === 0 && <h1>No heroes found</h1>}
      {superHeroes && <GridCards superHeroes={superHeroes} getData={getData} />}
    </div>
  );
};

export default Home;
