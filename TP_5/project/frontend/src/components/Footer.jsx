import marvel_logo from "../assets/images/logos/Marvel-logo.png";
import dc_logo from "../assets/images/logos/DC-logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer className="flex flex-col mt-10 items-center bg-zinc-50 text-center text-surface dark:bg-gradient-to-r dark:from-red-900 dark:via-green-900 dark:to-blue-900 dark:text-white">
        <div className="container pt-9">
          <div className="flex justify-center space-x-4 mr-5">
            <Link className="hover:cursor-pointer hover:underline underline-offset-4" to="/">
              <h4 className="text-md">Home</h4>
            </Link>
            <Link className="hover:cursor-pointer hover:underline underline-offset-4" to="/marvel">
              <h4 className="text-md">Marvel</h4>
            </Link>
            <Link className="hover:cursor-pointer hover:underline underline-offset-4" to="/dc">
              <h4 className="text-md">DC</h4>
            </Link>
          </div>
          <div className="mb-6 mt-5 flex justify-center space-x-2">
            <img className="w-24 h-12" src={marvel_logo} alt="marvel_logo" />
            <img className="w-24 h-12" src={dc_logo} alt="dc_logo" />
          </div>
        </div>

        <div className="w-full bg-black/5 p-4 text-center">
          <span className="hover:cursor-pointer">
            © 2024 Copyright: Fernando Perez
          </span>
        </div>
      </footer>
    </>
  );
};

export default Footer;
