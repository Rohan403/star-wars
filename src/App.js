import React from "react";
import "./App.css";
import Character from "./Character";

export default function App() {
   return (
      <div className="App">
         <div className="header">
            <h1>Star warS</h1>
            <h2>characters</h2>
         </div>
         <Character />
      </div>
   );
}