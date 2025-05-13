import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Resources from "./pages/Resources";
import Construction from "./pages/Construction";

import { GameDataProvider } from "./contexts/GameDataContext";

function App() {
  return (
    <GameDataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/construction" element={<Construction />} />
        </Routes>
      </Router>
    </GameDataProvider>
  );
}

export default App;
