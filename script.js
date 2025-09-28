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
    const list = document.createElement("ul");

    cart.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.title} — ${item.price}`;
        list.appendChild(li);
        total += item.price;
    });

    cartItemsContainer.appendChild(list);
    totalEl.textContent = total;
    }


    buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const product = button.closest("article"); // находим карточку
        const title = product.querySelector(".product-name").textContent;
        const price =  Number(product.querySelector('.product-price').textContent.replace(/\D/g, ''));
        alert(("Добавлен товар: " + title + " " + price));

        // добавляем товар в массив корзины
        cart.push({ title, price });

        // обновляем корзину
        renderCart();
    });
    });
})