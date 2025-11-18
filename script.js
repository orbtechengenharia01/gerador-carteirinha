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

// Mobile compatibility
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Fix para iOS
if (isMobileDevice()) {
    document.addEventListener('touchstart', function() {}, true);
}

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

// Handle student photo change (CORRIGIDO)
function handleStudentPhotoChange(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            studentImageBytes = e.target.result;
            
            // Criar e display imagem COM crossOrigin
            const img = document.createElement('img');
            img.crossOrigin = 'anonymous'; // ✅ IMPORTANTE!
            img.src = studentImageBytes;
            img.alt = 'Foto do estudante';
            
            // Clear e adicionar
            elements.studentPhoto.innerHTML = '';
            elements.studentPhoto.appendChild(img);
            
            // Update text
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

// Show university logo (CORRIGIDO)
function showUniversityLogo(src) {
    if (elements.universityLogo) {
        elements.universityLogo.crossOrigin = 'anonymous'; // ✅
        elements.universityLogo.src = src;
        elements.universityLogo.style.display = 'block';
    }
    
    // Update watermark
    if (elements.cardWatermark) {
        const watermarkImg = document.createElement('img');
        watermarkImg.crossOrigin = 'anonymous'; // ✅
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


// Download as PNG - COM SOMBRA
async function downloadAsPng() {
    if (!window.domtoimage) {
        alert('Erro: Biblioteca de captura não carregada. Recarregue a página e tente novamente.');
        return;
    }
    
    showLoading();
    
    try {
        await waitForImagesToLoad();
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Criar wrapper com padding para sombra
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `
            padding: 30px;
            background: white;
            display: inline-block;
        `;
        
        // Clonar card
        const clone = elements.studentCard.cloneNode(true);
        clone.style.cssText = `
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
            border-radius: 16px;
        `;
        
        wrapper.appendChild(clone);
        document.body.appendChild(wrapper);
        wrapper.style.position = 'fixed';
        wrapper.style.top = '-9999px';
        wrapper.style.left = '-9999px';
        
        // Capturar wrapper
        const dataUrl = await domtoimage.toPng(wrapper, {
            quality: 1.0,
            bgcolor: '#ffffff'
        });
        
        // Remover wrapper
        document.body.removeChild(wrapper);
        
        // Download
        const link = document.createElement('a');
        link.download = `carteirinha-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
        
        hideLoading();
        
    } catch (error) {
        console.error('Erro ao gerar PNG:', error);
        alert('Erro ao gerar a imagem. Tente novamente.');
        hideLoading();
    }
}


// Download as PDF - Usando dom-to-image
async function downloadAsPdf() {
    if (!window.domtoimage || !window.jspdf) {
        alert('Erro: Bibliotecas necessárias não carregadas. Recarregue a página e tente novamente.');
        return;
    }
    
    showLoading();
    
    try {
        await waitForImagesToLoad();
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const dataUrl = await domtoimage.toPng(elements.studentCard, {
            quality: 1.0,
            bgcolor: '#ffffff'
        });
        
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        // Calcular dimensões mantendo proporção
        const imgWidth = 160;
        const imgHeight = (260 / 450) * imgWidth; // proporção do card
        const x = (pdfWidth - imgWidth) / 2;
        const y = (pdfHeight - imgHeight) / 2;
        
        pdf.setFontSize(24);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Carteirinha de Estudante', pdfWidth / 2, 30, { align: 'center' });
        
        pdf.addImage(dataUrl, 'PNG', x, y - 10, imgWidth, imgHeight, undefined, 'FAST');
        
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(128, 128, 128);
        pdf.text('Gerado por geradorcarteirinha.site', pdfWidth / 2, pdfHeight - 20, { align: 'center' });
        
        pdf.save(`carteirinha-${Date.now()}.pdf`);
        
        hideLoading();
        
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        alert('Erro ao gerar o PDF. Tente novamente.');
        hideLoading();
    }
}

// Função auxiliar: Aguardar carregamento de imagens
function waitForImagesToLoad() {
    return new Promise((resolve) => {
        const images = elements.studentCard.querySelectorAll('img');
        
        if (images.length === 0) {
            resolve();
            return;
        }
        
        let loadedCount = 0;
        const totalImages = images.length;
        
        const checkComplete = () => {
            loadedCount++;
            if (loadedCount === totalImages) {
                // Aguardar mais 100ms para garantir
                setTimeout(resolve, 100);
            }
        };
        
        images.forEach(img => {
            if (img.complete) {
                checkComplete();
            } else {
                img.addEventListener('load', checkComplete);
                img.addEventListener('error', checkComplete);
            }
        });
    });
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

// ============================================
// MERCADO PAGO
// ============================================

// Abrir modal Mercado Pago
function openMercadoPagoModal() {
    document.getElementById('mercadoPagoModal').style.display = 'block';
}

// Fechar modal Mercado Pago
function closeMercadoPagoModal() {
    document.getElementById('mercadoPagoModal').style.display = 'none';
    // Limpar campos
    document.getElementById('mpUsername').value = '';
    document.getElementById('mpLogoName').value = '';
}

// Criar pagamento Mercado Pago
async function createMercadoPagoPayment(event) {
    event.preventDefault();
    
    const username = document.getElementById('mpUsername').value;
    const logoName = document.getElementById('mpLogoName').value;
    
    if (!username || !logoName) {
        alert('Por favor, preencha seu nome e o logo desejado.');
        return;
    }
    
    showLoading();
    
    try {
        const response = await fetch('/api/create-mercadopago', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                username: username.trim(), 
                logoName: logoName.trim()
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao criar pagamento');
        }
        
        const data = await response.json();
        
        if (data.init_point) {
            // Redirecionar para checkout Mercado Pago
            window.location.href = data.init_point;
        } else {
            throw new Error('URL de pagamento não retornada');
        }
        
    } catch (error) {
        console.error('Erro ao criar pagamento:', error);
        alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
        hideLoading();
    }
}

// Fechar modal ao clicar fora (atualizar window.onclick)
window.onclick = function(event) {
    const mpModal = document.getElementById('mercadoPagoModal');
    if (event.target == mpModal) {
        closeMercadoPagoModal();
    }
}
