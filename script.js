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
const elements = {
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

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateCardPreview();
    initializeResponsiveLayout();
});

// Initialize event listeners
function initializeEventListeners() {
    // Form inputs - real-time updates
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
    
    // Responsive layout
    window.addEventListener('resize', handleResize);
}

// Update card preview with current form values
function updateCardPreview() {
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
        elements.customLogoText.textContent = 'Escolher arquivo';
        
        // Update university name
        const universityName = predefinedLogos[selectedPredefinedLogo] || selectedPredefinedLogo.replace('.png', '').replace('-', ' ');
        elements.universityName.value = universityName.toUpperCase();
        
        // Show predefined logo
        showUniversityLogo(`assets/logos/${selectedPredefinedLogo}`);
        
        // Hide custom logo group
        elements.customLogoGroup.style.display = 'none';
    } else {
        // Clear university name
        elements.universityName.value = '';
        
        // Hide logo
        hideUniversityLogo();
        
        // Show custom logo group
        elements.customLogoGroup.style.display = 'block';
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
            elements.studentPhotoText.textContent = 'Foto escolhida';
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
                    elements.customLogoText.textContent = 'Logo personalizado escolhido';
                };
                reader.readAsDataURL(file);
            } else {
                alert('O logo da universidade deve ter 300x150 pixels.');
                elements.customLogoInput.value = '';
                elements.customLogoText.textContent = 'Escolher arquivo';
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
    elements.universityLogo.src = src;
    elements.universityLogo.style.display = 'block';
    
    // Update watermark
    const watermarkImg = document.createElement('img');
    watermarkImg.src = src;
    watermarkImg.alt = '';
    elements.cardWatermark.innerHTML = '';
    elements.cardWatermark.appendChild(watermarkImg);
}

// Hide university logo
function hideUniversityLogo() {
    elements.universityLogo.style.display = 'none';
    elements.universityLogo.src = '';
    elements.cardWatermark.innerHTML = '';
}

// Show loading overlay
function showLoading() {
    elements.loadingOverlay.style.display = 'flex';
}

// Hide loading overlay
function hideLoading() {
    elements.loadingOverlay.style.display = 'none';
}

// Download as PNG
async function downloadAsPng() {
    showLoading();
    
    try {
        // Use html2canvas to capture the card
        const canvas = await html2canvas(elements.studentCard, {
            scale: 3,
            backgroundColor: '#ffffff',
            useCORS: true,
            allowTaint: true,
            logging: false,
            width: 450,
            height: 260
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
    showLoading();
    
    try {
        // First, capture as canvas
        const canvas = await html2canvas(elements.studentCard, {
            scale: 3,
            backgroundColor: '#ffffff',
            useCORS: true,
            allowTaint: true,
            logging: false,
            width: 450,
            height: 260
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
        const imgHeight = (260 / 450) * imgWidth; // Maintain aspect ratio
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

// Initialize responsive layout
function initializeResponsiveLayout() {
    handleResize();
}

// Handle window resize
function handleResize() {
    const desktopLayout = document.getElementById('desktopLayout');
    const mobileLayout = document.getElementById('mobileLayout');
    
    if (window.innerWidth > 950) {
        desktopLayout.style.display = 'flex';
        mobileLayout.style.display = 'none';
    } else {
        desktopLayout.style.display = 'none';
        mobileLayout.style.display = 'block';
        
        // Copy card content to mobile version
        const mobileCard = document.getElementById('studentCardMobile');
        if (mobileCard) {
            mobileCard.innerHTML = elements.studentCard.innerHTML;
        }
    }
}

// Utility function to create rhombus pattern (not needed in CSS version, but kept for reference)
function createRhombusPattern() {
    // This is handled by CSS background patterns
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
    
    // Update UI to notify the user they can add to home screen
    // You can show a custom install button here if desired
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

// Initialize AdSense ads
function initializeAds() {
    try {
        (adsbygoogle = window.adsbygoogle || []).push({});
        (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
        console.log('AdSense não carregado ainda');
        // Retry after a delay
        setTimeout(initializeAds, 1000);
    }
}

// Initialize ads when page is loaded
window.addEventListener('load', function() {
    setTimeout(initializeAds, 500);
});

// Export functions for global access (if needed)
window.CardGenerator = {
    updateCardPreview,
    downloadAsPng,
    downloadAsPdf,
    showLoading,
    hideLoading
};