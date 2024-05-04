const baseUrl =
  "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/singleProduct.json?v=1701948448";

async function fetchProductData() {
  try {
    const response = await fetch(baseUrl);
    const data = await response.json();
    return data.product;
  } catch (error) {
    console.error("Error fetching product data:", error);
  }
}

function updateColorOptions(colorValues) {
  const colorOptions = document.getElementById("color-options");
  colorOptions.innerHTML = "";

  colorValues.forEach((color) => {
    const label = document.createElement("label");
    label.classList.add("color-option-label");
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "color";
    radio.value = Object.keys(color)[0];
    const span = document.createElement("span");
    span.style.backgroundColor = Object.values(color)[0];
    span.style.borderColor = Object.values(color)[0];

    radio.addEventListener("change", function () {
      document.querySelectorAll(".color-option-label span").forEach((span) => {
        span.classList.remove("selected");
      });

      span.classList.add("selected");
    });

    label.appendChild(radio);
    label.appendChild(span);
    colorOptions.appendChild(label);
  });
}

function updateSelectedImg(src) {
  const displayImg = document.getElementById("selected-img");
  displayImg.src = src;
}

function displayToast(msg) {
  const toastText = document.querySelector("#toast-text");
  toastText.textContent = msg;

  const cartToast = document.querySelector(".cart-toast");
  cartToast.classList.add("show");

  setTimeout(() => {
    cartToast.classList.remove("show");
  }, 5000);
}

async function updateProductDetails() {
  const productData = await fetchProductData();
  if (productData) {
    updateColorOptions(productData.options[0].values);
    document.getElementById("product-short").innerText = productData.vendor;
    document.getElementById("product-title").innerText = productData.title;
    const price = parseFloat(productData.price.replace(/[^\d.]/g, '')).toFixed(2);
    const actualPrice=parseFloat(productData.compare_at_price.replace(/[^\d.]/g, '')).toFixed(2);
    document.getElementById("offer-price").innerText = `$${price}`;
    document.getElementById("actual-price").innerText=  `$${actualPrice}`;
    document.getElementById("product-description").innerHTML =
      productData.description;
    const productImages = document.querySelectorAll(".photo-div img");
    const incButton = document.querySelector("#inc-btn");
    const decButton = document.querySelector("#dec-btn");
    const counterInput = document.querySelector("#counterInput");

    const priceNumber = parseFloat(productData.price.replace("$", ""));
    const compareAtPriceNumber = parseFloat(
      productData.compare_at_price.replace("$", "")
    );
    const discountPercentage = Math.round(
      ((compareAtPriceNumber - priceNumber) / compareAtPriceNumber) * 100
    );

    const offElement = document.getElementById("off");
    offElement.textContent = `${discountPercentage}% off`;
    console.log(discountPercentage);
    incButton.addEventListener("click", incCounter);
    decButton.addEventListener("click", decCounter);
    productImages.forEach((img, index) => {
      img.addEventListener("click", function () {
        updateSelectedImg(productImages[index].src);
      });
    });

    const sizeOptions = document.getElementById("size-options");
    sizeOptions.innerHTML = "";
    productData.options[1].values.forEach((size, index) => {
      const div = document.createElement("div");
      div.classList.add("input-div");
      const label = document.createElement("label");
      label.innerText = size;

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "size";
      radio.id = `size-${index}`; 

      label.setAttribute("for", `size-${index}`); 

      div.appendChild(radio);
      div.appendChild(label);
      sizeOptions.appendChild(div);
    });
    let currentValue = parseInt(counterInput.value);
    function decCounter(event) {
      event.preventDefault();
      if (currentValue > 1) {
        console.log(counterInput);
        currentValue--;
        counterInput.value = currentValue;
      }
    }
    function incCounter(event) {
      event.preventDefault();
      currentValue++;
      counterInput.value = currentValue;
    }

    const addToCartButton = document.getElementById("add-to-cart");
    addToCartButton.addEventListener("click", (event) => {
      event.preventDefault();
      const selectedColor = document.querySelector(
        'input[name="color"]:checked'
      );
      const selectedSize = document.querySelector('input[name="size"]:checked');
      const quantity = document.getElementById("counterInput").value;
      if (selectedColor && selectedSize) {
        const color = selectedColor.value;
        const size = selectedSize.nextElementSibling.innerText;
        const message = `${productData.title} with Color ${color} and Size ${size} Of Quantity  ${quantity} is added to cart`;
        displayToast(message);
      } else {
        displayToast("Please select color and size before adding to cart.");
      }
    });
  }
}

window.onload = updateProductDetails;
