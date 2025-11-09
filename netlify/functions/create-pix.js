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

        // Montar comentário (LivePix usa "comment", não "message")
        const comment = message 
            ? `Logo: ${logoName} - ${message}` 
            : `Logo: ${logoName}`;

        // Obter token válido
        const token = await getValidToken();

        // Chamar API LivePix (payload CORRETO)
        const response = await fetch('https://api.livepix.gg/v2/messages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                comment: comment,  // ← "comment" ao invés de "message"
                amount: 500  // R$ 5,00 (apenas amount, sem currency)
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('LivePix API Error:', response.status, errorText);
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
