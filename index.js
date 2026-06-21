const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;
const API_BASE_URL = process.env.API_BASE_URL;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Helper function untuk handle API calls dengan better error handling
async function handleApiRequest(req, res, apiCall) {
    try {
        const response = await apiCall();
        res.json(response.data);
    } catch (error) {
        console.error('API Error:', error.message);
        
        // Cek apakah response ada dan bisa dibaca
        let errorMessage = error.message;
        let statusCode = error.response?.status || 500;
        
        if (error.response) {
            // Coba parse response sebagai JSON
            try {
                const errorData = error.response.data;
                if (typeof errorData === 'string') {
                    errorMessage = errorData;
                } else {
                    errorMessage = JSON.stringify(errorData);
                }
            } catch (e) {
                errorMessage = error.response.data || error.message;
            }
        }
        
        res.status(statusCode).json({ 
            error: true, 
            message: errorMessage,
            status: statusCode,
            hint: 'Pastikan API key valid dan endpoint benar'
        });
    }
}

// API Proxy Routes dengan error handling yang lebih baik
app.get('/api/last', async (req, res) => {
    await handleApiRequest(req, res, async () => {
        return await axios.get(`${API_BASE_URL}/last`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
    });
});

app.get('/api/lifetime', async (req, res) => {
    await handleApiRequest(req, res, async () => {
        return await axios.get(`${API_BASE_URL}/lifetime`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
    });
});

app.get('/api/feed', async (req, res) => {
    await handleApiRequest(req, res, async () => {
        return await axios.get(`${API_BASE_URL}/feed`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
    });
});

app.post('/api/request', async (req, res) => {
    await handleApiRequest(req, res, async () => {
        const { service, country } = req.body;
        return await axios.post(`${API_BASE_URL}/request`, 
            { service, country },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                }
            }
        );
    });
});

app.get('/api/latest_otp', async (req, res) => {
    await handleApiRequest(req, res, async () => {
        const { number } = req.query;
        return await axios.get(`${API_BASE_URL}/latest_otp?number=${encodeURIComponent(number)}`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
    });
});

app.get('/api/countries', async (req, res) => {
    await handleApiRequest(req, res, async () => {
        return await axios.get(`${API_BASE_URL}/countries`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
    });
});

app.get('/api/services', async (req, res) => {
    await handleApiRequest(req, res, async () => {
        return await axios.get(`${API_BASE_URL}/services`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
    });
});

app.get('/api/my_numbers', async (req, res) => {
    await handleApiRequest(req, res, async () => {
        return await axios.get(`${API_BASE_URL}/my_numbers`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
    });
});

app.post('/api/release', async (req, res) => {
    await handleApiRequest(req, res, async () => {
        const { number } = req.body;
        return await axios.post(`${API_BASE_URL}/release`,
            { number },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                }
            }
        );
    });
});

// Test endpoint untuk cek koneksi
app.get('/api/test', async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/countries`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        res.json({ 
            success: true, 
            message: 'Koneksi berhasil!', 
            data: response.data 
        });
    } catch (error) {
        res.json({ 
            success: false, 
            message: 'Gagal koneksi ke API', 
            error: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
    }
});

// Serve HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API Base URL: ${API_BASE_URL}`);
    console.log(`API Key: ${API_KEY.substring(0, 10)}...`);
});
