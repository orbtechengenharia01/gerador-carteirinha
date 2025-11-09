// netlify/functions/check-payment.js
const fetch = require('node-fetch');
const { getValidToken } = require('./lib/livepix-auth');

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const reference = event.queryStringParameters?.ref;
        
        if (!reference) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Referência não fornecida',
                    status: 'error' 
                })
            };
        }

        // Obter token válido (auto-refresh)
        const token = await getValidToken();

        // Consultar status do pagamento no LivePix
        const response = await fetch(`https://api.livepix.gg/v2/messages/${reference}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`LivePix API error: ${response.status}`);
        }

        const data = await response.json();

        // Retornar status
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                status: data.data?.proof ? 'paid' : 'pending',
                data: data.data
            })
        };

    } catch (error) {
        console.error('Erro ao verificar pagamento:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Erro ao verificar status',
                status: 'error',
                message: error.message 
            })
        };
    }
};
