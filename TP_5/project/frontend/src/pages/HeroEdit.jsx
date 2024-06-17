import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSuperheroes } from "../context/SuperheroesContext";
import HeroForm from "../components/common/HeroForm";

const HeroEdit = () => {
  const location = useLocation();
  const { heroName } = location.state || "";
  // const heroName = window.location.href.split("/")[4]

  const { superHeroes, loading, getOneData } = useSuperheroes(heroName);

  useEffect(() => {
    getOneData(heroName);
  }, [heroName, getOneData]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  return (
    <>
      <div className="min-h-screen bg-green-900">
        <h1 className="text-3xl font-bold text-white">Hero Edit</h1>
        <div>{loading ? "Cargando..." : <HeroForm heroes={superHeroes} />}</div>
      </div>
    </>
  );
};

export default HeroEdit;
