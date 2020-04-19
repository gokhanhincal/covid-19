import React from "react";
import "./App.css";
import CovidTable from "./CovidTable";
import WorldCovidTable from "./WorldCovidTable";

function App() {
  return (
    <div className="App">
      <CovidTable></CovidTable>
      <WorldCovidTable></WorldCovidTable>
    </div>
  );
}

export default App;
