// State management
let materials = [];
let materialCounter = 0;

// Constants
const IVA_RATE = 0.16;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    addInitialMaterial();
});

// Initialize event listeners
function initializeEventListeners() {
    document.getElementById('addMaterialBtn').addEventListener('click', addMaterial);
    document.getElementById('sendQuotationBtn').addEventListener('click', sendQuotation);
}

// Add a new material row
function addMaterial() {
    materialCounter++;
    const materialId = `material-${materialCounter}`;
    
    const materialItem = document.createElement('div');
    materialItem.className = 'material-item';
    materialItem.id = materialId;
    
    materialItem.innerHTML = `
        <div class="material-header">
            <h4>Material ${materialCounter}</h4>
            <button type="button" class="btn btn-danger" onclick="removeMaterial('${materialId}')">
                Eliminar
            </button>
        </div>
        <div class="material-grid">
            <div class="form-group">
                <label>Nombre del Material</label>
                <input type="text" class="material-name" placeholder="Ej: Cemento, Arena, Ladrillos" required>
            </div>
            <div class="form-group">
                <label>Cantidad</label>
                <input type="number" class="material-quantity" min="0" step="0.01" value="1" required>
            </div>
            <div class="form-group">
                <label>Unidad</label>
                <select class="material-unit">
                    <option value="kg">kg</option>
                    <option value="ton">Toneladas</option>
                    <option value="m³">m³</option>
                    <option value="m²">m²</option>
                    <option value="unidad">Unidad</option>
                    <option value="bulto">Bulto</option>
                    <option value="litro">Litro</option>
                    <option value="pieza">Pieza</option>
                </select>
            </div>
            <div class="form-group">
                <label>Precio Unitario ($)</label>
                <input type="number" class="material-price" min="0" step="0.01" value="0" required>
            </div>
        </div>
        <div class="material-total">
            Total: $<span class="item-total">0.00</span>
        </div>
    `;
    
    document.getElementById('materialsContainer').appendChild(materialItem);
    
    // Add event listeners for calculation
    const inputs = materialItem.querySelectorAll('.material-quantity, .material-price');
    inputs.forEach(input => {
        input.addEventListener('input', calculateTotals);
    });
    
    materials.push(materialId);
    calculateTotals();
}

// Add initial material on page load
function addInitialMaterial() {
    addMaterial();
}

// Remove a material
function removeMaterial(materialId) {
    const materialElement = document.getElementById(materialId);
    if (materialElement) {
        materialElement.remove();
        materials = materials.filter(id => id !== materialId);
        calculateTotals();
    }
}

// Calculate all totals
function calculateTotals() {
    let subtotal = 0;
    
    // Calculate each material total
    materials.forEach(materialId => {
        const materialElement = document.getElementById(materialId);
        if (materialElement) {
            const quantity = parseFloat(materialElement.querySelector('.material-quantity').value) || 0;
            const price = parseFloat(materialElement.querySelector('.material-price').value) || 0;
            const itemTotal = quantity * price;
            
            materialElement.querySelector('.item-total').textContent = itemTotal.toFixed(2);
            subtotal += itemTotal;
        }
    });
    
    // Calculate IVA and total
    const iva = subtotal * IVA_RATE;
    const total = subtotal + iva;
    
    // Update summary
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('iva').textContent = `$${iva.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Validate client form
function validateClientForm() {
    const clientName = document.getElementById('clientName').value.trim();
    const clientEmail = document.getElementById('clientEmail').value.trim();
    const clientPhone = document.getElementById('clientPhone').value.trim();
    
    if (!clientName || !clientEmail || !clientPhone) {
        showMessage('Por favor, complete todos los datos del cliente requeridos.', 'error');
        return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail)) {
        showMessage('Por favor, ingrese un correo electrónico válido.', 'error');
        return false;
    }
    
    return true;
}

// Validate materials
function validateMaterials() {
    if (materials.length === 0) {
        showMessage('Por favor, agregue al menos un material.', 'error');
        return false;
    }
    
    for (let materialId of materials) {
        const materialElement = document.getElementById(materialId);
        if (materialElement) {
            const name = materialElement.querySelector('.material-name').value.trim();
            const quantity = parseFloat(materialElement.querySelector('.material-quantity').value) || 0;
            const price = parseFloat(materialElement.querySelector('.material-price').value) || 0;
            
            if (!name) {
                showMessage('Por favor, ingrese el nombre de todos los materiales.', 'error');
                return false;
            }
            
            if (quantity <= 0) {
                showMessage('La cantidad de los materiales debe ser mayor a 0.', 'error');
                return false;
            }
            
            if (price < 0) {
                showMessage('El precio de los materiales no puede ser negativo.', 'error');
                return false;
            }
        }
    }
    
    return true;
}

// Collect all form data
function collectFormData() {
    // Client data
    const clientData = {
        name: document.getElementById('clientName').value.trim(),
        email: document.getElementById('clientEmail').value.trim(),
        phone: document.getElementById('clientPhone').value.trim(),
        address: document.getElementById('clientAddress').value.trim()
    };
    
    // Materials data
    const materialsData = [];
    materials.forEach(materialId => {
        const materialElement = document.getElementById(materialId);
        if (materialElement) {
            const name = materialElement.querySelector('.material-name').value.trim();
            const quantity = parseFloat(materialElement.querySelector('.material-quantity').value) || 0;
            const unit = materialElement.querySelector('.material-unit').value;
            const price = parseFloat(materialElement.querySelector('.material-price').value) || 0;
            const total = quantity * price;
            
            materialsData.push({
                name,
                quantity,
                unit,
                price,
                total
            });
        }
    });
    
    // Calculate totals
    const subtotal = materialsData.reduce((sum, item) => sum + item.total, 0);
    const iva = subtotal * IVA_RATE;
    const total = subtotal + iva;
    
    return {
        client: clientData,
        materials: materialsData,
        summary: {
            subtotal,
            iva,
            total
        }
    };
}

// Generate email body
function generateEmailBody(data) {
    let body = `COTIZACIÓN DE MATERIALES DE CONSTRUCCIÓN\n`;
    body += `${'='.repeat(50)}\n\n`;
    
    body += `DATOS DEL CLIENTE:\n`;
    body += `-`.repeat(50) + `\n`;
    body += `Nombre: ${data.client.name}\n`;
    body += `Email: ${data.client.email}\n`;
    body += `Teléfono: ${data.client.phone}\n`;
    if (data.client.address) {
        body += `Dirección de Obra: ${data.client.address}\n`;
    }
    body += `\n`;
    
    body += `MATERIALES SOLICITADOS:\n`;
    body += `-`.repeat(50) + `\n`;
    data.materials.forEach((material, index) => {
        body += `\n${index + 1}. ${material.name}\n`;
        body += `   Cantidad: ${material.quantity} ${material.unit}\n`;
        body += `   Precio Unitario: $${material.price.toFixed(2)}\n`;
        body += `   Total: $${material.total.toFixed(2)}\n`;
    });
    
    body += `\n` + `=`.repeat(50) + `\n`;
    body += `RESUMEN DE COTIZACIÓN:\n`;
    body += `-`.repeat(50) + `\n`;
    body += `Subtotal: $${data.summary.subtotal.toFixed(2)}\n`;
    body += `IVA (16%): $${data.summary.iva.toFixed(2)}\n`;
    body += `TOTAL: $${data.summary.total.toFixed(2)}\n`;
    body += `\n`;
    body += `${'='.repeat(50)}\n`;
    body += `\nGracias por su preferencia.\n`;
    body += `7 Vueltas - Materiales de Construcción\n`;
    
    return body;
}

// Send quotation
function sendQuotation() {
    // Validate recipient email
    const recipientEmail = document.getElementById('recipientEmail').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!recipientEmail || !emailRegex.test(recipientEmail)) {
        showMessage('Por favor, ingrese un correo electrónico válido para enviar la cotización.', 'error');
        return;
    }
    
    // Validate form
    if (!validateClientForm() || !validateMaterials()) {
        return;
    }
    
    // Collect data
    const data = collectFormData();
    
    // Generate email content
    const emailSubject = encodeURIComponent(`Cotización de Materiales - ${data.client.name}`);
    const emailBody = encodeURIComponent(generateEmailBody(data));
    
    // Create mailto link
    const mailtoLink = `mailto:${recipientEmail}?subject=${emailSubject}&body=${emailBody}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show success message
    showMessage('Abriendo su cliente de correo electrónico para enviar la cotización...', 'success');
    
    // Log data for debugging (in production, this would be sent to a backend)
    console.log('Quotation Data:', data);
}

// Show status message
function showMessage(message, type) {
    const statusElement = document.getElementById('statusMessage');
    statusElement.textContent = message;
    statusElement.className = `status-message ${type}`;
    
    // Auto-hide after 5 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            statusElement.className = 'status-message';
        }, 5000);
    }
}

// Make removeMaterial available globally
window.removeMaterial = removeMaterial;
