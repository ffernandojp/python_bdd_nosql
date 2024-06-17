import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  getSuperheroes,
  deleteSuperhero,
  updateSuperhero,
  createSuperhero,
  getSuperheroe,
  getSuperheroesByName,
  getSuperheroesByHouse,
} from "../scripts/superheroes";
const SuperheroesContext = createContext();

const SuperheroesProvider = ({ children }) => {
  const [superHeroes, setSuperheroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [superHeroeName, setSuperHeroeName] = useState("");
  const [filterName, setFilterName] = useState("");
  const [originalSuperheroes, setOriginalSuperheroes] = useState([]);
  const [houseFilter, setHouseFilter] = useState("");

  const getData = useCallback(async () => {
    const response = await getSuperheroes();
    setHouseFilter("")
    setSuperheroes(response.data);
    setOriginalSuperheroes(response.data);
    setLoading(false);
  }, []);
  useEffect(() => {
    getData();
  }, [getData]);

  const updateData = async (form) => {
    const response = await updateSuperhero(form);
    return response;
  };

  const createData = async (form) => {
    const response = await createSuperhero(form);
    return response;
  };

  const deleteData = async (name) => {
    const response = await deleteSuperhero(name);
    return response;
  };

  const getOneData = useCallback(async (name) => {
    const response = await getSuperheroe(name);
    setSuperheroes(response.data);
    setLoading(false);
  }, []);
  useEffect(() => {
    getOneData();
  }, [getOneData]);

  const getDataByName = useCallback(async (name, houseFilterWord) => {
    setLoading(true);
    if (houseFilterWord !== "" && houseFilterWord !== undefined) {
      const response = await getSuperheroesByName(name, houseFilterWord);
      setSuperheroes(response.data);
      setLoading(false);
      }
    else if (houseFilterWord === "") {
      const response = await getSuperheroesByName(name);
      setSuperheroes(response.data);
      setLoading(false);
    }
    else {
      setSuperheroes(superHeroes)
    }

  }, []);
  useEffect(() => {
    getDataByName();
  }, [getDataByName, houseFilter]);

  const getDataByHouse = useCallback(async (house) => {
    const response = await getSuperheroesByHouse(house);
    setSuperheroes(response.data);
    setLoading(false);
  }, []);
  useEffect(() => {
    getDataByHouse();
  }, [getDataByHouse]);

  return (
    <SuperheroesContext.Provider
      value={{
        setHouseFilter,
        superHeroes,
        setSuperheroes,
        getData,
        loading,
        deleteData,
        updateData,
        createData,
        getOneData,
        superHeroeName,
        setSuperHeroeName,
        getDataByName,
        getDataByHouse,
        filterName,
        setFilterName,
        originalSuperheroes,
      }}
    >
      {children}
    </SuperheroesContext.Provider>
  );
};

const useSuperheroes = () => useContext(SuperheroesContext);

export { SuperheroesProvider, useSuperheroes };
