import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import RequireAuth from "./components/RequireAuth";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Sondage from "./components/Sondage";
import Resultats from "./pages/Resultats";
import RechercheResultats from "./pages/RechercheResultats";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />

          {/* Route protégée : nécessite d'être connecté */}
          <Route
            path="/creer-sondage"
            element={
              <RequireAuth>
                <Sondage />
              </RequireAuth>
            }
          />

          {/* Page pour rechercher les résultats d'un sondage par son lien */}
          <Route
            path="/resultats"
            element={
              <RequireAuth>
                <RechercheResultats />
              </RequireAuth>
            }
          />

          {/* Page des résultats d'un sondage */}
          <Route
            path="/sondages/:lienPartage/resultats"
            element={
              <RequireAuth>
                <Resultats />
              </RequireAuth>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;