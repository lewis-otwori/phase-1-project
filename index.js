const imagesContainer = document.querySelector(".grid");
const searchInput = document.querySelector("#searchInput");
const natureLink = document.querySelector("#nature-link");
const cityLink = document.querySelector("#city-link");
const abstractLink = document.querySelector("#abstract-link");
const animalsLink = document.querySelector("#animals-link");
const navLinks = document.querySelectorAll('.nav-link');
const addForm = document.querySelector("#add-Form");

function renderPhotos(data) {
  let photos = '';
  data.forEach(pic => {
    photos += `
      <figure>
        <img src="${pic.image_url}" class="border">
        <figcaption>
          <h4>${pic.name}</h4>
          ${pic.resolution}
          <h5>${pic.description}</h5>
        </figcaption>
        <div class="image-container">
          <button class="like">❤️</button>
          <a href="${pic.image_url}" download="${pic.name}">⬇️</a>
          <button class="delete" data-id="${pic.id}">Delete</button>
        </div>
      </figure>
    `;
  });
  imagesContainer.innerHTML = photos;

  let likeButtons = document.querySelectorAll(".like");
  likeButtons.forEach(button => {
    button.addEventListener("click", function() {
      this.style.backgroundColor = 'red';
    });
  });

  let deleteButtons = document.querySelectorAll(".delete");
  deleteButtons.forEach(button => {
    button.addEventListener("click", function() {
      const id = this.dataset.id;
      fetch(`http://localhost:3000/wallpapers/${id}`, {
        method: 'DELETE'
      })
      .then(() => {
        const fig = this.closest("figure");
        fig.parentNode.removeChild(fig);
      })
      .catch(error => console.error(error));
    });
  });
}

fetch('http://localhost:3000/wallpapers')
  .then(res => res.json())
  .then(data => {
    renderPhotos(data);

    searchInput.addEventListener("input", function() {
      const inputValue = searchInput.value.toLowerCase();
      const filteredData = data.filter(pic => pic.name.toLowerCase().includes(inputValue));
      renderPhotos(filteredData);
    });
  })

  //   navLinks.forEach(link => {
  //     link.addEventListener('click', (event) => {
  //       event.preventDefault();
  //       const targetId = link.getAttribute('href').substring(1);
  //       const targetSection = document.getElementById(targetId);
  //       targetSection.scrollIntoView({ behavior: 'smooth' });
  //     });
  //   });

  //   natureLink.addEventListener("click", function() {
  //     const filteredData = data.filter(pic => pic.category === "nature");
  //     renderPhotos(filteredData);
  //   });

  //   cityLink.addEventListener("click", function() {
  //     const filteredData = data.filter(pic => pic.category === "city");
  //     renderPhotos(filteredData);
  //   });

  //   abstractLink.addEventListener("click", function() {
  //     const filteredData = data.filter(pic => pic.category === "abstract");
  //     renderPhotos(filteredData);
  //   });

  //   animalsLink.addEventListener("click", function() {
  //     const filteredData = data.filter(pic => pic.category === "animals");
  //     renderPhotos(filteredData);
  //   });
  // });

  addForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const name = addForm.elements.name.value;
    const imageUrl = addForm.elements.image_url.value;
    const category = addForm.elements.category.value;
    const resolution = addForm.elements.resolution.value;
    const description = addForm.elements.description.value;
  
    fetch(`http://localhost:3000/wallpapers?name=${name}`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          alert('The image exists');
        } else {
          const newImage = {
            name: name,
            image_url: imageUrl,
            category: category,
            resolution: resolution,
            description: description
          };
  
          fetch('http://localhost:3000/wallpapers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newImage),
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Error submitting data');
            }
            return response.json();
          })
          .then(data => {
            renderPhotos(data);
            addForm.reset();
          })
          .catch(error => console.error(error));
        }
      })
      .catch(error => console.error(error));
  });
  