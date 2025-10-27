# Gerador de Carteirinha - Versão HTML/CSS/JS

Esta é a versão HTML/CSS/JavaScript pura do Gerador de Carteirinha, convertida a partir da versão Flutter original para resolver problemas de compatibilidade com o Google AdSense.

## 🎆 O que mudou?

### ✅ **Vantagens da Versão HTML**

1. **Compatibilidade total com AdSense**: O Google consegue verificar e indexar o código HTML puro
2. **Melhor SEO**: HTML semântico melhora a indexação nos mecanismos de busca
3. **Carregamento mais rápido**: Sem a sobrecarga do framework Flutter
4. **Maior compatibilidade**: Funciona em navegadores mais antigos
5. **Fácil manutenção**: Código mais direto e acessível

### 🔄 **Funcionalidades Mantidas**

- ✅ Interface idêntica ao Flutter
- ✅ Geração de carteirinhas em tempo real
- ✅ Upload de foto do aluno
- ✅ Seleção de logos de universidades
- ✅ Upload de logo personalizado
- ✅ Download em PNG e PDF
- ✅ Layout responsivo (desktop e mobile)
- ✅ Anúncios AdSense integrados
- ✅ PWA (Progressive Web App) ready

## 📁 Estrutura dos Arquivos

```
├── index.html          # Página principal
├── styles.css          # Estilos e layout responsivo
├── script.js           # Lógica JavaScript
└── web/                # Recursos estáticos (favicons, manifest, etc.)
    ├── favicon.ico
    ├── manifest.json
    └── ads.txt
```

## 🚀 Como Usar

### Opção 1: GitHub Pages
1. Faça merge da branch `html-version` para `main`
2. Ative o GitHub Pages nas configurações do repositório
3. Selecione a branch `main` como fonte

### Opção 2: Netlify (Recomendado)
1. Conecte seu repositório ao Netlify
2. Configure para fazer deploy da branch `html-version`
3. O arquivo `netlify.toml` já está configurado

### Opção 3: Vercel
1. Importe o projeto no Vercel
2. Selecione a branch `html-version`
3. Deploy automático

## 💰 Configuração do AdSense

O código já está configurado com seus IDs do AdSense:

- **Publisher ID**: `ca-pub-6382507327811351`
- **Slot Esquerdo**: `6916028297`
- **Slot Direito**: `7330961262`

### Verificação do AdSense

1. O arquivo `web/ads.txt` já está configurado
2. O código AdSense está no `<head>` do HTML
3. Os anúncios são carregados via JavaScript
4. Layout responsivo esconde anúncios em mobile (< 950px)

## 🎨 Personalização

### Cores e Tema

Edite o arquivo `styles.css` para personalizar:

```css
:root {
  --primary-color: #1976D2;
  --background-color: #F0F2F5;
  --card-background: #ffffff;
}
```

### Logos de Universidades

Adicione novos logos editando:

1. **HTML**: Adicione nova `<option>` no `<select id="predefinedLogo">`
2. **JavaScript**: Atualize o objeto `predefinedLogos`
3. **Assets**: Adicione o arquivo PNG na pasta `assets/logos/`

## 🔧 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Flexbox, Grid, Media Queries
- **JavaScript ES6+**: Módulos, Async/Await
- **html2canvas**: Captura de tela da carteirinha
- **jsPDF**: Geração de PDF
- **Google AdSense**: Monetização
- **PWA**: Suporte a Progressive Web App

## 🐛 Resolução de Problemas

### AdSense não aparece

1. Verifique se o domínio está aprovado no AdSense
2. Confirme se o `ads.txt` está acessível em `/ads.txt`
3. Aguarde até 24h após o deploy para aprovação

### Imagens não carregam

1. Verifique se a pasta `assets/logos/` existe
2. Confirme se os arquivos PNG estão no local correto
3. Teste o upload de imagens em HTTPS

### Download não funciona

1. Verifique se as bibliotecas CDN estão carregando
2. Teste em modo incógnito (pode ser bloqueio de popup)
3. Certifique-se de que o site está em HTTPS

## 📊 Performance

### Otimizações Implementadas

- ✅ Lazy loading de bibliotecas
- ✅ Compressão de imagens automática
- ✅ CSS minificado via media queries
- ✅ JavaScript otimizado com event delegation
- ✅ Fontes carregadas de forma assíncrona

### Métricas Esperadas

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3s

## 🔒 Segurança

- ✅ CSP (Content Security Policy) compatível
- ✅ Validação de tipos de arquivo
- ✅ Sanitização de inputs
- ✅ HTTPS obrigatório para recursos externos

## 📱 PWA (Progressive Web App)

O app pode ser instalado na tela inicial:

1. **Android**: Botão "Adicionar à tela inicial"
2. **iOS**: Safari > Compartilhar > "Adicionar à Tela de Início"
3. **Desktop**: Chrome > Ícone de instalar na barra de endereço

## 📈 Analíticos

Para adicionar Google Analytics:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🌐 Compatibilidade

### Navegadores Suportados

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Opera 47+

### Dispositivos Testados

- ✅ Desktop (1920x1080+)
- ✅ Tablet (768x1024)
- ✅ Mobile (360x640+)
- ✅ iPhone (375x667+)
- ✅ Android (360x640+)

---

## 📞 Contato

Para dúvidas ou suporte:
- **Email**: orbtechengenharia01@gmail.com
- **Repository**: https://github.com/orbtechengenharia01/gerador-carteirinha

---

🎉 **Versão HTML criada com sucesso!** 

Agora o Google AdSense conseguirá verificar e aprovar seu site sem problemas.
