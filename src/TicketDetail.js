import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TicketDetail = () => {
    const [tickets, setTickets] = useState([]);
    const [currentTicket, setCurrentTicket] = useState(null);
    const [responseText, setResponseText] = useState('');

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get('http://localhost:8000/cron-email/');
                
                if (response.data.status === 'success') {
                    setTickets(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching tickets:', error);
            }
        };

        fetchTickets();
    }, []);

    const handleSelectTicket = (ticket) => {
        setCurrentTicket(ticket);
        setResponseText(''); // Limpia el texto de respuesta al cambiar de ticket
    };

    const handleDraft = () => {
        if (currentTicket && currentTicket.mistral_response) {
            setResponseText(currentTicket.mistral_response); // Establece la respuesta de Mistral
        } else {
            setResponseText("Gracias por su mensaje. Estamos revisando su caso y le responderemos pronto.");
        }
    };

    const handleSend = async () => {
        try {
            const response = await axios.post('http://localhost:8000/cron-email/', {
                responseText,
                ticketId: currentTicket.id, // Incluye el ID del ticket actual para referencia
            });
            
            if (response.data.status === 'success') {
                console.log("Respuesta enviada exitosamente:", responseText);
                alert("La respuesta ha sido enviada con éxito.");
            } else {
                alert("Hubo un problema al enviar la respuesta.");
            }
        } catch (error) {
            console.error('Error al enviar la respuesta:', error);
            alert("Error al enviar la respuesta.");
        }
    };

    if (tickets.length === 0) return <p>Loading...</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto bg-gray-100 rounded shadow-md">
            {/* Selección del ticket */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700">Select Ticket:</h3>
                <select 
                    onChange={(e) => handleSelectTicket(tickets.find(ticket => ticket.id === e.target.value))} 
                    className="w-full p-2 border rounded"
                >
                    <option value="">Select a ticket</option>
                    {tickets.map((ticket) => (
                        <option key={ticket.id} value={ticket.id}>
                            {ticket.subject}
                        </option>
                    ))}
                </select>
            </div>

            {currentTicket && (
                <>
                    {/* Asunto del ticket */}
                    <h2 className="text-2xl font-bold mb-4">{currentTicket.subject}</h2>

                    {/* Resumen (snippet) */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-700">Summary:</h3>
                        <p className="text-gray-700">{currentTicket.snippet}</p>
                    </div>

                    {/* Área de respuesta */}
                    <div className="border p-4 bg-white rounded mb-4">
                        <label className="block text-gray-700 mb-2">Type your response here:</label>
                        <textarea
                            className="w-full p-2 border rounded"
                            rows="4"
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                        />
                    </div>

                    {/* Botones para generar borrador y enviar */}
                    <div className="flex gap-4">
                        <button onClick={handleDraft} className="bg-yellow-500 px-4 py-2 rounded text-white">Generate Draft</button>
                        <button onClick={handleSend} className="bg-red-500 px-4 py-2 rounded text-white">Send</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default TicketDetail;
