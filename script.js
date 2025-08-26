document.addEventListener('DOMContentLoaded', () => {
  const inputBox = document.getElementById('input-box');
  const resultBox = document.querySelector('.result-box');
  const container = document.getElementById('content');
  const categoryFilter = document.getElementById('category-filter');
  const sortBy = document.getElementById('sort-by');
  const cartCount = document.querySelector('.cart-count');
  const cartNotification = document.getElementById('cart-notification');
  let products = [];
  let cart = [];

  // Menu toggle
  const MenuItems = document.getElementById("MenuItems");
  MenuItems.style.maxHeight = "0px";
  window.menutoggle = function () {
    MenuItems.style.maxHeight = MenuItems.style.maxHeight === "0px" ? "200px" : "0px";
  }

  // Fetch products
  fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(json => {
      products = json;
      renderProducts(products);
    })
    .catch(() => {
      container.innerHTML = '<p class="error-message">Failed to load products. Please try again later.</p>';
    });

  function renderProducts(list) {
    container.innerHTML = '';
    if (list.length === 0) {
      container.innerHTML = '<p class="error-message">No products found.</p>';
      return;
    }
    
    list.forEach(p => {
      const card = document.createElement('div');
      card.classList.add('product-card');
      card.innerHTML = `
        <img src="${p.image}" alt="${p.title}" onerror="this.src='https://via.placeholder.com/150'">
        <h4>${p.title}</h4>
        <p>Category: ${p.category}</p>
        <h5>Price: $${p.price}</h5>
        <span>${p.rating ? `Rating: ${p.rating.rate}/5 (${p.rating.count})` : 'No Rating'}</span>
        <button class="add-to-cart" data-id="${p.id}">Add to Cart</button>
      `;
      container.appendChild(card);
    });
    
    // Add event listeners to Add to Cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', (e) => {
        const productId = parseInt(e.target.getAttribute('data-id'));
        addToCart(productId);
      });
    });
  }

  function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
      // Check if product is already in cart
      const existingItem = cart.find(item => item.id === productId);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1
        });
      }
      
      // Update cart count
      updateCartCount();
      
      // Show notification
      cartNotification.style.display = 'block';
      setTimeout(() => {
        cartNotification.style.display = 'none';
      }, 3000);
    }
  }

  function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
  }

  // Search input listener
  inputBox.addEventListener('input', () => {
    const query = inputBox.value.toLowerCase().trim();
    if (!query) {
      resultBox.style.display = 'none';
      renderProducts(products);
      return;
    }
    const filtered = products.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
    filtered.length ? displaySuggestions(filtered) : noResults();
  });

  function displaySuggestions(list) {
    const ul = document.createElement('ul');
    list.forEach(p => {
      const li = document.createElement('li');
      li.innerHTML = `<img src="${p.image}" alt="${p.title}" width="40" style="vertical-align:middle; margin-right:8px;"> ${p.title}`;
      li.addEventListener('click', () => {
        inputBox.value = p.title;
        resultBox.style.display = 'none';
        renderProducts([p]);
      });
      ul.appendChild(li);
    });
    resultBox.innerHTML = '';
    resultBox.appendChild(ul);
    resultBox.style.display = 'block';
  }

  function noResults() {
    resultBox.style.display = 'none';
    container.innerHTML = '<p class="error-message">No matching products.</p>';
  }

  // Filter by category
  categoryFilter.addEventListener('change', () => {
    const category = categoryFilter.value;
    let filteredProducts = products;
    
    if (category !== 'all') {
      filteredProducts = products.filter(p => p.category === category);
    }
    
    renderProducts(filteredProducts);
  });

  // Sort products
  sortBy.addEventListener('change', () => {
    const sortOption = sortBy.value;
    let sortedProducts = [...products];
    
    switch(sortOption) {
      case 'price-asc':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sortedProducts.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
        break;
      default:
        // Keep original order
        break;
    }
    
    renderProducts(sortedProducts);
  });

  // Close suggestions on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-box')) {
      resultBox.style.display = 'none';
    }
  });
});

// Add to cart functionality for index.html
document.addEventListener('DOMContentLoaded', () => {
  // Get cart from localStorage or initialize empty array
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Add event listeners to Add to Cart buttons
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart')) {
      const productId = parseInt(e.target.getAttribute('data-id'));
      addToCart(productId);
    }
  });
  

  // Add product to cart functionality for allowing Add to Cart to display in the cart page.
  function addToCart(productId) {
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: productId,
        quantity: 1
      });
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show notification
    showCartNotification();
    
    // Update cart count
    updateCartCount();
  }
  
  // Show cart notification
  function showCartNotification() {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.cart-notification');
    
    if (!notification) {
      notification = document.createElement('div');
      notification.classList.add('cart-notification');
      notification.textContent = 'Item added to cart!';
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        display: none;
      `;
      document.body.appendChild(notification);
    }
    
    // Show notification with animation
    notification.style.display = 'block';
    setTimeout(() => {
      notification.style.display = 'none';
    }, 3000);
  }
  
  // Update cart count in header
  function updateCartCount() {
    let cartCount = document.querySelector('.cart-count');
    
    if (!cartCount) {
      const cartIcon = document.querySelector('img[alt="Cart"]');
      cartCount = document.createElement('span');
      cartCount.classList.add('cart-count');
      cartIcon.parentNode.insertBefore(cartCount, cartIcon.nextSibling);
    }
    
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
  }
  
  // Initialize cart count on page load
  updateCartCount();
});