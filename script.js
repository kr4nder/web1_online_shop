document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalEl = document.getElementById('total');
    const buttons = document.querySelectorAll('.add-to-cart'); // все кнопки добавить в корзину

    let cart = [];

    function renderCart() { // рендер корзины
    cartItemsContainer.innerHTML = ""; // очищаем корзину перед отрисовкой

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Корзина пуста</p>";
        totalEl.textContent = "0";
        return;
    }

    let total = 0;
    cart.forEach((item, index) => {
        const div = document.createElement("div");
        div.textContent = `${item.title} — ${item.price} ₽`;

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Удалить";
        removeBtn.addEventListener("click", () => {
            cart.splice(index, 1); // удаляем товар из массива
            renderCart();          // обновляем корзину
        });

        div.appendChild(removeBtn);
        cartItemsContainer.appendChild(div);

        total += item.price;
  });

  totalEl.textContent = total;
}


    buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const product = button.closest("article"); // находим карточку
        const title = product.querySelector(".product-name").textContent;
        const price =  Number(product.querySelector('.product-price').textContent.replace(/\D/g, ''));

        // добавляем товар в массив корзины
        cart.push({ title, price });

        // обновляем корзину
        renderCart();
    });
    });
})