// ===== DOM REFERENCES =====
const companySelect = document.getElementById('companySelect');
const billNumberInput = document.getElementById('billNumber');
const cartonCountInput = document.getElementById('cartonCount');
const stationInput = document.getElementById('station');
const transportInput = document.getElementById('transport');

const companySelectError = document.getElementById('companySelectError');
const billNumberError = document.getElementById('billNumberError');
const cartonCountError = document.getElementById('cartonCountError');
const stationError = document.getElementById('stationError');
const transportError = document.getElementById('transportError');

const totalSlipsCount = document.getElementById('totalSlipsCount');
const previewPmhmp = document.getElementById('previewPmhmp');
const previewCases = document.getElementById('previewCases');
const previewStation = document.getElementById('previewStation');
const previewTransport = document.getElementById('previewTransport');
const previewNote = document.getElementById('previewNote');
const previewSlip = document.getElementById('previewSlip');
const templateImage = document.getElementById('templateImage');

const generateBtn = document.getElementById('generateBtn');
const downloadPdfBtn = document.getElementById('downloadPdfBtn');
const printBtn = document.getElementById('printBtn');
const slipForm = document.getElementById('slipForm');
const slipsContainer = document.getElementById('slipsContainer');
const statusOverlay = document.getElementById('statusOverlay');
const statusText = document.getElementById('statusText');

// ===== COMPANY → TEMPLATE MAPPING =====
const companyTemplates = {
    'HARI MEDI PHARMA': 'HARI MEDI PHARMA.png',
    'ALIVIRA': 'ALIVIRA.png',
    'GANPATI': 'GANPATI.png',
    'NUTRICA': 'NUTRICA.png',
    'WOCKHARDT': 'WOCKHARDT.png'
};

// ===== COMPANY OVERLAY POSITIONS (PIXEL-MEASURED, PERCENTAGE BASED) =====
// top% is shifted 1.5% above the measured header baseline so text sits ABOVE dotted lines
const companyOverlayPositions = {
    'HARI MEDI PHARMA': {
        pm: { top: '30.5%', left: '32.3%' },
        cases: { top: '40.2%', left: '42.3%' },
        station: { top: '52.8%', left: '22.0%' },
        transport: { top: '65.9%', left: '29.6%' }
    },
    'ALIVIRA': {
        pm: { top: '32.7%', left: '19.3%' },
        cases: { top: '43.6%', left: '42.2%' },
        station: { top: '56.6%', left: '22.0%' },
        transport: { top: '70.3%', left: '27.0%' }
    },
    'GANPATI': {
        pm: { top: '32.2%', left: '18.6%' },
        cases: { top: '44.5%', left: '42.5%' },
        station: { top: '56.5%', left: '20.8%' },
        transport: { top: '68.4%', left: '28.5%' }
    },
    'NUTRICA': {
        pm: { top: '31.5%', left: '19.5%' },
        cases: { top: '42.4%', left: '43.7%' },
        station: { top: '55.1%', left: '22.1%' },
        transport: { top: '68.7%', left: '27.2%' }
    },
    'WOCKHARDT': {
        pm: { top: '33.4%', left: '20.6%' },
        cases: { top: '43.4%', left: '45.1%' },
        station: { top: '56.8%', left: '22.1%' },
        transport: { top: '70.2%', left: '27.2%' }
    }
};

function applyOverlayPositions(company) {
    const pos = companyOverlayPositions[company] || companyOverlayPositions['GANPATI'];

    previewPmhmp.style.top = pos.pm.top;
    previewPmhmp.style.left = pos.pm.left;
    previewPmhmp.style.fontSize = '20px';
    previewPmhmp.style.fontWeight = '700';

    previewCases.style.top = pos.cases.top;
    previewCases.style.left = pos.cases.left;
    previewCases.style.fontSize = '20px';
    previewCases.style.fontWeight = '700';

    previewStation.style.top = pos.station.top;
    previewStation.style.left = pos.station.left;
    previewStation.style.fontSize = '20px';
    previewStation.style.fontWeight = '700';

    previewTransport.style.top = pos.transport.top;
    previewTransport.style.left = pos.transport.left;
    previewTransport.style.fontSize = '20px';
    previewTransport.style.fontWeight = '700';

    if (previewSlip) {
        previewSlip.setAttribute('data-company', company || '');
    }
}

// ===== STATE =====
let generatedSlipsData = null;
let selectedCompany = '';
let templateImageBase64Cache = {}; // cache base64 for PDF generation

// ===== COMPANY SELECTION =====
companySelect.addEventListener('change', () => {
    selectedCompany = companySelect.value;
    clearError(companySelect);

    if (selectedCompany && companyTemplates[selectedCompany]) {
        const templateSrc = companyTemplates[selectedCompany];
        templateImage.src = templateSrc;
        templateImage.style.display = 'block';
        previewSlip.classList.add('active');
        applyOverlayPositions(selectedCompany);
        previewNote.textContent = 'Enter details to see data on the template';

        // Pre-cache base64 for this template (used in PDF generation)
        if (!templateImageBase64Cache[selectedCompany]) {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                templateImageBase64Cache[selectedCompany] = canvas.toDataURL('image/png');
            };
            img.src = templateSrc;
        }

        // Reset buttons when company changes
        downloadPdfBtn.disabled = true;
        printBtn.disabled = true;
        generatedSlipsData = null;
    } else {
        templateImage.style.display = 'none';
        previewSlip.classList.remove('active');
        previewSlip.removeAttribute('data-company');
        previewNote.textContent = 'Select a company to see the template';
    }

    updatePreview();
});

// ===== LIVE PREVIEW =====
function updatePreview() {
    applyOverlayPositions(selectedCompany);

    const billNum = billNumberInput.value.trim();
    const cartons = cartonCountInput.value.trim();
    const station = stationInput.value.trim();
    const transport = transportInput.value.trim();

    // Update P.M. (Bill Number)
    previewPmhmp.textContent = billNum || '';

    // Update Number of Cases
    previewCases.textContent = cartons || '';

    // Update Station
    previewStation.textContent = station || '';

    // Update Transport
    previewTransport.textContent = transport || '';

    // Update total slips count
    const cartonNum = parseInt(cartons, 10);
    if (!isNaN(cartonNum) && cartonNum > 0) {
        totalSlipsCount.textContent = cartonNum;
    } else {
        totalSlipsCount.textContent = '0';
    }

    // Update preview note
    if (selectedCompany) {
        if (billNum || cartons || station || transport) {
            previewNote.textContent = '';
        } else {
            previewNote.textContent = 'Enter details to see data on the template';
        }
    }

    // Auto-size text for long values
    autoSizeSlipValue(previewStation, station);
    autoSizeSlipValue(previewTransport, transport);
}

function autoSizeSlipValue(element, text) {
    element.style.fontSize = '22px';
    if (text.length > 22) {
        element.style.fontSize = '17px';
    }
    if (text.length > 32) {
        element.style.fontSize = '14px';
    }
}

// Attach live preview listeners
[billNumberInput, cartonCountInput, stationInput, transportInput].forEach(input => {
    input.addEventListener('input', () => {
        updatePreview();
        clearError(input);
    });
});

// ===== VALIDATION =====
function clearError(input) {
    input.classList.remove('input-error');
    const errorEl = document.getElementById(input.id + 'Error');
    if (errorEl) errorEl.textContent = '';
}

function showError(input, message) {
    input.classList.add('input-error');
    const errorEl = document.getElementById(input.id + 'Error');
    if (errorEl) errorEl.textContent = message;
}

function validateInputs() {
    let valid = true;

    // Company
    if (!companySelect.value) {
        showError(companySelect, 'Please select a company.');
        valid = false;
    }

    const billNum = billNumberInput.value.trim();
    const cartons = cartonCountInput.value.trim();
    const station = stationInput.value.trim();
    const transport = transportInput.value.trim();

    // Bill Number
    if (!billNum) {
        showError(billNumberInput, 'Please enter a valid bill number.');
        valid = false;
    } else if (!/^\d+$/.test(billNum)) {
        showError(billNumberInput, 'Bill number must contain only numbers.');
        valid = false;
    }

    // Carton/Cases Count
    if (!cartons) {
        showError(cartonCountInput, 'Number of cases must be a positive whole number.');
        valid = false;
    } else if (!/^\d+$/.test(cartons) || parseInt(cartons, 10) <= 0) {
        showError(cartonCountInput, 'Number of cases must be a positive whole number.');
        valid = false;
    }

    // Station
    if (!station) {
        showError(stationInput, 'Please enter a station.');
        valid = false;
    }

    // Transport
    if (!transport) {
        showError(transportInput, 'Please enter a transport name.');
        valid = false;
    }

    return valid;
}

// ===== GENERATE SLIPS =====
function createSlipHTML(company, billNumber, cases, station, transport) {
    const templateSrc = templateImageBase64Cache[company] || companyTemplates[company];
    const pos = companyOverlayPositions[company] || companyOverlayPositions['GANPATI'];

    return `
    <div class="print-slip" data-company="${company}">
        <img src="${templateSrc}" alt="${company} Slip" crossorigin="anonymous">
        <span class="overlay-pmhmp" style="top:${pos.pm.top}; left:${pos.pm.left};">${escapeHTML(billNumber)}</span>
        <span class="overlay-cases" style="top:${pos.cases.top}; left:${pos.cases.left};">${escapeHTML(cases)}</span>
        <span class="overlay-station" style="top:${pos.station.top}; left:${pos.station.left};">${escapeHTML(station)}</span>
        <span class="overlay-transport" style="top:${pos.transport.top}; left:${pos.transport.left};">${escapeHTML(transport)}</span>
    </div>`;
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function generateSlips() {
    const company = companySelect.value;
    const billNum = billNumberInput.value.trim();
    const cartons = parseInt(cartonCountInput.value.trim(), 10);
    const station = stationInput.value.trim();
    const transport = transportInput.value.trim();

    const cases = String(cartons);
    const slipsPerPage = 6;
    const totalPages = Math.ceil(cartons / slipsPerPage);

    // Group slips into A4 pages (2 columns x 3 rows = 6 slips per page)
    let containerHTML = '';
    for (let p = 0; p < totalPages; p++) {
        const start = p * slipsPerPage;
        const end = Math.min(start + slipsPerPage, cartons);
        let pageSlipsHTML = '';
        for (let i = start; i < end; i++) {
            pageSlipsHTML += createSlipHTML(company, billNum, cases, station, transport);
        }
        containerHTML += `<div class="a4-page">${pageSlipsHTML}</div>`;
    }

    slipsContainer.innerHTML = containerHTML;

    generatedSlipsData = {
        company,
        billNumber: billNum,
        cases,
        station,
        transport,
        count: cartons,
        totalPages
    };

    // Enable buttons
    downloadPdfBtn.disabled = false;
    printBtn.disabled = false;
}

// ===== FORM SUBMIT =====
slipForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    showStatus('Generating slips...');
    setTimeout(() => {
        generateSlips();
        hideStatus();
    }, 300);
});

// ===== PRINT =====
printBtn.addEventListener('click', () => {
    if (!generatedSlipsData) return;
    slipsContainer.style.display = 'block';
    window.print();
    setTimeout(() => {
        slipsContainer.style.display = 'none';
    }, 500);
});

// ===== DOWNLOAD PDF =====
downloadPdfBtn.addEventListener('click', async () => {
    if (!generatedSlipsData) return;
    showStatus('Creating PDF...');

    try {
        // Ensure slips are generated and visible off-screen for html2canvas
        slipsContainer.style.display = 'block';
        slipsContainer.style.position = 'fixed';
        slipsContainer.style.top = '0';
        slipsContainer.style.left = '0';
        slipsContainer.style.zIndex = '-9999';
        slipsContainer.style.background = '#fff';
        slipsContainer.style.width = '210mm';

        const companyShort = generatedSlipsData.company.replace(/\s+/g, '_');
        const opt = {
            margin: 0,
            filename: `${companyShort}_Slips_${generatedSlipsData.billNumber}_x${generatedSlipsData.count}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                letterRendering: true,
                scrollX: 0,
                scrollY: 0,
                windowWidth: 794 // 210mm in pixels at 96 DPI
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait'
            },
            pagebreak: { mode: ['css', 'legacy'], after: '.a4-page:not(:last-child)' }
        };

        await html2pdf().set(opt).from(slipsContainer).save();

        // Restore slips container state
        slipsContainer.style.display = 'none';
        slipsContainer.style.position = '';
        slipsContainer.style.top = '';
        slipsContainer.style.left = '';
        slipsContainer.style.zIndex = '';
        slipsContainer.style.width = '';
    } catch (error) {
        console.error('PDF generation error:', error);
        alert('Error generating PDF. Please try again.');
    }

    hideStatus();
});

// ===== STATUS OVERLAY =====
function showStatus(msg) {
    statusText.textContent = msg;
    statusOverlay.classList.add('active');
}

function hideStatus() {
    statusOverlay.classList.remove('active');
}

// ===== INIT =====
updatePreview();
