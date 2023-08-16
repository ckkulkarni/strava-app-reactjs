import React, { useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Base from "./components/pages/Base";
import { Provider } from "react-redux";
import Redirect from "./components/pages/Redirect";
import { useSelector } from "react-redux/es/exports";
import Activities from "./components/pages/Activities";
import store from "./components/redux/store/store";
import CreateActivity from "./components/pages/CreateActivity";
function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<Base />} />
            <Route path="/redirect/:token" element={<Redirect />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/create-activity" element={<CreateActivity />} />
          </Routes>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
