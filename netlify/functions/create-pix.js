// netlify/functions/create-pix.js
const fetch = require('node-fetch');
const { getValidToken } = require('./lib/livepix-auth');

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const { username, logoName, message } = JSON.parse(event.body);
        
        if (!username || !logoName) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Username e logoName são obrigatórios' 
                })
            };
        }

        // Montar mensagem completa
        const fullMessage = message 
            ? `Logo: ${logoName} - ${message}` 
            : `Logo: ${logoName}`;

        // Obter token válido (auto-refresh)
        const token = await getValidToken();

        // Chamar API LivePix v2/messages
        const response = await fetch('https://api.livepix.gg/v2/messages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                message: fullMessage,
                amount: 500,
                currency: 'BRL',
                redirectUrl: 'https://geradorcarteirinha.site/?donation=success'
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('LivePix API Error:', response.status, errorData);
            throw new Error(`LivePix API retornou status ${response.status}`);
        }

        const data = await response.json();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error('Erro ao criar PIX:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Erro ao processar pagamento',
                message: error.message 
            })
        };
    }
};
