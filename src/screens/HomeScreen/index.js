import React from "react";
import { TopBar } from "../../components/TopBar";
import "./index.css";

function HomeScreen() {
  return (
    <div className="home">
      <TopBar label="Dashboard" />
    </div>
  );
}

export { HomeScreen };
