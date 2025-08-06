const config = {
    API_BASE_URL: 'http://202lb-172909912.us-east-2.elb.amazonaws.com:8080',
    API_ENDPOINTS: {
        // Auth endpoints
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REGISTER: '/auth/register',
        SEND_VERIFICATION: '/auth/send_verification',
        
        // Restaurant endpoints
        RESTAURANTS: '/api/restaurants',
        RESTAURANT_DETAIL: (id) => `/api/restaurants/${id}`,
        RESTAURANT_MAP: (id) => `/api/restaurants/restaurant/${id}/map`,
        
        // Opening endpoints
        OPENINGS: '/api/openings',
        OPENING_DETAIL: (id) => `/api/openings/${id}`,
        OPENING_SEARCH: '/api/openings/search',
        OPENING_BOOK: (id) => `/api/openings/book/${id}`,
        OPENING_CANCEL: (id) => `/api/openings/cancel/${id}`,
        OPENING_BOOK_TODAY: (id, date) => `/api/openings/booked_today/${id}/${date}`,
        
        // File upload
        FILE_UPLOAD: '/api/files/upload',
        
        // Review endpoints
        RESTAURANT_REVIEWS: (id) => `/api/review/restaurant/${id}`,
        
        // Admin endpoints
        APPROVE_RESTAURANT: (id) => `/admin/approve/${id}`,
        REMOVE_RESTAURANT: (id) => `/admin/remove/${id}`,
        RESERVATION_NUMBER: (year, month) => `/admin/reservation_number/${year}/${month}`
    }
};

export default config;
