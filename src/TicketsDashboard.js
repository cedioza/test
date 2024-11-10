import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TicketsDashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [filterType, setFilterType] = useState('All');
    const ticketsPerPage = 5;

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get('http://localhost:8000/emails');
                
                if (response.data.status === 'success') {
                    const formattedTickets = response.data.data.map((email, index) => ({
                        id: email.id,
                        title: email.subject,
                        origin: 'Gmail',
                        messages: 1,
                        created: email.date,
                        lastMessage: email.date,
                        sender: email.from,
                        status: 'Pending',
                        description: email.snippet,
                        filterType: ['Needs supervision', 'Auto answered', 'Answered'][index % 3]
                    }));
                    setTickets(formattedTickets);
                }
            } catch (error) {
                console.error('Error fetching tickets:', error);
            }
        };

        fetchTickets();
    }, []);

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilterType = filterType === 'All' || ticket.filterType === filterType;
        return matchesSearch && matchesFilterType;
    });

    const indexOfLastTicket = currentPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
    const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <div className="p-6 max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-semibold">GuruSup</h1>
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="px-4 py-2 bg-gray-800 rounded text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <button className="bg-red-500 px-4 py-2 rounded">Reload Tickets</button>
                    </div>
                </header>

                <table className="min-w-full bg-gray-800 rounded-lg">
                    <thead>
                        <tr>
                            <th className="py-3 px-6">Info</th>
                            <th className="py-3 px-6">Origin</th>
                            <th className="py-3 px-6">Messages</th>
                            <th className="py-3 px-6">Created</th>
                            <th className="py-3 px-6">Last Message</th>
                            <th className="py-3 px-6">Sender</th>
                            <th className="py-3 px-6">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTickets.length > 0 ? (
                            currentTickets.map(ticket => (
                                <tr key={ticket.id} className="border-b border-gray-700">
                                    <td className="py-4 px-6">
                                        <Link to={`/ticket/${ticket.id}`} className="text-blue-500">
                                            {ticket.title}
                                        </Link>
                                        <br />
                                        <span className="text-gray-400">{ticket.description}</span>
                                    </td>
                                    <td className="py-4 px-6">{ticket.origin}</td>
                                    <td className="py-4 px-6">{ticket.messages}</td>
                                    <td className="py-4 px-6">{ticket.created}</td>
                                    <td className="py-4 px-6">{ticket.lastMessage}</td>
                                    <td className="py-4 px-6">{ticket.sender}</td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2 py-1 rounded ${ticket.status === 'Open' ? 'bg-green-500' : 'bg-gray-500'}`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="py-4 px-6 text-center" colSpan="7">No tickets found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {/* Paginación omitida aquí para simplificar */}
            </div>
        </div>
    );
};

export default TicketsDashboard;
