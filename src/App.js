import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";
import { SidebarContext } from "./contexts/SidebarCtx";
import { SignupScreen } from "./screens/SignupScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { RecordScreen } from "./screens/RecordScreen";
import { RecordDetailScreen } from "./screens/RecordDetailScreen";
import { Sidebar } from "./components/Sidebar";
import { TopNavbar } from "./components/TopNavbar";
import { useResize } from "./hooks/useResize";
import { TopBar } from "./components/TopBar";
import { ConfigurationScreen } from "./screens/ConfigurationScreen";
import { NotificationContainer } from "react-notifications";
import { ReportScreen } from "./screens/ReportScreen";
import "./App.css";
import RecordHistoryScreen from "./screens/RecordHistoryScreen";

function App() {
  const { token } = React.useContext(AuthContext);

  // const defaultToken = JSON.parse(sessionStorage.getItem("session"))?.token
  // const [token, setToken] = React.useState(defaultToken || undefined);
  const { isVisible, setIsVisible, sidebarWidth } =
    React.useContext(SidebarContext);

  const { width } = useResize();
  const [cssLayout, setCssLayout] = React.useState({});

  React.useEffect(() => {
    (() => {
      setCssLayout(layoutCSS(width, isVisible, sidebarWidth));
    })();
  }, [width, isVisible]);

  if (!token) {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<LoginScreen />} />
          <Route path="/signup" element={<SignupScreen />} />
        </Routes>
      </Router>
    );
  }

  return (
    <div className="App">
      <Router>
        {isVisible && width <= 768 && (
          <div
            className="backdrop"
            onClick={() => {
              setIsVisible(false);
            }}
          ></div>
        )}
        <Sidebar />
        <div style={cssLayout} className="app-template">
          <NotificationContainer />
          <TopNavbar />
          <div className="main">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/records" element={<RecordScreen />} />
              <Route path="/records/:id" element={<RecordDetailScreen />} />
              <Route
                path="/records/:id/history"
                element={<RecordHistoryScreen />}
              />
              <Route path="/reports" element={<ReportScreen />} />
              <Route path="/settings" element={<ConfigurationScreen />} />
            </Routes>
          </div>
        </div>
      </Router>
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}

export default App;

function layoutCSS(scWidth, isVisible, sbWidth) {
  let styles = {};

  if (scWidth > 768) {
    styles = {
      marginLeft: isVisible ? sbWidth : "60px",
      width: `calc(100% - ${isVisible ? sbWidth : "60px"})`,
    };
  } else {
    styles = { marginLeft: "0" };
  }

  return styles;
}
