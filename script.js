document.addEventListener('DOMContentLoaded', () => {
  // Toggle mobile menu
  const menuIcon = document.querySelector('.menu-icon');
  const navUl = document.querySelector('#menu-items');

  if (menuIcon && navUl) {
    menuIcon.addEventListener('click', () => {
      navUl.classList.toggle('open');
    });
  }

  // Show loading state
  const container = document.getElementById('content');
  if (!container) {
    console.error('Container element with ID "content" not found');
    return;
  }
  container.innerHTML = '<p>Loading products...</p>';

  // Fetch products
  fetch('https://fakestoreapi.com/products')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((json) => {
      container.innerHTML = ''; // Clear loading state
      json.forEach((data) => {
        // Create product card
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        // Image
        const img = document.createElement('img');
        img.src = data.image;
        img.alt = data.title;
        img.onerror = () => {
          img.src = 'fallback-image.jpg';
          img.alt = 'Image not available';
        };

        // Title
        const title = document.createElement('h4');
        title.textContent = data.title;

        // ID
        const id = document.createElement('p');
        id.textContent = `ID: ${data.id}`;

        // Category
        const category = document.createElement('p');
        category.textContent = `Category: ${data.category}`;

        // Price
        const price = document.createElement('h5');
        price.textContent = `Price: $${data.price}`;

        // Rating
        const rating = document.createElement('span');
        rating.textContent = data.rating
          ? `Rating: ${data.rating.rate}/5 (${data.rating.count} reviews)`
          : 'Rating: Not available';

        // Description
        const description = document.createElement('p');
        description.classList.add('description');
        description.textContent = data.description.length > 100
          ? `${data.description.slice(0, 100)}...`
          : data.description;

        // Append elements to product card
        productCard.appendChild(img);
        productCard.appendChild(title);
        productCard.appendChild(id);
        productCard.appendChild(category);
        productCard.appendChild(price);
        productCard.appendChild(rating);
        productCard.appendChild(description);

        // Append product card to container
        container.appendChild(productCard);
      });
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      container.innerHTML = '<p class="error-message">Failed to load products. Please try again later.</p>';
    });
});