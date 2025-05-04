import ListGroup from "./ListGroup";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Resources from "./pages/Resources";
import Construction from "./pages/Construction";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/construction" element={<Construction />} />
      </Routes>
    </Router>
  );
}

export default App;
