import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import Redirect from "./components/pages/Redirect";
import Activities from "./components/pages/Activities";
import store from "./components/redux/store/store";
import CreateActivity from "./components/pages/CreateActivity";
import HomeScreen from "./components/pages/HomeScreen";
function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/app" element={<HomeScreen />} />
            <Route path="/redirect/:token" element={<Redirect />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/create-activity" element={<CreateActivity />} />
            <Route path="*" element={<Navigate to="/app" />} />
            <Route path="/" element={<Navigate to="/app" />} />
          </Routes>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
