import { menuArray } from "./data.js";

let totalItems = [];
let quantity = 0;
const checkoutForm = document.getElementById("myForm");
const checkoutFormElement = checkoutForm.querySelector("form");

document.addEventListener("click", function (e) {
  if (e.target.dataset.add) {
    handleAdd(e.target.dataset.add);
  }
  if (e.target.dataset.checkout) {
    handleCheckout();
  }
  if (e.target.dataset.close) {
    handleClose();
  }
  if (e.target.dataset.pay) {
    if (!checkoutFormElement.reportValidity()) return;
    e.preventDefault();
    handlePay(e.target.dataset.pay);
  }
  if (e.target.dataset.remove) {
    handleremove(e.target.dataset.remove);
  }
});

function handleAdd(itemsDetails) {
  menuArray.filter(function (itemObj) {
    if (itemObj.id === Number(itemsDetails)) {
      totalItems.push(itemObj);
    }
  });
  const orderItems = setOrder(totalItems);
}

function setOrder(items) {
  if (items.length > 0) {
    let orderHTML = "";
    const total = items.reduce((sum, item) => sum + item.price, 0);
    items.map(function (item) {
      const itemCount = items.filter((obj) => obj.id === item.id).length;
      if (!document.getElementById("order-items-" + item.id)) {
        orderHTML += `
                <div class='order-items' id='order-items-${item.id}'>
                    <p id='${item.id}'>${item.name}<span id="remove-${item.id}" class="remove" data-remove='${item.id}'>delete</span></p>
                    <p id='quantity-${item.id}'>${itemCount}</p>
                    <p id='order-items-price-${item.id}'>$${item.price}</p>
                </div>`;
      } else {
        let quantityVal = document.getElementById("quantity-" + item.id);
        let priceVal = document.getElementById("order-items-price-" + item.id);
        quantityVal.innerText = itemCount;
        let totalPrice = itemCount * item.price;
        priceVal.innerHTML = "$" + totalPrice;
      }
    });
    const totalHtml = `<p id='total-value'>$${total}</p>`;
    const orderList = document.getElementById("order-list");
    const totalOrder = document.getElementById("order-total");
    orderList.innerHTML += orderHTML;
    if (!document.getElementById("total-value")) {
      totalOrder.innerHTML += totalHtml;
    } else {
      let totalEl = document.getElementById("total-value");
      totalEl.innerText = `$${total}`;
    }
    orderList.classList.remove("order-display");
    totalOrder.classList.remove("total-hidden");
    document.getElementById("checkout-div").classList.remove("total-hidden");
  } else {
    const orderList = document.getElementById("order-list");
    const totalOrder = document.getElementById("order-total");
    orderList.classList.add("order-display");
    totalOrder.classList.add("total-hidden");
    document.getElementById("checkout-div").classList.add("total-hidden");
  }
}


function handleCheckout() {
  checkoutForm.classList.add("form-container");
  checkoutForm.classList.remove("form-container-hide");
}

function handleClose() {
  checkoutForm.classList.add("form-container-hide");
  checkoutForm.classList.remove("form-container");
}

function handleremove(itemDetails) {
  const idNum = Number(itemDetails);
  const orderItem = document.getElementById("order-items-" + idNum);
  const itemRemoveIndex = totalItems.findIndex((obj) => obj.id === idNum);
  if (itemRemoveIndex !== -1) {
    totalItems.splice(itemRemoveIndex, 1);
    const itemListCount = totalItems.filter((obj) => obj.id === idNum).length;
    if (itemListCount === 0) {
      orderItem.remove();
    }
    setOrder(totalItems);
  } 
}

function handlePay(payDetails) {
  const orderTotal = document.getElementById("order-list");
  const order = document.getElementById("order-total");
  const checkout = document.getElementById("checkout-div");
  const customerName = document.getElementById("customer-name").value;
  const thankMessage = document.getElementById("thank-message");
  const message = `<p class='message'>Thanks ${customerName}, Your order is on its way</p>`;
  checkoutForm.classList.add("form-container-hide");
  checkoutForm.classList.remove("form-container");
  order.remove();
  orderTotal.remove();
  checkout.classList.add("total-hidden");

  thankMessage.innerHTML += message;
  thankMessage.classList.remove("hide-message");
}
function setMenu() {
  let htmlItems = "";
  menuArray.map(function (items) {
    htmlItems += `
            <div class='item-div item-${items.id}'>
                <div class='emoji-div'>
                    <p class='emoji'>${items.emoji}</p>
                </div>
                <div class='item-details'>
                    <h2 class='item-name'>${items.name}</h2>
                    <p class='item-ingredients'>${items.ingredients}</p>
                    <h4 class='item-price' id='${items.id}'>$${items.price}</h4>
                </div>
                <div class='add-item-div'>
                    <button class='add-item' id='add-btn item-${items.id}' data-add='${items.id}'>+</button>
                </div>
            </div>`;
  });
  renderItems(htmlItems);
}

function renderItems(items) {
  let itemList = document.getElementById("items-list");
  itemList.innerHTML = items;
}

setMenu();
