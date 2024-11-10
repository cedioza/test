import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TicketsDashboard from './TicketsDashboard';
import TicketDetail from './TicketDetail';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<TicketsDashboard />} />
                <Route path="/ticket/:id" element={<TicketDetail />} />
            </Routes>
        </Router>
    );
}

export default App;
