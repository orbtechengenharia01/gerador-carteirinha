// netlify/functions/lib/livepix-auth.js
const fetch = require('node-fetch');

let cachedToken = null;
let tokenExpiry = 0;

/**
 * Obtém um token válido do LivePix
 * Gera novo token apenas se o cache expirou
 */
async function getValidToken() {
    const now = Date.now();
    
    // Se token ainda é válido, retorna do cache
    if (cachedToken && now < tokenExpiry) {
        console.log('Usando token em cache');
        return cachedToken;
    }

    console.log('Gerando novo token LivePix...');
    
    try {
        const response = await fetch('https://oauth.livepix.gg/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: process.env.LIVEPIX_CLIENT_ID,
                client_secret: process.env.LIVEPIX_CLIENT_SECRET,
                scope: 'messages:write messages:read payments:read'
            })
        });

        if (!response.ok) {
            throw new Error(`OAuth error: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.access_token) {
            throw new Error('Access token não retornado');
        }

        // Armazenar token e calcular expiração
        cachedToken = data.access_token;
        // Expira 5 minutos antes do real (margem de segurança)
        tokenExpiry = now + ((data.expires_in - 300) * 1000);
        
        console.log('Token gerado com sucesso. Expira em:', new Date(tokenExpiry));
        
        return cachedToken;
        
    } catch (error) {
        console.error('Erro ao gerar token LivePix:', error);
        throw error;
    }
}

module.exports = { getValidToken };
