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
          <h6>${pic.resolution}</h6>
          <p>${pic.description}</p>
        </figcaption>
        <div class="image-container">
          <button class="like">❤️</button>
          <button class="edit" data-id="${pic.id}">edit</button>
          <a href="${pic.image_url}" download="${pic.name}">⬇️</a>
          <button class="delete" data-id="${pic.id}">Delete</button>
        </div>
        <div class="comments-container"></div>
      </figure>
    `;
  });
  imagesContainer.innerHTML = photos;

  let editButtons = document.querySelectorAll(".edit");
  editButtons.forEach(button => {
    button.addEventListener("click", function(e) {
      e.preventDefault();
      const id = this.dataset.id;
      const figure = this.closest("figure");
      const imageEl= figure.querySelector("img")
      const nameEl = figure.querySelector("h4");
      const resolutionEl = figure.querySelector("h6");
      const descriptionEl = figure.querySelector("p");
      const newImage=prompt("Enter New Image",imageEl.textContent);
      const newName = prompt("Enter New Wallpaper Name", nameEl.textContent);
      const newResolution = prompt("Enter New Resolution", resolutionEl.textContent);
      const newDescription = prompt("Enter New Description", descriptionEl.textContent);
      
      if (newImage && newName && newResolution && newDescription) {
        fetch(`http://localhost:3000/wallpapers/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            image_url:newImage,
            name: newName,
            resolution: newResolution,
            description: newDescription
          })
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error updating wallpaper');
          }
          return response.json();
        })
        .then(data => {
          imageEl.textContent =newImage;
          nameEl.textContent = newName;
          resolutionEl.textContent = newResolution;
          descriptionEl.textContent = newDescription;
          console.log('Wallpaper updated');
        })
        .catch(error => console.error(error));
      }
    });
  });

  const commentForm = document.getElementById('comment-form');
  commentForm.addEventListener('submit', handleCommentSubmit);

  function handleCommentSubmit(event) {
    event.preventDefault();
  
    const name = document.getElementById('name-input').value;
    const comment = document.getElementById('comment-input').value;
    const figure = event.target.closest('figure');
    //const id = figure.dataset.id;
  
    fetch(`http://localhost:3000/wallpapers/comments/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        comment: comment
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error submitting comment');
      }
      return response.json();
    })
    .then(data => {
      const commentsContainer = figure.querySelector('.comments-container');
      const commentEl = document.createElement('div');
      commentEl.innerHTML = `
        <p><strong>${data.name}:</strong> ${data.comment}</p>
      `;
      commentsContainer.appendChild(commentEl);
      console.log('Comment submitted');
    })
    .catch(error => console.error(error));
  
    // Clear the form
    document.getElementById('name-input').value = '';
    document.getElementById('comment-input').value = '';
  }
  

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
  