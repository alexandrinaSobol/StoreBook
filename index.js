let availableBooks = [];
const bookContainer = document.querySelector('.book-list');
const shoppingContainer = document.querySelector('.shopping-container');
const totalSumForOrder = document.getElementById('total');
const booksInCart = document.getElementById('shopping-cart')

reloadAvailableBooks();
reloadOrderCart();
calculateTotalFromOrder();

function getBooksFromLocalStorage(){
   return JSON.parse(window.localStorage.getItem('orderBooks'));
}

async function getBooksFromJson() {
    const response = await fetch('https://alexandrinasobol.github.io/bookStore/data/books.json');
    return response.json();
}

const addBookToOrderTable = (bookId) => {
    const selectedBook = availableBooks.filter(book => book.id === bookId);

    selectedBook[0].count = 1;
    let orderBooks = getBooksFromLocalStorage();
    if (orderBooks === null) {
        window.localStorage.setItem('orderBooks', JSON.stringify(selectedBook));
    } else if ( orderBooks.filter(item => item.id === bookId).length === 0) {
        orderBooks.push(selectedBook[0])
        window.localStorage.setItem('orderBooks', JSON.stringify(orderBooks));
    } else {
        alert(`This book is already added in your order!`)
    }
    reloadOrderCart();
}

const addBookQuantity = (bookId) => {
    let orderBooks = getBooksFromLocalStorage();
    const newBook = orderBooks.filter(item => item.id === bookId)[0]
    if (newBook !== undefined) {
        newBook.count++;
    } else {
        return
    }
    window.localStorage.setItem('orderBooks', JSON.stringify(orderBooks));
    reloadOrderCart();
}

const decreaseBookFromOrder = (bookId) => {
    const orderBooks = getBooksFromLocalStorage();
    const selectedBook = orderBooks.filter(book => book.id === bookId);
    if (selectedBook[0].count > 1) {
        selectedBook[0].count--;
        window.localStorage.setItem('orderBooks', JSON.stringify(orderBooks));
    } else {
        const select = orderBooks.filter(book => book.id !== bookId);
        window.localStorage.setItem('orderBooks', JSON.stringify(select));
    }
    reloadOrderCart();
}

const deleteBookFromOrder = (bookId) => {
    const orderBooks = getBooksFromLocalStorage();
    const selectedBook = orderBooks.filter(book => book.id !== bookId);
    window.localStorage.setItem('orderBooks', JSON.stringify(selectedBook));
    reloadOrderCart();
}

function calculateTotalFromOrder() {
    let totalBooks = getBooksFromLocalStorage();
    let sum = 0;
    totalBooks.forEach(book => {
            sum += book.count * book.price;
        }
    )
    totalSumForOrder.innerHTML = `Total: $${sum}`;
}

function reloadOrderCart(){
    let numberOfBook = 1
    document.querySelectorAll(".shopping-body").forEach(e => e.remove());
    let orderBooks = getBooksFromLocalStorage();
    orderBooks.map(book => {
        const item = getOrderBookContent(book, numberOfBook++);
        shoppingContainer.insertAdjacentHTML("beforebegin", item);
    })

    calculateItemFromCart();
    calculateTotalFromOrder();
}
function calculateItemFromCart() {
    let orderBooks = getBooksFromLocalStorage();
    let sum = orderBooks.reduce((sum, {count}) => sum + count, 0)
    booksInCart.innerHTML = `${sum}`
}

    function reloadAvailableBooks() {
    getBooksFromJson().then(response => {
        availableBooks = response
        response.map(item => {
            const newBook = getShelfBookContent(item)
            bookContainer.insertAdjacentHTML("beforeend", newBook);
        })
    })
}

function getShelfBookContent(book) {
    return `
<div class="book-item">
    <div class="book-item-cover">
        <img src=${book.img} alt="pic" class="book-img">
    </div>
    <div class="book-item-info">
        <ul class="book-item-list">
            <li class="book-item-list-name">
                <a target="_blank" href="./book.html?id=${book.id}" class="name-link">${book.title}</a>
            </li>
            <li class="book-item-list-author">${book.author}</li>
            <li class="book-item-list-price">$${book.price}</li>
            <li class="book-item-list-btn">
                <button onclick="addBookToOrderTable(${book.id})" class="add-to-cart-button">Add to cart</button>
            </li>
        </ul>
    </div>
</div>
`;
}

function getOrderBookContent(book, numberOfBook) {
    return `
<ul class="shopping-body">
    <li>${numberOfBook}</li>
    <li>${book.title}</li>
    <li>${book.count}</li>
    <li>$${book.price}</li>
    <li>
        <button class="btn btn-success" onclick='addBookQuantity(${book.id})'><i class="fas fa-plus"></i></button>
        <button class="btn btn-warning" onclick="decreaseBookFromOrder(${book.id})"><i class="fas fa-minus"></i></button>
        <button class="btn btn-danger" onclick="deleteBookFromOrder(${book.id})"><i class="fas fa-trash-alt"></i></button>
    </li>
</ul>`;
}

window.addEventListener('storage', () => {
    reloadOrderCart();
});