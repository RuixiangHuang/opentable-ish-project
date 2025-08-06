import React, { useState, useEffect } from 'react';
import './Navbar.css';
import logo from './opentable.png';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Navbar = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [showRestaurantDropdown, setShowRestaurantDropdown] = useState(false);
    const [showOpeningDropdown, setShowOpeningDropdown] = useState(false);
    const [showAdminDropdown, setShowAdminDropdown] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('satoken');
        const role = localStorage.getItem('role');
        if (token) {
            setIsAuthenticated(true);
            setUserRole(role);
        } else {
            setIsAuthenticated(false);
            setUserRole('');
        }
    }, []);

    const toggleRestaurantDropdown = () => {
        setShowOpeningDropdown(false);
        setShowAdminDropdown(false);
        setShowRestaurantDropdown(!showRestaurantDropdown);
    };

    const toggleOpeningDropdown = () => {
        setShowRestaurantDropdown(false);
        setShowAdminDropdown(false);
        setShowOpeningDropdown(!showOpeningDropdown);
    };

    const toggleAdminDropdown = () => {
        setShowRestaurantDropdown(false);
        setShowOpeningDropdown(false);
        setShowAdminDropdown(!showAdminDropdown);
    };

    const closeAllDropdowns = () => {
        setShowRestaurantDropdown(false);
        setShowOpeningDropdown(false);
        setShowAdminDropdown(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown')) {
                closeAllDropdowns();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleMapClick = () => navigate('/map');
    const handleAddClick = () => navigate('/add');
    const handleEditClick = () => navigate('/edit');
    const handleDashboardClick = () => navigate('/dashboard');
    const handleApproveClick = () => navigate('/approve');
    const handleCreateOpeningClick = () => navigate('/createopening');
    const handleEditOpeningClick = () => navigate('/editopening');
    const handleDeleteClick = () => navigate('/delete');
    const handleViewBookingsClick = () => navigate('/view-bookings');

    const isAdminOrManager = userRole === 'admin' || userRole === 'manager';
    const isAdmin = userRole === 'admin';
    const isRegularUser = isAuthenticated && !isAdminOrManager;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="logo">
                    <img src={logo} alt="OpenTable Logo" className="logo-img" />
                    <a href="/">OpenTable</a>
                    <FaMapMarkerAlt
                        className="map-icon"
                        onClick={handleMapClick}
                        title="View Map"
                    />
                </div>
                <div className="auth-buttons">
                    {isAuthenticated && isAdminOrManager && (
                        <>
                            <div className="dropdown">
                                <button className="dropdown-btn" onClick={toggleRestaurantDropdown}>
                                    Restaurants {showRestaurantDropdown ? <FaChevronUp /> : <FaChevronDown />}
                                </button>
                                {showRestaurantDropdown && (
                                    <div className="dropdown-content">
                                        <button className="dropdown-item" onClick={handleAddClick}>
                                            Add Restaurant
                                        </button>
                                        <button className="dropdown-item" onClick={handleEditClick}>
                                            Edit Restaurant
                                        </button>
                                        {isAdmin && (
                                            <button className="dropdown-item" onClick={handleDeleteClick}>
                                                Delete Restaurant
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="dropdown">
                                <button className="dropdown-btn" onClick={toggleOpeningDropdown}>
                                    Openings {showOpeningDropdown ? <FaChevronUp /> : <FaChevronDown />}
                                </button>
                                {showOpeningDropdown && (
                                    <div className="dropdown-content">
                                        <button className="dropdown-item" onClick={handleCreateOpeningClick}>
                                            Create Opening
                                        </button>
                                        <button className="dropdown-item" onClick={handleEditOpeningClick}>
                                            Edit Opening
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {isAuthenticated && isAdmin && (
                        <div className="dropdown">
                            <button className="dropdown-btn" onClick={toggleAdminDropdown}>
                                Admin {showAdminDropdown ? <FaChevronUp /> : <FaChevronDown />}
                            </button>
                            {showAdminDropdown && (
                                <div className="dropdown-content">
                                    <button className="dropdown-item" onClick={handleDashboardClick}>
                                        Dashboard
                                    </button>
                                    <button className="dropdown-item" onClick={handleApproveClick}>
                                        Approve
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {isAuthenticated && (
                        <button 
                            className="view-bookings-btn"
                            onClick={handleViewBookingsClick}
                        >
                            View Bookings
                        </button>
                    )}

                    {!isAuthenticated ? (
                        <>
                            <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
                            <button className="signup-btn" onClick={() => navigate('/signup')}>Sign Up</button>
                        </>
                    ) : (
                        <button className="logout-btn" onClick={() => navigate('/logout')}>Logout</button>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;