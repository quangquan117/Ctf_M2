import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import RequireAuth from "./components/RequireAuth";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Sondage from "./components/Sondage";
import PollDetail from "./pages/PollDetail";

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
          <Route path="/sondage/:id" element={<PollDetail />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;