import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SuperheroesProvider } from "./context/SuperheroesContext";
import Header from "./components/Header";
import Home from "./pages/Home";
import Marvel from "./pages/Marvel";
import DC from "./pages/DC";
import Add_Hero from "./pages/Add_Hero";
import Footer from "./components/Footer";
import Hero_Details from "./pages/HeroDetails";
import Hero_Edit from "./pages/HeroEdit";

function App() {
  return (
    <div className="App bg-green-900">
      <SuperheroesProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/marvel" element={<Marvel />}></Route>
            <Route path="/dc" element={<DC />}></Route>
            <Route path="/add_hero" element={<Add_Hero />}></Route>
            <Route path="*" element={<Home />}></Route>
            <Route path="/marvel/*" element={<Hero_Details />}></Route>
            <Route path="/dc/*" element={<Hero_Details />}></Route>
            <Route path="/edit/*" element={<Hero_Edit />}></Route>
          </Routes>
          <Footer />
        </BrowserRouter>
      </SuperheroesProvider>
    </div>
  );
}

export default App;
