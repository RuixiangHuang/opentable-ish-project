import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import config from '../../config';

const MapPage = ({ id }) => {
    const [mapSrc, setMapSrc] = useState('');

    useEffect(() => {
        if (!id) return;
        const fetchMap = async () => {
            try {
                // Fetch the map URL from the backend
                const response = await fetch(`${config.API_BASE_URL}${config.API_ENDPOINTS.RESTAURANT_MAP(id)}`);
                // Check if the request was successful
                if (response.ok) {
                    const mapUrl = await response.text();
                    
                    // Decode the URL if needed
                    const decodedSrc = decodeURIComponent(mapUrl);
                    setMapSrc(decodedSrc);
                } else {
                    console.error('Failed to fetch map:', response.status);
                }
            } catch (error) {
                console.error('Error fetching map:', error);
            }
        };
        fetchMap();
    }, [id]);

    return (
        <div>
            <h3>Map Location:</h3>
            {mapSrc && (
                <iframe
                    width="600"
                    height="450"
                    src={mapSrc}  // Dynamically set the map source from the backend
                    allowFullScreen
                    title="Google Map"
                />
            )}
        </div>
    );
};

MapPage.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default MapPage;
