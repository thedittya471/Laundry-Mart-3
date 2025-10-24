emailjs.init("9lO15Hm9ulFOfQ61z");

let cart = [];

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", function() {
        navMenu.classList.toggle("active");
    });
}

document.querySelectorAll(".nav-menu a").forEach(link => {
    link.addEventListener("click", () => {
        if (navMenu) navMenu.classList.remove("active");
    });
});

function scrollToServices() {
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: "smooth" });
    }
}

function toggleService(button) {
    const serviceItem = button.closest(".service-item");
    if (!serviceItem) return;
    
    const serviceName = serviceItem.dataset.name;
    const servicePrice = parseFloat(serviceItem.dataset.price);
    const serviceEmoji = serviceItem.querySelector(".service-emoji").textContent;
    
    const existingItemIndex = cart.findIndex(item => item.name === serviceName);
    
    if (existingItemIndex > -1) {
        cart.splice(existingItemIndex, 1);
        button.textContent = "Add Item";
        button.classList.remove("added");
    } else {
        cart.push({
            name: serviceName,
            price: servicePrice,
            emoji: serviceEmoji
        });
        button.textContent = "Remove Item";
        button.classList.add("added");
    }
    
    updateCart();
}

function updateCart() {
    const cartItemsContainer = document.getElementById("cartItems");
    const cartTotalElement = document.getElementById("cartTotal");
    
    if (!cartItemsContainer || !cartTotalElement) return;
    
    cartItemsContainer.innerHTML = "";
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">No items added yet</p>';
        cartTotalElement.textContent = "₹0.00";
        return;
    }
    
    let total = 0;
    cart.forEach((item, index) => {
        const itemElement = document.createElement("div");
        itemElement.className = "cart-item";
        itemElement.innerHTML = `
            <div class="cart-item-sno">${index + 1}.</div>
            <div class="cart-item-name">
                <span class="cart-item-emoji">${item.emoji}</span>
                ${item.name}
            </div>
            <div class="cart-item-price">₹${item.price.toFixed(2)}</div>
        `;
        cartItemsContainer.appendChild(itemElement);
        total += item.price;
    });

    cartTotalElement.textContent = `₹${total.toFixed(2)}`;
}

document.addEventListener("DOMContentLoaded", function() {
    const bookingForm = document.getElementById("bookingForm");
    if (bookingForm) {
        bookingForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            if (cart.length === 0) {
                alert("Please add at least one service to your cart before booking.");
                return;
            }
            
            const nameInput = document.getElementById("name");
            const emailInput = document.getElementById("email");
            const phoneInput = document.getElementById("phone");
            const successMessage = document.getElementById("successMessage");
            
            if (!nameInput || !emailInput || !phoneInput) {
                alert("Please fill in all required fields.");
                return;
            }
            
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim(),
                services: cart.map(item => `• ${item.emoji} ${item.name} - ₹${item.price}`).join('\n'),
                total: cart.reduce((sum, item) => sum + item.price, 0).toFixed(2),
                booking_date: new Date().toLocaleDateString()
            };
            
            if (!formData.name || !formData.email || !formData.phone) {
                alert("Please fill in all required fields.");
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                alert("Please enter a valid email address.");
                return;
            }
            
            const phoneRegex = /^[0-9\-\+\(\)\s]{10,}$/;
            if (!phoneRegex.test(formData.phone)) {
                alert("Please enter a valid phone number.");
                return;
            }
            
            const bookNowBtn = document.querySelector(".book-now-btn");
            const originalText = bookNowBtn.textContent;
            bookNowBtn.textContent = "Booking...";
            bookNowBtn.disabled = true;

            emailjs.send("service_1rdqyup", "template_5hv16cd", formData)
                .then(function(response) {
                    console.log("Booking email sent successfully!", response);
                    
                    successMessage.textContent = "Thank you For Booking the Service We will get back to you soon!";
                    successMessage.style.display = "block";

                    bookingForm.reset();
                    cart = [];
                    updateCart();

                    document.querySelectorAll(".add-btn").forEach(btn => {
                        btn.textContent = "Add Item";
                        btn.classList.remove("added");
                    });

                    bookNowBtn.textContent = originalText;
                    bookNowBtn.disabled = false;
                    
                    setTimeout(() => {
                        successMessage.style.display = "none";
                    }, 5000);
                    
                }, function(error) {
                    console.error("EmailJS Error:", error);
                    alert("There was an error processing your booking. Please try again.");
                    
                    bookNowBtn.textContent = originalText;
                    bookNowBtn.disabled = false;
                });
        });
    }
});

function subscribeNewsletter() {
    const name = document.getElementById("newsletterName").value;
    const email = document.getElementById("newsletterEmail").value;
    
    if (name === "" || email === "") {
        alert("Please fill all the fields");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }
    alert("Thank you for subscribing to our newsletter!");
    
    document.getElementById("newsletterName").value = "";
    document.getElementById("newsletterEmail").value = "";
}
