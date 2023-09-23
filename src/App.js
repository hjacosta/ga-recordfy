import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import { LoginScreen } from "./screens/LoginScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { RecordScreen } from "./screens/RecordScreen";
import { Sidebar } from "./components/Sidebar";
import { TopNavbar } from "./components/TopNavbar";
import { SidebarContext } from "./contexts/SidebarCtx";
import { useResize } from "./hooks/useResize";
import { TopBar } from "./components/TopBar";

function App() {
  const [token, setToken] = React.useState("j");
  const { isVisible, setIsVisible, sidebarWidth } =
    React.useContext(SidebarContext);

  const { width } = useResize();

  if (!token) {
    return <LoginScreen />;
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
        <div
          style={layoutCSS(width, isVisible, sidebarWidth)}
          className="app-template"
        >
          <TopNavbar />
          <div className="main">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
            </Routes>
            <Routes>
              <Route path="/records" element={<RecordScreen />} />
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
    styles = { marginLeft: isVisible ? sbWidth : "70px" };
  } else {
    styles = { marginLeft: "0" };
  }

  return styles;
}
