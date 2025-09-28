document.addEventListener('DOMContentLoaded', () => {
  const cartItemsContainer = document.getElementById('cart-items');
  const totalEl = document.getElementById('total');
  const buttons = document.querySelectorAll('.add-to-cart'); // все кнопки добавить в корзину
  const checkoutBtn = document.getElementById('checkout-btn');

  // загружаем корзину из localStorage или создаём пустую
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  function renderCart() { // рендер корзины
    cartItemsContainer.innerHTML = ''; // очищаем корзину перед отрисовкой

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p>Корзина пуста</p>';
      totalEl.textContent = '0';
      return;
    }

    let total = 0;

    cart.forEach((item, index) => {
      const div = document.createElement('div');
      div.textContent = `${item.title} — ${item.price} ₽ x ${item.qty}`;

      // кнопка удалить
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Удалить';
      removeBtn.addEventListener('click', () => {
        cart.splice(index, 1);
        saveCart();
        renderCart();
      });

      // кнопка плюс
      const plusBtn = document.createElement('button');
      plusBtn.textContent = '+';
      plusBtn.addEventListener('click', () => {
        item.qty += 1;
        saveCart();
        renderCart();
      });

      // кнопка минус
      const minusBtn = document.createElement('button');
      minusBtn.textContent = '-';
      minusBtn.addEventListener('click', () => {
        item.qty -= 1;
        if (item.qty <= 0) cart.splice(index, 1);
        saveCart();
        renderCart();
      });

      div.appendChild(minusBtn);
      div.appendChild(plusBtn);
      div.appendChild(removeBtn);

      cartItemsContainer.appendChild(div);

      total += item.price * item.qty;
    });

    totalEl.textContent = total;
  }

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const product = button.closest('article'); // находим карточку
      const title = product.querySelector('.product-name').textContent;
      const price = Number(product.querySelector('.product-price').textContent.replace(/\D/g, ''));
      
      // ищем, есть ли уже товар в корзине
      const existingItem = cart.find(item => item.title === title);
      if (existingItem) {
        existingItem.qty += 1;
      } else {
        cart.push({ title, price, qty: 1 });
      }

      saveCart();
      renderCart();
    });
  });
    // при загрузке страницы рендерим корзину
  renderCart();
});