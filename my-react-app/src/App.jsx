import {
  HashRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import Home from "./pages/Home";
import Resources from "./pages/Resources";
import Construction from "./pages/Construction";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";


import { GameDataProvider } from "./contexts/GameDataContext";
import { UserProvider } from "./contexts/UserContext";
import PersonAccount from "./pages/PersonAccount";

function App() {
  return (

      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/construction" element={<Construction />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/LogIn" element={<LogIn />} />
            <Route path="/user/:id" element={<PersonAccount />} />
          </Routes>
        </Router>
      </UserProvider>
  );
}

export default App;
