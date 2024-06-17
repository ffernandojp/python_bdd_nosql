import { useState, useEffect, useCallback } from "react";
import { useSuperheroes } from "../context/SuperheroesContext";
import Details from "../components/HeroDetails/Details";

const HeroDetails = () => {
  const { superHeroes, superHeroeName, getOneData, loading, setSuperHeroeName } = useSuperheroes();
  const [superHero, setSuperHero] = useState({});
    const setName = useCallback( async () => {
      const heroeName = await getName();
      setSuperHeroeName(heroeName);
    }, []);
  useEffect(() => {
    if (!superHeroeName) {
      setName();
    }
    getOneData(superHeroeName);
  }, [getOneData, superHeroeName, setSuperHeroeName, setName]);
  const fixName = (name) => {
    if (name.includes("_")) {
      const word = name.split("_");
      const word1 = word[0].toLowerCase().charAt(0).toUpperCase() + word[0].toLowerCase().slice(1);
      const word2 = word[1].toLowerCase().charAt(0).toUpperCase() + word[1].toLowerCase().slice(1);
      return word1 + " " + word2;
    } else {
      return name.toLowerCase().charAt(0).toUpperCase() + name.toLowerCase().slice(1);
    }
  }
  const getNameFromUri = () => {
    if (window.location.href.includes("marvel")) {
      return window.location.href.split("marvel/")[1]
    } else if (window.location.href.includes("dc")) {
      return window.location.href.split("dc/")[1]
    }
  }

  const getName = () => {
    const name = getNameFromUri();
    return fixName(name);
  }

  useEffect(() => {
    if (superHeroes.length > 0) {
      const hero = Object.values(superHeroes)[0];
      setSuperHero(hero);
    } else {
      getOneData(superHeroeName);
    }
  }, [superHeroes]);


  return (
    <>
      <div className="min-h-screen bg-green-900">
        <h1 className="text-3xl font-bold text-white">Hero Details</h1>
        <div>{loading && "Loading..."}</div>
        <div>{superHeroes.length === 0 && "No hero founded"}</div>
        <div>{superHeroes.length > 0 && <Details hero={superHero} />}</div>
      </div>
    </>
  );
};

export default HeroDetails;
