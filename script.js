// Global variables
let studentImageBytes = null;
let customUniversityLogoBytes = null;
let selectedPredefinedLogo = 'Nenhum';

// Predefined logos mapping
const predefinedLogos = {
    'FGV.png': 'FGV',
    'MACKENZIE.png': 'MACKENZIE',
    'PUC-Minas.png': 'PUC MINAS',
    'PUC-SP.png': 'PUC SP',
    'UFF.png': 'UFF',
    'UFMG.png': 'UFMG',
    'UFRJ.png': 'UFRJ',
    'UFU.png': 'UFU',
    'UFV.png': 'UFV',
    'UNESP.png': 'UNESP',
    'UNIBH.png': 'UNIBH',
    'UNICAMP.png': 'UNICAMP',
    'UNIUBE.png': 'UNIUBE',
    'USP.png': 'USP'
};

// DOM Elements
let elements = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    initializeEventListeners();
    updateCardPreview();
});

// Initialize DOM elements
function initializeElements() {
    elements = {
        // Form inputs
        studentName: document.getElementById('studentName'),
        studentCourse: document.getElementById('studentCourse'),
        studentRgm: document.getElementById('studentRgm'),
        studentValidity: document.getElementById('studentValidity'),
        universityName: document.getElementById('universityName'),
        predefinedLogo: document.getElementById('predefinedLogo'),
        studentPhotoInput: document.getElementById('studentPhotoInput'),
        customLogoInput: document.getElementById('customLogoInput'),
        
        // Display elements
        studentNameDisplay: document.getElementById('studentNameDisplay'),
        studentCourseDisplay: document.getElementById('studentCourseDisplay'),
        studentRgmDisplay: document.getElementById('studentRgmDisplay'),
        studentValidityDisplay: document.getElementById('studentValidityDisplay'),
        universityNameDisplay: document.getElementById('universityNameDisplay'),
        studentPhoto: document.getElementById('studentPhoto'),
        universityLogo: document.getElementById('universityLogo'),
        universityLogoContainer: document.getElementById('universityLogoContainer'),
        cardWatermark: document.getElementById('cardWatermark'),
        
        // File input texts
        studentPhotoText: document.getElementById('studentPhotoText'),
        customLogoText: document.getElementById('customLogoText'),
        customLogoGroup: document.getElementById('customLogoGroup'),
        
        // Buttons
        downloadPng: document.getElementById('downloadPng'),
        downloadPdf: document.getElementById('downloadPdf'),
        
        // Card
        studentCard: document.getElementById('studentCard'),
        
        // Loading
        loadingOverlay: document.getElementById('loadingOverlay')
    };
}

// Initialize event listeners
function initializeEventListeners() {
    // Form inputs - real-time updates
    if (elements.studentName) {
        elements.studentName.addEventListener('input', updateCardPreview);
        elements.studentCourse.addEventListener('input', updateCardPreview);
        elements.studentRgm.addEventListener('input', updateCardPreview);
        elements.studentValidity.addEventListener('input', updateCardPreview);
        elements.universityName.addEventListener('input', updateCardPreview);
        
        // Predefined logo selection
        elements.predefinedLogo.addEventListener('change', handlePredefinedLogoChange);
        
        // File inputs
        elements.studentPhotoInput.addEventListener('change', handleStudentPhotoChange);
        elements.customLogoInput.addEventListener('change', handleCustomLogoChange);
        
        // Download buttons
        elements.downloadPng.addEventListener('click', downloadAsPng);
        elements.downloadPdf.addEventListener('click', downloadAsPdf);
    }
}

// Update card preview with current form values
function updateCardPreview() {
    if (!elements.studentNameDisplay) return;
    
    // Update text fields
    elements.studentNameDisplay.textContent = elements.studentName.value || 'Nome do Aluno';
    elements.studentCourseDisplay.textContent = elements.studentCourse.value || 'Curso do Aluno';
    elements.studentRgmDisplay.textContent = elements.studentRgm.value || '0000000-0';
    elements.studentValidityDisplay.textContent = elements.studentValidity.value || '12/2027';
    elements.universityNameDisplay.textContent = (elements.universityName.value || 'Nome da Universidade').toUpperCase();
}

// Handle predefined logo change
function handlePredefinedLogoChange() {
    selectedPredefinedLogo = elements.predefinedLogo.value;
    
    if (selectedPredefinedLogo !== 'Nenhum') {
        // Clear custom logo
        customUniversityLogoBytes = null;
        if (elements.customLogoText) {
            elements.customLogoText.textContent = 'Escolher arquivo';
        }
        
        // Update university name
        const universityName = predefinedLogos[selectedPredefinedLogo] || selectedPredefinedLogo.replace('.png', '').replace('-', ' ');
        elements.universityName.value = universityName.toUpperCase();
        
        // Show predefined logo
        showUniversityLogo(`assets/logos/${selectedPredefinedLogo}`);
        
        // Hide custom logo group
        if (elements.customLogoGroup) {
            elements.customLogoGroup.style.display = 'none';
        }
    } else {
        // Clear university name
        elements.universityName.value = '';
        
        // Hide logo
        hideUniversityLogo();
        
        // Show custom logo group
        if (elements.customLogoGroup) {
            elements.customLogoGroup.style.display = 'block';
        }
    }
    
    updateCardPreview();
}

// Handle student photo change
function handleStudentPhotoChange(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            studentImageBytes = e.target.result;
            
            // Create and display image
            const img = document.createElement('img');
            img.src = studentImageBytes;
            img.alt = 'Foto do estudante';
            
            // Clear current content and add image
            elements.studentPhoto.innerHTML = '';
            elements.studentPhoto.appendChild(img);
            
            // Update file input text
            if (elements.studentPhotoText) {
                elements.studentPhotoText.textContent = 'Foto escolhida';
            }
        };
        reader.readAsDataURL(file);
    }
}

// Handle custom logo change
function handleCustomLogoChange(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const img = new Image();
        img.onload = function() {
            if (img.width === 300 && img.height === 150) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    customUniversityLogoBytes = e.target.result;
                    selectedPredefinedLogo = 'Nenhum';
                    elements.predefinedLogo.value = 'Nenhum';
                    
                    // Show custom logo
                    showUniversityLogo(customUniversityLogoBytes);
                    
                    // Update file input text
                    if (elements.customLogoText) {
                        elements.customLogoText.textContent = 'Logo personalizado escolhido';
                    }
                };
                reader.readAsDataURL(file);
            } else {
                alert('O logo da universidade deve ter 300x150 pixels.');
                elements.customLogoInput.value = '';
                if (elements.customLogoText) {
                    elements.customLogoText.textContent = 'Escolher arquivo';
                }
                customUniversityLogoBytes = null;
            }
        };
        
        const reader = new FileReader();
        reader.onload = function(e) {
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// Show university logo
function showUniversityLogo(src) {
    if (elements.universityLogo) {
        elements.universityLogo.src = src;
        elements.universityLogo.style.display = 'block';
    }
    
    // Update watermark
    if (elements.cardWatermark) {
        const watermarkImg = document.createElement('img');
        watermarkImg.src = src;
        watermarkImg.alt = '';
        elements.cardWatermark.innerHTML = '';
        elements.cardWatermark.appendChild(watermarkImg);
    }
}

// Hide university logo
function hideUniversityLogo() {
    if (elements.universityLogo) {
        elements.universityLogo.style.display = 'none';
        elements.universityLogo.src = '';
    }
    
    if (elements.cardWatermark) {
        elements.cardWatermark.innerHTML = '';
    }
}

// Show loading overlay
function showLoading() {
    if (elements.loadingOverlay) {
        elements.loadingOverlay.style.display = 'flex';
    }
}

// Hide loading overlay
function hideLoading() {
    if (elements.loadingOverlay) {
        elements.loadingOverlay.style.display = 'none';
    }
}

// Download as PNG
async function downloadAsPng() {
    if (!window.html2canvas) {
        alert('Erro: Biblioteca de captura não carregada. Recarregue a página e tente novamente.');
        return;
    }
    
    showLoading();
    
    try {
        // Use html2canvas to capture the card
        const canvas = await html2canvas(elements.studentCard, {
            scale: 3,
            backgroundColor: '#ffffff',
            useCORS: true,
            allowTaint: true,
            logging: false,
            width: elements.studentCard.offsetWidth,
            height: elements.studentCard.offsetHeight,
            foreignObjectRendering: true
        });
        
        // Convert to blob and download
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'carteirinha-estudante.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            hideLoading();
        }, 'image/png', 1.0);
        
    } catch (error) {
        console.error('Erro ao gerar PNG:', error);
        alert('Erro ao gerar a imagem. Tente novamente.');
        hideLoading();
    }
}

// Download as PDF
async function downloadAsPdf() {
    if (!window.html2canvas || !window.jspdf) {
        alert('Erro: Bibliotecas necessárias não carregadas. Recarregue a página e tente novamente.');
        return;
    }
    
    showLoading();
    
    try {
        // First, capture as canvas
        const canvas = await html2canvas(elements.studentCard, {
            scale: 3,
            backgroundColor: '#ffffff',
            useCORS: true,
            allowTaint: true,
            logging: false,
            width: elements.studentCard.offsetWidth,
            height: elements.studentCard.offsetHeight,
            foreignObjectRendering: true
        });
        
        // Convert canvas to image data
        const imgData = canvas.toDataURL('image/png', 1.0);
        
        // Create PDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // Calculate dimensions to center the card
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = 120; // Card width in mm
        const imgHeight = (canvas.height / canvas.width) * imgWidth; // Maintain aspect ratio
        const x = (pdfWidth - imgWidth) / 2;
        const y = (pdfHeight - imgHeight) / 2;
        
        // Add title
        pdf.setFontSize(24);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Carteirinha de Estudante', pdfWidth / 2, 30, { align: 'center' });
        
        // Add image
        pdf.addImage(imgData, 'PNG', x, y - 10, imgWidth, imgHeight);
        
        // Add footer
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(128, 128, 128);
        pdf.text('Gerado por Gerador de Carteirinha App', pdfWidth / 2, pdfHeight - 20, { align: 'center' });
        
        // Save PDF
        pdf.save('carteirinha-estudante.pdf');
        
        hideLoading();
        
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        alert('Erro ao gerar o PDF. Tente novamente.');
        hideLoading();
    }
}

// Error handling
window.addEventListener('error', function(event) {
    console.error('JavaScript Error:', event.error);
    hideLoading();
});

// Unhandled promise rejection
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled Promise Rejection:', event.reason);
    hideLoading();
    event.preventDefault();
});

// PWA Installation
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
});

// Service Worker registration (if you want to add PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment below if you create a service worker
        // navigator.serviceWorker.register('/service-worker.js')
        //     .then(function(registration) {
        //         console.log('SW registered: ', registration);
        //     })
        //     .catch(function(registrationError) {
        //         console.log('SW registration failed: ', registrationError);
        //     });
    });
}

// Export functions for global access
window.CardGenerator = {
    updateCardPreview,
    downloadAsPng,
    downloadAsPdf,
    showLoading,
    hideLoading
};

// ========================================
// LIVEPIX FUNCTIONS
// ========================================

// Abrir modal LivePix
function openLivePixModal() {
    const modal = document.getElementById('livePixModal');
    const form = document.getElementById('livePixForm');
    const qr = document.getElementById('livePixQR');
    const success = document.getElementById('livePixSuccess');
    
    if (modal && form && qr && success) {
        modal.style.display = 'flex';
        form.style.display = 'block';
        qr.style.display = 'none';
        success.style.display = 'none';
        
        // Limpar formulário
        document.getElementById('pixUsername').value = '';
        document.getElementById('pixLogoName').value = '';
        document.getElementById('pixMessage').value = '';
    }
}

// Fechar modal
function closeLivePixModal() {
    const modal = document.getElementById('livePixModal');
    if (modal) {
        modal.style.display = 'none';
        
        // Limpar interval se existir
        if (window.paymentCheckInterval) {
            clearInterval(window.paymentCheckInterval);
            window.paymentCheckInterval = null;
        }
        
        // Limpar QR Code
        const qrContainer = document.getElementById('qrCodeContainer');
        if (qrContainer) {
            qrContainer.innerHTML = '';
        }
    }
}

// Criar pagamento PIX
async function createPixPayment(event) {
    event.preventDefault();
    
    const username = document.getElementById('pixUsername').value;
    const logoName = document.getElementById('pixLogoName').value;
    const message = document.getElementById('pixMessage').value;
    
    if (!username || !logoName) {
        alert('Por favor, preencha seu nome e o logo desejado.');
        return;
    }
    
    showLoading();
    
    try {
        const response = await fetch('/.netlify/functions/create-pix', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, logoName, message })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.data && data.data.reference) {
            // Salvar referência para verificar status
            window.pixReference = data.data.reference;
            
            // Mostrar QR Code
            document.getElementById('livePixForm').style.display = 'none';
            document.getElementById('livePixQR').style.display = 'block';
            
            // Limpar container antes de gerar novo QR
            const qrContainer = document.getElementById('qrCodeContainer');
            qrContainer.innerHTML = '';
            
            // Renderizar QR Code
            if (window.QRCode && data.data.qrCode) {
                new QRCode(qrContainer, {
                    text: data.data.qrCode,
                    width: 256,
                    height: 256,
                    colorDark: '#000000',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.H
                });
            } else {
                qrContainer.innerHTML = '<p>Erro ao gerar QR Code. Tente novamente.</p>';
            }
            
            // Iniciar verificação automática
            startPaymentCheck();
        } else {
            throw new Error('Resposta inválida da API');
        }
        
    } catch (error) {
        console.error('Erro ao criar PIX:', error);
        alert('Erro ao processar pagamento. Verifique sua conexão e tente novamente.');
    } finally {
        hideLoading();
    }
}

// Verificar status do pagamento
let paymentCheckInterval;
let paymentCheckAttempts = 0;
const MAX_CHECK_ATTEMPTS = 60; // 5 minutos (60 × 5s)

function startPaymentCheck() {
    paymentCheckAttempts = 0;
    
    // Limpar interval anterior se existir
    if (paymentCheckInterval) {
        clearInterval(paymentCheckInterval);
    }
    
    // Iniciar novo interval
    paymentCheckInterval = setInterval(checkPaymentStatus, 5000);
}

async function checkPaymentStatus() {
    if (!window.pixReference) {
        clearInterval(paymentCheckInterval);
        return;
    }
    
    paymentCheckAttempts++;
    
    // Timeout após 5 minutos
    if (paymentCheckAttempts >= MAX_CHECK_ATTEMPTS) {
        clearInterval(paymentCheckInterval);
        console.log('Timeout: Verificação de pagamento encerrada após 5 minutos');
        return;
    }
    
    try {
        const response = await fetch(`/.netlify/functions/check-payment?ref=${window.pixReference}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'paid') {
            clearInterval(paymentCheckInterval);
            document.getElementById('livePixQR').style.display = 'none';
            document.getElementById('livePixSuccess').style.display = 'block';
        }
    } catch (error) {
        console.error('Erro ao verificar pagamento:', error);
        // Não interrompe o loop em caso de erro temporário
    }
}

// Fechar modal ao clicar fora
window.addEventListener('click', function(event) {
    const modal = document.getElementById('livePixModal');
    if (event.target === modal) {
        closeLivePixModal();
    }
});
