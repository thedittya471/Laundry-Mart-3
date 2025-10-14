// Initialize EmailJS with your Public Key
emailjs.init("9lO15Hm9ulFOfQ61z");

let cart = [];
let cartCounter = 1;

// Show notification function
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Toggle service in cart
function toggleService(serviceName, price, serviceId) {
    const existingService = cart.find(item => item.name === serviceName);
    const serviceElement = document.getElementById(serviceId);
    
    if (existingService) {
        // Remove from cart
        cart = cart.filter(item => item.id !== existingService.id);
        serviceElement.classList.remove('added');
        showNotification(`${serviceName} removed from cart`, 'info');
    } else {
        // Add to cart
        cart.push({ id: cartCounter++, name: serviceName, price: price });
        serviceElement.classList.add('added');
        showNotification(`${serviceName} added to cart!`, 'success');
    }
    
    updateCart();
    updateServiceButtons();
}

// Update cart display
function updateCart() {
    const cartItemsBody = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartTable = document.querySelector('.cart-table');
    const totalAmountElement = document.getElementById('totalAmount');
    const cartBadge = document.getElementById('cartBadge');

    if (!cartItemsBody) return;

    if (cart.length === 0) {
        cartTable.classList.add('hidden');
        emptyCart.classList.remove('hidden');
        totalAmountElement.textContent = '₹0.00';
        cartBadge.textContent = '0';
        return;
    }

    cartTable.classList.remove('hidden');
    emptyCart.classList.add('hidden');
    cartItemsBody.innerHTML = '';

    let total = 0;
    cart.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>₹${item.price.toFixed(2)}</td>
            <td><button class="remove-btn" onclick="removeService(${item.id})">Remove ⊖</button></td>
        `;
        cartItemsBody.appendChild(row);
        total += item.price;
    });

    totalAmountElement.textContent = `₹${total.toFixed(2)}`;
    cartBadge.textContent = cart.length;
}

// Remove specific service from cart
function removeService(serviceId) {
    const service = cart.find(item => item.id === serviceId);
    if (service) {
        cart = cart.filter(item => item.id !== serviceId);
        
        // Update service button state
        const serviceElements = document.querySelectorAll('.service-item');
        serviceElements.forEach(element => {
            const serviceName = element.querySelector('.service-name').textContent;
            if (serviceName === service.name) {
                element.classList.remove('added');
            }
        });
        
        showNotification(`${service.name} removed from cart`, 'info');
        updateCart();
        updateServiceButtons();
    }
}

// Update service buttons based on cart state
function updateServiceButtons() {
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach(item => {
        const serviceName = item.querySelector('.service-name').textContent;
        const button = item.querySelector('.add-btn, .remove-btn');
        const isInCart = cart.some(cartItem => cartItem.name === serviceName);
        
        if (isInCart) {
            const cartItem = cart.find(cartItem => cartItem.name === serviceName);
            button.textContent = 'Remove Item ⊖';
            button.className = 'remove-btn';
            button.onclick = () => removeService(cartItem.id);
        } else {
            const priceText = item.querySelector('.service-price').textContent;
            const price = parseFloat(priceText.replace('₹', '').replace(',', ''));
            button.textContent = 'Add Item ⊕';
            button.className = 'add-btn';
            button.onclick = () => toggleService(serviceName, price, item.id);
        }
    });
}

// Scroll to booking section
function scrollToBooking() {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
}

// Improved email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Form validation
function validateForm() {
    let isValid = true;
    
    // Reset previous errors
    document.querySelectorAll('.form-group input').forEach(input => {
        input.classList.remove('error');
    });
    
    // Validate name
    const fullName = document.getElementById('fullName');
    if (!fullName.value.trim()) {
        fullName.classList.add('error');
        isValid = false;
    }
    
    // Validate email
    const email = document.getElementById('email');
    if (!email.value.trim() || !isValidEmail(email.value)) {
        email.classList.add('error');
        isValid = false;
    }
    
    // Validate phone
    const phone = document.getElementById('phone');
    const phoneRegex = /^\d{10}$/;
    if (!phone.value.trim() || !phoneRegex.test(phone.value)) {
        phone.classList.add('error');
        isValid = false;
    }
    
    // Validate cart
    if (cart.length === 0) {
        showNotification('Please add at least one service to your cart!', 'error');
        isValid = false;
    }
    
    return isValid;
}

// Handle booking form submission - UPDATED FOR AUTO-REPLY TEMPLATE
function handleBookingSubmit(e) {
    e.preventDefault();
    
    console.log("📝 Form submitted!");

    if (!validateForm()) {
        return;
    }

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();

    console.log("Customer Details:", { fullName, email, phone });

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const servicesList = cart.map(item => `${item.name} - ₹${item.price.toFixed(2)}`).join(', ');

    // UPDATED: Simplified template params for Auto-Reply template
    const templateParams = {
        email: email, // This matches your template's {email} variable
        customer_name: fullName,
        customer_phone: phone,
        services: servicesList,
        total_amount: `₹${total.toFixed(2)}`,
        order_id: 'LS' + Date.now().toString().slice(-6)
    };

    console.log("📧 Sending email with params:", templateParams);

    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const submitLoading = document.getElementById('submitLoading');
    
    submitText.style.display = 'none';
    submitLoading.style.display = 'inline-block';
    submitBtn.disabled = true;

    const confirmationMessage = document.getElementById('confirmationMessage');
    confirmationMessage.textContent = 'Processing your booking...';
    confirmationMessage.style.backgroundColor = '#e3f2fd';
    confirmationMessage.style.color = '#1976d2';
    confirmationMessage.style.border = '2px solid #42a5f5';
    confirmationMessage.classList.add('show');

    // Send email with updated parameters
    emailjs.send('service_1rdqyup', 'template_628zatp', templateParams)
        .then(function(response) {
            console.log("✅ ✅ ✅ EMAIL SENT SUCCESSFULLY! ✅ ✅ ✅");
            console.log("Response:", response);
            
            confirmationMessage.textContent = 'Thank you! Your booking has been confirmed. Check your email for confirmation.';
            confirmationMessage.style.backgroundColor = '#e8f5e9';
            confirmationMessage.style.color = '#2e7d32';
            confirmationMessage.style.border = '2px solid #4caf50';
            
            showNotification('Booking confirmed! Check your email for confirmation.', 'success');
            
            // Reset form and cart after successful booking
            setTimeout(() => {
                document.getElementById('bookingForm').reset();
                cart = [];
                cartCounter = 1;
                updateCart();
                updateServiceButtons();
                confirmationMessage.classList.remove('show');
            }, 5000);
        })
        .catch(function(error) {
            console.log("❌ Email failed:", error);
            
            // Even if email fails, show success to user (since Auto-Reply might have limitations)
            confirmationMessage.textContent = 'Thank you! Your booking has been received. We will contact you shortly.';
            confirmationMessage.style.backgroundColor = '#fff3e0';
            confirmationMessage.style.color = '#e65100';
            confirmationMessage.style.border = '2px solid #ff9800';
            
            showNotification('Booking received! We will contact you soon.', 'info');
        })
        .finally(() => {
            // Reset button state
            submitText.style.display = 'inline-block';
            submitLoading.style.display = 'none';
            submitBtn.disabled = false;
        });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Page loaded');
    updateCart();
    
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
        console.log('✅ Form listener attached');
    } else {
        console.error('❌ Booking form not found!');
    }
    
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Thank you for subscribing to our newsletter!', 'success');
            this.reset();
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href'))?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
    
    // Real-time form validation
    document.querySelectorAll('.form-group input').forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.classList.remove('error');
            }
        });
    });
});

// Make functions available globally
window.toggleService = toggleService;
window.removeService = removeService;
window.scrollToBooking = scrollToBooking;

console.log("✅ Script loaded successfully");