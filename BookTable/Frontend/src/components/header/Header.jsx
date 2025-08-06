import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [people, setPeople] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate(`/search?date=${date}&time=${time}&people=${people}&query=${searchQuery}`);
    }

    return (
        <div className="header-container">
            <div className="header-content">
                <h1 className="header-title">Make a free reservation</h1>
                
                {/* Wrap the inputs and button inside a form */}
                <form onSubmit={handleSubmit} className="header-search">
                    <input 
                        type="date" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                        className="header-input"
                    />

                    <input 
                        type="time" 
                        value={time} 
                        onChange={(e) => setTime(e.target.value)} 
                        className="header-input"
                    />

                    <select 
                        value={people} 
                        onChange={(e) => setPeople(e.target.value)} 
                        className="header-input"
                    >
                        {[...Array(10)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {i + 1} {i + 1 === 1 ? 'Person' : 'People'}
                            </option>
                        ))}
                    </select>

                    <input 
                        type="text" 
                        placeholder="Location, Restaurant, or Cuisine" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="header-search-input"
                    />

                    {/* Change the button type to 'submit' to trigger form submission */}
                    <button type="submit" className="header-search-button">Let's Go</button>
                </form>
            </div>
        </div>
    );
}

export default Header;
