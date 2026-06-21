const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Konfigurasi API
const API_KEY = 'zelapi-4hwd4va';
const API_BASE_URL = 'https://api.zelapioffciall.dpdns.org/api/v1/nokos';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ============ PROXY ENDPOINTS ============

// 1. Get Countries
app.get('/api/countries', async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/countries?service=WhatsApp`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Countries Error:', error.message);
        res.status(error.response?.status || 500).json({
            success: false,
            error: error.message,
            details: error.response?.data || 'Terjadi kesalahan'
        });
    }
});

// 2. Get My Numbers
app.get('/api/my_numbers', async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/my_numbers`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        res.json(response.data);
    } catch (error) {
        console.error('My Numbers Error:', error.message);
        res.status(error.response?.status || 500).json({
            success: false,
            error: error.message,
            details: error.response?.data || 'Terjadi kesalahan'
        });
    }
});

// 3. Request Number
app.post('/api/request_number', async (req, res) => {
    try {
        const { service, country } = req.body;
        const response = await axios.post(`${API_BASE_URL}/request_number`, 
            { service, country },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                }
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error('Request Number Error:', error.message);
        res.status(error.response?.status || 500).json({
            success: false,
            error: error.message,
            details: error.response?.data || 'Terjadi kesalahan'
        });
    }
});

// 4. Release Number
app.post('/api/release_number', async (req, res) => {
    try {
        const { number } = req.body;
        const response = await axios.post(`${API_BASE_URL}/release_number`,
            { number },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                }
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error('Release Number Error:', error.message);
        res.status(error.response?.status || 500).json({
            success: false,
            error: error.message,
            details: error.response?.data || 'Terjadi kesalahan'
        });
    }
});

// 5. Latest OTP
app.get('/api/latest_otp', async (req, res) => {
    try {
        const { number } = req.query;
        const response = await axios.get(`${API_BASE_URL}/latest_otp?number=${encodeURIComponent(number)}`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Latest OTP Error:', error.message);
        res.status(error.response?.status || 500).json({
            success: false,
            error: error.message,
            details: error.response?.data || 'Terjadi kesalahan'
        });
    }
});

// 6. My OTPs
app.get('/api/my_otps', async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const response = await axios.get(`${API_BASE_URL}/my_otps?limit=${limit}`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        res.json(response.data);
    } catch (error) {
        console.error('My OTPs Error:', error.message);
        res.status(error.response?.status || 500).json({
            success: false,
            error: error.message,
            details: error.response?.data || 'Terjadi kesalahan'
        });
    }
});

// 7. Test endpoint
app.get('/api/test', async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/countries?service=WhatsApp`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        res.json({
            success: true,
            message: 'Koneksi API berhasil!',
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

// ============ SERVE FRONTEND ============
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`🔑 API Key: ${API_KEY}`);
    console.log(`🌐 API Base URL: ${API_BASE_URL}`);
});
