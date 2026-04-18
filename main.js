// navbar
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");
  const links = document.querySelectorAll(".nav-link");

  // Toggle menu
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      menu.classList.toggle("hidden");
    });
  }

  // Close menu + active link
  links.forEach((link) => {
    link.addEventListener("click", function () {
      // close mobile menu
      menu.classList.add("hidden");

      // remove active styles
      links.forEach((l) => {
        l.classList.remove(
          "text-purple-600",
          "border-b-2",
          "border-purple-600",
        );
      });

      // add active to clicked
      this.classList.add("text-purple-600", "border-b-2", "border-purple-600");
    });
  });
});
// navbar

//Home

document.addEventListener("DOMContentLoaded", () => {
  let current = 0;
  const slider = document.getElementById("slider");
  const slides = slider.children;
  const total = slides.length;
  const dotsContainer = document.getElementById("dots");

  for (let i = 0; i < total; i++) {
    const dot = document.createElement("button");
    dot.className = "w-3 h-3 rounded-full bg-white/50";
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }

  const dots = dotsContainer.children;

  function updateSlider() {
    slider.style.transform = `translateX(-${current * 100}%)`;

    for (let i = 0; i < dots.length; i++) {
      dots[i].classList.remove("bg-white");
      dots[i].classList.add("bg-white/50");
    }
    dots[current].classList.add("bg-white");
  }

  window.next = function () {
    current = (current + 1) % total;
    updateSlider();
  };

  window.prev = function () {
    current = (current - 1 + total) % total;
    updateSlider();
  };

  function goToSlide(index) {
    current = index;
    updateSlider();
  }

  setInterval(() => {
    window.next();
  }, 4000);

  updateSlider();
});

//Home

//products
const products = [
  {
    name: "Vanilla Cake",
    price: "₹200",
    rating: "4.5",
    img: "https://images.unsplash.com/photo-1685896211191-649aaefdf10a?q=80&w=800",
  },
  {
    name: "Strawberry Cake",
    price: "₹200",
    rating: "4.3",
    img: "https://plus.unsplash.com/premium_photo-1713447395823-2e0b40b75a89?q=80&w=800",
  },
  {
    name: "Macarons",
    price: "₹200",
    rating: "4.6",
    img: "https://plus.unsplash.com/premium_photo-1675806257134-2d3e30833d05?q=80&w=800",
  },
  {
    name: "Chocolate Cake",
    price: "₹200",
    rating: "4.4",
    img: "https://images.unsplash.com/photo-1620049302148-61b77ad1a1c2?q=80&w=800",
  },
  {
    name: "Fruit cake",
    price: "₹250",
    rating: "4.8",
    img: "https://images.unsplash.com/photo-1505976378723-9726b54e9bb9?q=80&w=800",
  },
  {
    name: "Cupcake Box",
    price: "₹220",
    rating: "4.7",
    img: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=800",
  },
  {
    name: "Red Velvet",
    price: "₹180",
    rating: "4.5",
    img: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=800",
  },
  {
    name: "Black Forest",
    price: "₹300",
    rating: "4.9",
    img: "https://images.unsplash.com/photo-1587668178277-295251f900ce?q=80&w=800",
  },
];

const grid = document.getElementById("productGrid");

products.forEach((product) => {
  grid.innerHTML += `
    <div class="card">
      <div class="img-wrapper">
        <img src="${product.img}" />
        <span class="badge">New</span>
      </div>

      <div class="content">
        <h2>${product.name}</h2>

        <div class="flex justify-between items-center mt-2">
          <span class="price">${product.price}</span>
          <span class="rating">⭐ ${product.rating}</span>
        </div>

        <button class="btn">Add to Cart</button>
      </div>
    </div>
  `;
});
//products
// // Close menu when a link is clicked (for mobile)
// document.querySelectorAll("#navMenu a").forEach((link) => {
//   link.addEventListener("click", () => {
//     navMenu.classList.add("hidden");
//   });
// });

// document.addEventListener("DOMContentLoaded", function () {
//   const contactButton = document.querySelector("a[href='#contact']");

//   contactButton.addEventListener("click", function () {
//     window.location.href = "contact.html";
//   });
// });

function showPopup(event) {
  event.preventDefault();
  alert("Your message has been sent successfully!");
}
