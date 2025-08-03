
  fetch('https://fakestoreapi.com/products')
  .then((response) => response.json())
  .then((json) => {
    json.forEach((data) => {
      console.log(data.image);
      // Create an image element
      const img = document.createElement("img");
      img.src = data.image;
      img.alt = data.title;
      img.alt = data.id;
      img.alt = data.category;
      img.alt = data.price;
      img.alt = data.rating;
      img.alt = data.description;
      img.style.width = "200px";
      img.style.margin = "10px"; 

      // Create a paragraph for the title (optional)
      const title = document.createElement("h1");
      title.textContent = `Title: ${data.title}`;

      const id = document.createElement("p");
      id.textContent = `Id: ${data.id}`;


      const category = document.createElement("p");
      category.textContent = `Category: ${data.category}`;


      const price = document.createElement("h5");
      price.textContent = `Price: ${data.price}`;


      const rating = document.createElement("span");
      rating.textContent = `Rating: ${data.rating.rate} (from ${data.rating.count} reviews)`;


      const description = document.createElement("p");
      description.textContent = `Description: ${data.description}`;



      // Appending 
      const container = document.getElementById("content");
      container.appendChild(img);
      container.appendChild(title);
      container.appendChild(id);
      container.appendChild(category);
      container.appendChild(price);
      container.appendChild(rating);
      container.appendChild(description);
    });
  })
  .catch((error) => console.error("Error fetching data:", error));