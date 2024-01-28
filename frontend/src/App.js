// Import necessary modules
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your Login component
import Login from './login';
import Home from "./home";

// Create a main App component that includes the Router and routes
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login/>} />

                <Route path="/home" element={<Home/>} />
            </Routes>
        </Router>
    );
}

// Export the main App component
export default App;
