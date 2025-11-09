// netlify/functions/create-mercadopago.js
const { MercadoPagoConfig, Preference } = require('mercadopago');

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
        const { username, logoName } = JSON.parse(event.body);
        
        if (!username || !logoName) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Nome e logo são obrigatórios' 
                })
            };
        }

        // Configurar cliente Mercado Pago (SDK v2)
        const client = new MercadoPagoConfig({ 
            accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN 
        });
        
        const preference = new Preference(client);

        // Criar preferência de pagamento
        const body = {
            items: [{
                title: 'Sugestão de Logo',
                description: `Logo: ${logoName}`,
                quantity: 1,
                currency_id: 'BRL',
                unit_price: 5.00
            }],
            payer: {
                name: username
            },
            metadata: {
                username: username,
                logo_name: logoName,
                tipo: 'sugestao_logo'
            },
            payment_methods: {
                installments: 1
            },
            back_urls: {
                success: 'https://geradorcarteirinha.site/?donation=success',
                failure: 'https://geradorcarteirinha.site/?donation=failed',
                pending: 'https://geradorcarteirinha.site/?donation=pending'
            },
            auto_return: 'approved',
            statement_descriptor: 'CARTEIRINHA'
        };

        console.log('Criando preferência MP...');

        const response = await preference.create({ body });

        console.log('Preferência criada:', response);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                init_point: response.init_point,
                id: response.id
            })
        };

    } catch (error) {
        console.error('Erro Mercado Pago:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Erro ao criar pagamento',
                message: error.message,
                details: error.toString()
            })
        };
    }
};
