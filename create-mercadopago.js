// api/create-mercadopago.js
const { MercadoPagoConfig, Preference } = require('mercadopago');

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

    // Handle OPTIONS preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only POST allowed
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { username, logoName } = req.body;
        
        if (!username || !logoName) {
            return res.status(400).json({ 
                error: 'Nome e logo são obrigatórios' 
            });
        }

        // Configurar cliente Mercado Pago
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

        const response = await preference.create({ body });

        return res.status(200).json({ 
            init_point: response.init_point,
            id: response.id
        });

    } catch (error) {
        console.error('Erro Mercado Pago:', error);
        return res.status(500).json({ 
            error: 'Erro ao criar pagamento',
            message: error.message
        });
    }
}
