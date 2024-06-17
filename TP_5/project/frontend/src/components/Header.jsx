import { Outlet, Link } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import marvel_logo from "../assets/images/logos/Marvel-logo.png";
import dc_logo from "../assets/images/logos/DC-logo.png";
import { useSuperheroes } from "../context/SuperheroesContext";
const Header = () => {
  const { getDataByName, setFilterName } = useSuperheroes();

  const filterData = (value) => {
    setFilterName(value);
    getDataByName(value);
  }



  return (
    <>
      <nav className="flex items-center justify-between bg-zinc-50 flex-wrap bg-teal p-6 border-b-2 border-green-700 mb-5 dark:bg-gradient-to-r dark:from-red-900 dark:via-green-900 dark:to-blue-900 dark:text-white">
        <div className="flex items-center flex-no-shrink text-white mr-6">
          <Link to="/" className="font-semibold text-xl tracking-tight">
            <div className="flex">
              <img className="h-12 w-15" src={marvel_logo} alt="Marvel Logo" />
              <img className="h-12 w-15" src={dc_logo} alt="DC Logo" />
            </div>
          </Link>
        </div>
        <div className="block lg:hidden">
          <button className="flex items-center px-3 py-2 border rounded text-teal-lighter border-teal-light hover:text-white hover:border-white">
            <svg
              className="h-3 w-3"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
        <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
          <div className="text-sm lg:flex-grow">
            <Link
              to="/marvel"
              className="block mt-4 hover:underline hover:text-blue-500 decoration-red-700 underline-offset-4 duration-300 lg:inline-block lg:mt-0 text-teal-lighte mr-4 hover:dark:text-blue-700"
            >
              Marvel
            </Link>
            <Link
              to="/dc"
              className="block mt-4 hover:underline hover:text-blue-500 decoration-red-700 underline-offset-4 duration-300 lg:inline-block lg:mt-0 text-teal-lighter hover:dark:text-blue-700"
            >
              DC
            </Link>
          </div>
          <div className="lg:pr-2 flex lg:py-0 py-3 lg:pl-0 pl-10">
            {/* <IoSearchOutline className="h-6 w-6 my-2 mr-3 lg:mr-0" />
            <input
              type="text"
              className="border-none focus:ring-0 placeholder-yellow-200 focus:border-red-500 outline-none"
              placeholder="Search..."
            ></input> */}
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <IoSearchOutline className="h-6 w-6 my-2 mr-3 lg:mr-0" />
              </div>
              <input
                type="search"
                id="default-search"
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-100 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search..."
                onChange={(e) => filterData(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <Link
              to="/add_hero"
              className="inline-block hover:text-blue-500 duration-300 text-sm px-4 py-2 leading-none border rounded text-white bg-red-500 border-red-500 hover:border-transparent hover:text-teal hover:bg-red-300 mt-4 lg:mt-0"
            >
              Add Hero
            </Link>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default Header;
