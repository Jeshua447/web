<script>
        let cart = [];
        let cartCount = 0;

        // FUNCIÓN MODIFICADA PARA INCLUIR ICONO
        function addToCart(productName, price, icon = '🧢') {
            // Buscar si el producto ya existe en el carrito
            const existingItem = cart.find(item => item.name === productName);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    name: productName, 
                    price: price, 
                    icon: icon,
                    quantity: 1,
                    id: Date.now() // ID único para identificar el item
                });
            }
            
            cartCount++;
            updateCartDisplay();
            
            // Animación de éxito
            const button = event.target;
            const originalText = button.textContent;
            button.textContent = '¡Agregado! ✓';
            button.style.background = 'linear-gradient(45deg, #27ae60, #2ecc71)';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = 'linear-gradient(45deg, #4ecdc4, #44a08d)';
            }, 2000);
            
            showNotification(`${productName} agregada al carrito`);
        }

        // NUEVA FUNCIÓN PARA MOSTRAR/OCULTAR CARRITO
        function toggleCart() {
            const cartSection = document.getElementById('carrito');
            const otherSections = document.querySelectorAll('main > section:not(#carrito)');
            
            if (cartSection.classList.contains('active')) {
                // Ocultar carrito y mostrar otras secciones
                cartSection.classList.remove('active');
                otherSections.forEach(section => section.style.display = 'block');
            } else {
                // Mostrar carrito y ocultar otras secciones
                cartSection.classList.add('active');
                otherSections.forEach(section => section.style.display = 'none');
                renderCart();
            }
        }

        // NUEVA FUNCIÓN PARA RENDERIZAR EL CARRITO
        function renderCart() {
            const cartContent = document.getElementById('cart-content');
            
            if (cart.length === 0) {
                cartContent.innerHTML = `
                    <div class="empty-cart">
                        <div class="empty-cart-icon">🛒</div>
                        <h3>Tu carrito está vacío</h3>
                        <p style="color: #666; margin-bottom: 2rem;">¡Agrega algunos productos increíbles!</p>
                        <a href="#" class="continue-shopping" onclick="toggleCart()">Continuar Comprando</a>
                    </div>
                `;
                return;
            }

            const cartItemsHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-icon">${item.icon}</div>
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <div class="cart-item-price">$${item.price.toLocaleString()} MXN</div>
                        </div>
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                        </div>
                        <button class="remove-btn" onclick="removeFromCart(${item.id})">Eliminar</button>
                    </div>
                </div>
            `).join('');

            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

            cartContent.innerHTML = `
                <div class="cart-items">
                    ${cartItemsHTML}
                </div>
                <div class="cart-summary">
                    <div class="cart-total">
                        Total: <span class="cart-total-price">$${total.toLocaleString()} MXN</span>
                    </div>
                    <p style="color: #666; margin-bottom: 1rem;">${totalItems} producto${totalItems !== 1 ? 's' : ''} en tu carrito</p>
                    <button class="checkout-btn" onclick="checkout()">Proceder al Pago 🚀</button>
                    <br><br>
                    <a href="#" class="continue-shopping" onclick="toggleCart()" style="font-size: 0.9rem;">← Continuar Comprando</a>
                </div>
            `;
        }

        // NUEVA FUNCIÓN PARA CAMBIAR CANTIDAD
        function changeQuantity(itemId, change) {
            const item = cart.find(item => item.id === itemId);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    removeFromCart(itemId);
                    return;
                }
                updateCartDisplay();
                renderCart();
            }
        }

        // NUEVA FUNCIÓN PARA ELIMINAR DEL CARRITO
        function removeFromCart(itemId) {
            const itemIndex = cart.findIndex(item => item.id === itemId);
            if (itemIndex > -1) {
                const removedItem = cart[itemIndex];
                cartCount -= removedItem.quantity;
                cart.splice(itemIndex, 1);
                updateCartDisplay();
                renderCart();
                showNotification(`${removedItem.name} eliminada del carrito`);
            }
        }

        // NUEVA FUNCIÓN PARA ACTUALIZAR DISPLAY DEL CARRITO
        function updateCartDisplay() {
            cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
            document.querySelector('.cart-count').textContent = cartCount;
        }

        // NUEVA FUNCIÓN PARA CHECKOUT
        function checkout() {
            if (cart.length === 0) return;
            
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            showNotification(`¡Compra realizada por ${total.toLocaleString()} MXN! Gracias por tu compra 🎉`);
            
            // Limpiar carrito
            cart = [];
            cartCount = 0;
            updateCartDisplay();
            renderCart();
        }

        function showNotification(message) {
            const notification = document.createElement('div');
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(45deg, #27ae60, #2ecc71);
                color: white;
                padding: 1rem 2rem;
                border-radius: 10px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                z-index: 1000;
                animation: slideIn 0.5s ease;
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        // Formulario de venta
        document.getElementById('sellForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const productData = {};
            
            for (let [key, value] of formData.entries()) {
                productData[key] = value;
            }
            
            showNotification('¡Tu gorra ha sido publicada exitosamente!');
            this.reset();
        });

        // Smooth scrolling para navegación
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Animación de entrada para las tarjetas de productos
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.product-card, .feature-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            observer.observe(card);
        });

        // Agregar estilos de animación dinámicamente
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
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


    // Actualización inicial del display del carrito al cargar la página
    updateCartDisplay();
});
