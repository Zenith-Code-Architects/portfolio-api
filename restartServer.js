import axios from "axios";

const portfolioCheckUrl = 'http://localhost:8080/api/v1/portfoliohealth'

export const restartServer = async () => {
    try {
        const response = await axios.get(portfolioCheckUrl);
        console.log('Health Check Status:', response.data.status);
    } catch (error) {
        console.error('Health Check Failed:', error.message);
    }
};