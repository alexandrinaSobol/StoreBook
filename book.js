const singleBookContainer = document.querySelector('.single-book-list');
const booksInCart = document.getElementById('cart')
const title = document.getElementsByTagName('title')[0]
let availableBooks = []

calculateItemFromCart();
displayBook();


function getBookIdParam() {
    const urlParams = new URLSearchParams(document.location.search);
    return urlParams.get('id');
}

async function getBooksFromJson() {
    const response = await fetch('https://alexandrinasobol.github.io/StoreBook/data/books.json');
    return response.json()
}

function displayBook() {
    const idBook = getBookIdParam();
    getBooksFromJson().then(response => {
        availableBooks = response
        const selectedBook = response.filter(book => book.id == idBook)
        const book = getShelfBookContent(selectedBook[0])
        singleBookContainer.insertAdjacentHTML("beforeend", book);
        setBookPageTitle(selectedBook[0])
    });
}

function getBooksFromLocalStorage() {
    return JSON.parse(window.localStorage.getItem('orderBooks'));
}

function addBookToOrderTable(bookId) {
    const selectedBook = availableBooks.filter(book => book.id === bookId);
    selectedBook[0].count = 1;
    let orderBooks = getBooksFromLocalStorage();
    const selectedBookInLocalStorage = orderBooks.filter(item => item.id === bookId)
    if (orderBooks === null) {
        window.localStorage.setItem('orderBooks', JSON.stringify(selectedBook));
        alert(`This book is added in your order!`)
    } else if (selectedBookInLocalStorage.length === 0) {
        orderBooks.push(selectedBook[0])
        window.localStorage.setItem('orderBooks', JSON.stringify(orderBooks));
        alert(`This book is added in your order!`)
    } else {
        alert(`This book is already added in your order!`)
    }
    calculateItemFromCart();
}

function calculateItemFromCart() {
    let orderBooks = getBooksFromLocalStorage();
    let sum = orderBooks.reduce((sum, {count}) => sum + count, 0)
    booksInCart.innerHTML = `${sum}`
}


function setBookPageTitle(book) {
    title.innerHTML = `${book.title} - ${book.author}`
}

function getShelfBookContent(book) {
    return `
<div class="single-book-item">
    <div class="book-item-cover">
        <img src=${book.img} alt="pic" class="book-img">
    </div>
    <div class="book-item-info">
        <ul class="book-item-list">
            <li class="book-item-list-name">Title: ${book.title}</li>
            <li class="book-item-list-author">Author: ${book.author}</li>
            <li class="book-item-list-price">Price: $${book.price}</li>
            <li class="book-item-list-btn">
                <button onclick="addBookToOrderTable(${book.id})" class="add-to-cart-button">Add to cart</button>
            </li>
        </ul>
    </div>
</div>
`;
}
