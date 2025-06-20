// Global variables
let selectedAmount = 0;
let processingFeeRate = 0.029; // 2.9% processing fee
let processingFeeFixed = 0.30; // $0.30 fixed fee

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadEventData();
    setupEventListeners();
    updatePreview();
});

// Load event data from session storage or API
function loadEventData() {
    // In a real app, you might want to fetch this from the API again
    // For now, we'll use the data from the previous page
    const eventData = sessionStorage.getItem('eventData');
    
    if (eventData) {
        const parsedData = JSON.parse(eventData);
        populateEventSummary(parsedData);
    } else {
        // Fallback to placeholder data
        document.getElementById('childName').textContent = 'Emma';
        document.getElementById('eventName').textContent = "Emma's 8th Birthday";
    }
}

// Populate event summary
function populateEventSummary(data) {
    document.getElementById('childName').textContent = data.child_name;
    document.getElementById('eventName').textContent = data.event_name;
}

// Setup event listeners
function setupEventListeners() {
    // Amount option buttons
    const amountOptions = document.querySelectorAll('.amount-option');
    amountOptions.forEach(option => {
        option.addEventListener('click', function() {
            selectAmount(parseFloat(this.dataset.amount));
        });
    });

    // Custom amount input
    const customAmountInput = document.getElementById('customAmount');
    customAmountInput.addEventListener('input', function() {
        const amount = parseFloat(this.value) || 0;
        if (amount > 0) {
            // Clear selected amount options
            amountOptions.forEach(opt => opt.classList.remove('selected'));
            selectAmount(amount);
        }
    });

    // Skip button
    document.getElementById('skipButton').addEventListener('click', function() {
        skipDonation();
    });

    // Donate button
    document.getElementById('donateButton').addEventListener('click', function() {
        if (validateDonationForm()) {
            processDonation();
        }
    });
}

// Select donation amount
function selectAmount(amount) {
    selectedAmount = amount;
    
    // Update UI
    const amountOptions = document.querySelectorAll('.amount-option');
    amountOptions.forEach(option => {
        const optionAmount = parseFloat(option.dataset.amount);
        if (optionAmount === amount) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });

    // Clear custom amount if it doesn't match
    const customAmountInput = document.getElementById('customAmount');
    if (customAmountInput.value && parseFloat(customAmountInput.value) !== amount) {
        customAmountInput.value = '';
    }

    updatePreview();
    updateDonateButton();
}

// Update donation preview
function updatePreview() {
    const processingFee = calculateProcessingFee(selectedAmount);
    const total = selectedAmount + processingFee;

    document.getElementById('previewAmount').textContent = formatCurrency(selectedAmount);
    document.getElementById('processingFee').textContent = formatCurrency(processingFee);
    document.getElementById('totalAmount').textContent = formatCurrency(total);
}

// Calculate processing fee
function calculateProcessingFee(amount) {
    if (amount <= 0) return 0;
    return Math.max(processingFeeFixed, amount * processingFeeRate);
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Update donate button state
function updateDonateButton() {
    const donateButton = document.getElementById('donateButton');
    
    if (selectedAmount > 0) {
        donateButton.disabled = false;
        donateButton.innerHTML = '<i class="fas fa-heart"></i><span>Complete Donation</span>';
    } else {
        donateButton.disabled = true;
        donateButton.innerHTML = '<i class="fas fa-heart"></i><span>Select Amount to Donate</span>';
    }
}

// Validate donation form (only if amount is selected)
function validateDonationForm() {
    if (selectedAmount <= 0) {
        showError('Please select a donation amount.');
        return false;
    }

    // Donor information is optional, so no validation needed
    clearError();
    return true;
}

// Skip donation
function skipDonation() {
    const skipButton = document.getElementById('skipButton');
    const originalText = skipButton.innerHTML;
    
    // Show loading state
    skipButton.disabled = true;
    skipButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Skipping...</span>';
    
    // Simulate processing delay
    setTimeout(() => {
        showSuccess('Thank you for your message! No donation made.');
        
        // Reset button
        skipButton.disabled = false;
        skipButton.innerHTML = originalText;
        
        // In a real app, you would:
        // 1. Save the message/video data
        // 2. Send confirmation
        // 3. Redirect to a thank you page
        
        console.log('Donation skipped - message/video data saved');
        
    }, 1500);
}

// Process donation (non-functional as requested)
function processDonation() {
    const donateButton = document.getElementById('donateButton');
    const originalText = donateButton.innerHTML;
    
    // Show loading state
    donateButton.disabled = true;
    donateButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Processing...</span>';
    
    // Simulate processing delay
    setTimeout(() => {
        // In a real app, this would submit to a payment processor
        showSuccess('Thank you for your donation! This feature is currently non-functional as requested.');
        
        // Reset button
        donateButton.disabled = false;
        donateButton.innerHTML = originalText;
        
        // Store donation data (in a real app, this would be sent to your server)
        const donationData = {
            amount: selectedAmount,
            processingFee: calculateProcessingFee(selectedAmount),
            total: selectedAmount + calculateProcessingFee(selectedAmount),
            donorName: document.getElementById('donorName').value.trim() || 'Anonymous',
            donorMessage: document.getElementById('donorMessage').value.trim() || '',
            timestamp: new Date().toISOString()
        };
        
        console.log('Donation data:', donationData);
        
        // In a real implementation, you would:
        // 1. Send this data to your payment processor (Stripe, PayPal, etc.)
        // 2. Handle the payment response
        // 3. Store the donation in your database
        // 4. Send confirmation emails
        // 5. Redirect to a success page
        
    }, 2000);
}

// Show error message
function showError(message) {
    clearError();
    
    const errorDiv = document.createElement('div');
    errorDiv.id = 'errorMessage';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #e74c3c;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1001;
        max-width: 300px;
        font-size: 14px;
        animation: slideInRight 0.3s ease;
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
        clearError();
    }, 5000);
}

// Show success message
function showSuccess(message) {
    clearError();
    
    const successDiv = document.createElement('div');
    successDiv.id = 'successMessage';
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4ade80;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1001;
        max-width: 300px;
        font-size: 14px;
        animation: slideInRight 0.3s ease;
    `;
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    // Remove after 8 seconds
    setTimeout(() => {
        clearError();
    }, 8000);
}

// Clear error/success messages
function clearError() {
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    
    if (errorMessage) {
        errorMessage.remove();
    }
    if (successMessage) {
        successMessage.remove();
    }
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Handle form submission on Enter key
document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const donateButton = document.getElementById('donateButton');
        if (!donateButton.disabled) {
            donateButton.click();
        }
    }
});

// Add some helpful tooltips for amount options
document.addEventListener('DOMContentLoaded', function() {
    const amountOptions = document.querySelectorAll('.amount-option');
    amountOptions.forEach(option => {
        const amount = parseFloat(option.dataset.amount);
        option.title = `Donate $${amount} to help make this birthday special!`;
    });
}); 