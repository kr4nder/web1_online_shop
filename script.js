document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalEl = document.getElementById('total');
    const buttons = document.querySelectorAll('.add-to-cart');

    let cart = [];
})


const buttons = document.querySelectorAll(".add-to-cart"); // все кнопки добавить в корзину

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const product = button.closest("article"); // находим карточку
    const title = product.querySelector(".product-name").textContent;
    const price = product.querySelector(".product-price").textContent;
    alert("Добавлен товар:", title);
  });
});