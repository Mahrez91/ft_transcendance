import React from 'react';
import './App.css';
import Pong from './Pong';
import Home from './Home';
import Pong2 from './Pong2';
import Pong3 from './Pong3';
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <body>
        <Routes>
            < Route path="/pong" element={<Pong />} />
        </Routes>
        <Routes>
            < Route path="/pong2" element={<Pong2 />} />
        </Routes>
        <Routes>
            < Route path="/pong3" element={<Pong3 />} />
        </Routes>
        <Routes>
            < Route path="/" element={<Home />} />
        </Routes>
    </body>
  );
}



export default App;
