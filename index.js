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

// API Proxy Routes
app.get('/api/last', async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/last`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

app.get('/api/lifetime', async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/lifetime`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

app.get('/api/feed', async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/feed`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

app.post('/api/request', async (req, res) => {
    try {
        const { service, country } = req.body;
        const response = await axios.post(`${API_BASE_URL}/request`, 
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
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

app.get('/api/latest_otp', async (req, res) => {
    try {
        const { number } = req.query;
        const response = await axios.get(`${API_BASE_URL}/latest_otp?number=${encodeURIComponent(number)}`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

app.get('/api/countries', async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/countries`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

app.get('/api/services', async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/services`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

app.get('/api/my_numbers', async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/my_numbers`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

app.post('/api/release', async (req, res) => {
    try {
        const { number } = req.body;
        const response = await axios.post(`${API_BASE_URL}/release`,
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
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

// Serve HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});