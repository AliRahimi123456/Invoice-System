import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';

export const Private = () => {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInvoices = async () => {
            setLoading(true);
            const result = await actions.getInvoices();
            if (result && result.error) {
                setError(result.error);
            }
            setLoading(false);
        };

        fetchInvoices();
    }, []);

    const handleLogout = () => {
        actions.logout();
        navigate('/login');
    };

    return (
        <div className="private-page">
            <h1>Private Page</h1>
            <button onClick={handleLogout}>Log Out</button>

            {loading && <p>Loading invoices...</p>}
            {error && <p>Error: {error.statusText}</p>}
            {!loading && !error && store.invoices.length > 0 ? (
                <div className="invoices">
                    <h2>Your Invoices</h2>
                    <ul>
                        {store.invoices.map((invoice, index) => (
                            <li key={index}>
                                <p>Invoice ID: {invoice.id}</p>
                                <p>Amount: {invoice.amount}</p>
                                <p>Date: {invoice.date}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                !loading && <p>No invoices found.</p>
            )}
        </div>
    );
};