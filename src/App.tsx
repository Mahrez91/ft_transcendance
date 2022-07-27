import React from 'react';
import './App.css';
import Pong from './Pong';
import Home from './Home';
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <body>
        <Routes>
            < Route path="/pong" element={<Pong />} />
        </Routes>
        <Routes>
            < Route path="/" element={<Home />} />
        </Routes>
    </body>
  );
}



export default App;
