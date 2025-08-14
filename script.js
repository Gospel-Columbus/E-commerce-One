document.addEventListener('DOMContentLoaded', () => {
  const inputBox = document.getElementById('input-box');
  const resultBox = document.querySelector('.result-box');
  const container = document.getElementById('content');
  let products = [];

  // Fetch product list
  fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(json => {
      products = json;
      renderProducts(products);
    })
    .catch(err => {
      console.error('Fetch error:', err);
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
        <img src="${p.image}" alt="${p.title}"
             onerror="this.onerror=null;this.src='fallback-image.jpg'; this.alt='Image not available';">
        <h4>${p.title}</h4>
        <p>Category: ${p.category}</p>
        <h5>Price: $${p.price}</h5>
        <span>${p.rating ? `Rating: ${p.rating.rate}/5 (${p.rating.count})` : 'No Rating'}</span>
      `;
      container.appendChild(card);
    });
  }

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

    if (filtered.length) {
      displaySuggestions(filtered);
    } else {
      resultBox.style.display = 'none';
      container.innerHTML = '<p class="error-message">No matching products.</p>';
    }
  });

  function displaySuggestions(list) {
    const ul = document.createElement('ul');
    list.forEach(p => {
      const li = document.createElement('li');
      li.innerHTML = `<img src="${p.image}" alt="${p.title}" width="40" style="vertical-align:middle; margin-right:8px;"
                      onerror="this.onerror=null;this.src='fallback-image.jpg'; this.alt='';"> ${p.title}`;
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
});