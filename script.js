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
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "color";
    checkbox.value = Object.keys(color)[0];
    const span = document.createElement("span");
    span.style.backgroundColor = Object.values(color)[0];

    checkbox.addEventListener("change", function () {
      if (this.checked) {
        span.classList.add("selected");
      } else {
        span.classList.remove("selected");
      }
    });

    label.appendChild(checkbox);
    label.appendChild(span);
    colorOptions.appendChild(label);
  });
}

function updateSelectedImg(src) {
  const displayImg = document.getElementById("selected-img");
  displayImg.src = src;
}

async function updateProductDetails() {
  const productData = await fetchProductData();
  if (productData) {
    updateColorOptions(productData.options[0].values);
    document.getElementById("product-short").innerText = productData.vendor;
    document.getElementById("product-title").innerText = productData.title;

    document.getElementById("offer-price").innerText = productData.price;
    document.getElementById("actual-price").innerText = productData.compare_at_price;
    document.getElementById("product-description").innerHTML = productData.description;
    const productImages = document.querySelectorAll(".photo-div img");
    const incButton=document.querySelector('#inc-btn');
    const decButton=document.querySelector('#dec-btn');
    const counterInput=document.querySelector('#counterInput');

    incButton.addEventListener('click',incCounter);
    decButton.addEventListener('click',decCounter);
    productImages.forEach((img, index) => {
      img.addEventListener("click", function () {
        updateSelectedImg(productImages[index].src);
      });
    });

    const sizeOptions = document.getElementById("size-options");
    sizeOptions.innerHTML = "";
    productData.options[1].values.forEach((size) => {
      const div = document.createElement("div");
      div.classList.add("input-div");
      const label = document.createElement("label");
      label.innerText = size;
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "size";
      div.appendChild(radio);
      div.appendChild(label);
      sizeOptions.appendChild(div);
    });
    let currentValue = parseInt(counterInput.value);
    function decCounter() {
        if (currentValue > 1) {
            console.log(counterInput)
            currentValue--;
            counterInput.value = currentValue;
        }
    }
    function incCounter() {
         currentValue++;
        counterInput.value = currentValue;
    }
  }
}

window.onload = updateProductDetails;
