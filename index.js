const api = axios.create({
  baseURL: 'https://6971cf4a32c6bacb12c49096.mockapi.io',
});

// const BASE_URL = 'https://6971cf4a32c6bacb12c49096.mockapi.io';

let currentPage = 1;

const root = document.getElementById('root');
const titleOfPage = document.createElement('h1');
titleOfPage.textContent = 'Список книг';
root.prepend(titleOfPage);

const bookContainer = document.createElement('div');
bookContainer.className = 'books-container';
root.appendChild(bookContainer);

const listContainer = document.createElement('div');
listContainer.className = 'list-container';
bookContainer.appendChild(listContainer);

const bookList = document.createElement('ul');
bookList.className = 'book-list';
listContainer.appendChild(bookList);

const bookInfo = document.createElement('div');
bookInfo.className = 'book-info';
bookContainer.appendChild(bookInfo);

const paginattionButton = document.createElement('button');
paginattionButton.className = 'paginattion-button';
paginattionButton.textContent = 'Показати ще';
listContainer.appendChild(paginattionButton);
paginattionButton.style.display = 'none';

async function getBooks() {
  try {
    createLoader('Завантаження...', bookList);
    const { data } = await api.get(`/books`, {
      params: {
        page: currentPage,
        limit: 5,
      },
    });
    const loader = listContainer.querySelector('.loader');
    loader.remove();
    renderBookList(data);
  } catch (error) {
    console.error('Помилка при завантаженні книг:', error);
  }
}

const newBookButton = document.createElement('button');
newBookButton.className = 'new-book-button';
newBookButton.textContent = 'Додати нову книгу';
listContainer.appendChild(newBookButton);

async function renderBookList(books) {
  if (books.length === 5) {
    paginattionButton.style.display = 'inline';
    const { data } = await api.get(`/books`, {
      params: {
        page: currentPage + 1,
        limit: 5,
      },
    });
    if (data.length === 0) {
      paginattionButton.style.display = 'none';
      listEndMessage();
    }
  } else {
    paginattionButton.style.display = 'none';
    listEndMessage();
  }
  books.forEach(book => {
    const listItem = document.createElement('li');
    listItem.className = 'list-item';
    bookList.appendChild(listItem);

    const titleOfBook = document.createElement('p');
    titleOfBook.className = 'book-title';
    titleOfBook.textContent = book.title;
    listItem.appendChild(titleOfBook);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'buttons-container';
    listItem.appendChild(buttonsContainer);

    const buttonForBook = document.createElement('button');
    buttonForBook.className = 'book-button';
    buttonForBook.textContent = 'Переглянути деталі';
    buttonsContainer.appendChild(buttonForBook);

    const booksDeleteButton = document.createElement('button');
    booksDeleteButton.className = 'delete-button';
    booksDeleteButton.textContent = 'Видалити';
    buttonsContainer.appendChild(booksDeleteButton);

    const booksEditingButton = document.createElement('button');
    booksEditingButton.className = 'editing-button';
    booksEditingButton.textContent = 'Редагувати';
    buttonsContainer.appendChild(booksEditingButton);

    buttonForBook.addEventListener('click', () => {
      showBookDetails(book.id);
    });

    booksDeleteButton.addEventListener('click', () => {
      deleteBook(book.id);
    });

    booksEditingButton.addEventListener('click', () => {
      editBook(book.id);
    });
  });
}

function createLoader(text, place) {
  const loader = document.createElement('p');
  loader.className = 'loader';
  loader.textContent = text;
  place.appendChild(loader);
}

async function showBookDetails(idOfBook) {
  bookInfo.innerHTML = '';
  createLoader('Завантаження...', bookInfo);
  try {
    const { data } = await api.get(`/books/${idOfBook}`);
    bookInfo.innerHTML = '';
    const bookTitle = document.createElement('h2');
    bookTitle.className = 'book-title';
    bookTitle.textContent = data.title;
    bookInfo.appendChild(bookTitle);

    const bookAuthor = document.createElement('p');
    bookAuthor.className = 'book-author';
    bookAuthor.textContent = 'Автор: ' + data.author;
    bookInfo.appendChild(bookAuthor);

    const bookYear = document.createElement('p');
    bookYear.className = 'book-year';
    bookYear.textContent = 'Рік видання: ' + data.year;
    bookInfo.appendChild(bookYear);

    const bookDescripton = document.createElement('p');
    bookDescripton.className = 'book-dexcription';
    bookDescripton.textContent = data.description;
    bookInfo.appendChild(bookDescripton);
  } catch (error) {
    console.error('Помилка при завантаженні книг:', error);
  }
}

function createForm(title = '', author = '', year = '', description = '') {
  bookInfo.innerHTML = '';
  const form = document.createElement('form');
  form.className = 'form';
  bookInfo.appendChild(form);

  const titleLabel = document.createElement('label');
  titleLabel.className = 'form-label';
  titleLabel.textContent = 'Введіть назву книги';
  titleLabel.htmlFor = 'title';
  form.appendChild(titleLabel);

  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.id = 'title';
  titleInput.name = 'title';
  titleInput.value = title;
  form.appendChild(titleInput);

  const authorLabel = document.createElement('label');
  authorLabel.className = 'form-label';
  authorLabel.textContent = 'Введіть автора книги';
  authorLabel.htmlFor = 'author';
  form.appendChild(authorLabel);

  const authorInput = document.createElement('input');
  authorInput.type = 'text';
  authorInput.id = 'author';
  authorInput.name = 'author';
  authorInput.value = author;
  form.appendChild(authorInput);

  const yearLabel = document.createElement('label');
  yearLabel.className = 'form-label';
  yearLabel.textContent = 'Введіть рік видання книги';
  yearLabel.htmlFor = 'year';
  form.appendChild(yearLabel);

  const yearInput = document.createElement('input');
  yearInput.type = 'text';
  yearInput.id = 'year';
  yearInput.name = 'year';
  yearInput.value = year;
  form.appendChild(yearInput);

  const descriptionLabel = document.createElement('label');
  descriptionLabel.className = 'form-label';
  descriptionLabel.textContent = 'Введіть опис книги:';
  descriptionLabel.htmlFor = 'description';
  form.appendChild(descriptionLabel);

  const descriptionInput = document.createElement('textarea');
  descriptionInput.id = 'description';
  descriptionInput.name = 'description';
  descriptionInput.rows = 4;
  descriptionInput.value = description;
  form.appendChild(descriptionInput);

  const submitButton = document.createElement('button');
  submitButton.className = 'submit-button';
  submitButton.textContent = 'Відправити';
  form.appendChild(submitButton);

  return {
    form,
    titleInput,
    authorInput,
    yearInput,
    descriptionInput,
    submitButton,
  };
}

function checkForm(form, titleInput, authorInput, yearInput, descriptionInput) {
  const errors = form.querySelectorAll('.error-message');
  errors.forEach(error => error.remove());

  let isValid = true;
  if (!titleInput.value.trim()) {
    const errorMesageTitle = document.createElement('p');
    errorMesageTitle.textContent = 'Назва книги має бути введена';
    errorMesageTitle.className = 'error-message';
    form.insertBefore(errorMesageTitle, titleInput);
    isValid = false;
  }
  if (!authorInput.value.trim()) {
    const errorMesageAuthor = document.createElement('p');
    errorMesageAuthor.textContent = 'Автор книги має бути введений';
    errorMesageAuthor.className = 'error-message';
    form.insertBefore(errorMesageAuthor, authorInput);
    isValid = false;
  }
  const yearValue = yearInput.value.trim();
  if (!yearValue) {
    const errorMessageYear = document.createElement('p');
    errorMessageYear.textContent = 'Рік видання книги має бути введений';
    errorMessageYear.className = 'error-message';
    form.insertBefore(errorMessageYear, yearInput);
    isValid = false;
  } else if (isNaN(yearValue) || !Number.isInteger(Number(yearValue))) {
    const errorMessageYear = document.createElement('p');
    errorMessageYear.textContent = 'Рік видання має бути числом';
    errorMessageYear.className = 'error-message';
    form.insertBefore(errorMessageYear, yearInput);
    isValid = false;
  }
  if (!descriptionInput.value.trim()) {
    const errorMesageDescription = document.createElement('p');
    errorMesageDescription.textContent = 'Опис книги має бути введений';
    errorMesageDescription.className = 'error-message';
    form.insertBefore(errorMesageDescription, descriptionInput);
    isValid = false;
  }
  return isValid;
}

function showAddBookForm() {
  const { form, titleInput, authorInput, yearInput, descriptionInput } =
    createForm();

  form.addEventListener('submit', async event => {
    event.preventDefault();

    let isValid = checkForm(
      form,
      titleInput,
      authorInput,
      yearInput,
      descriptionInput,
    );

    if (isValid) {
      bookInfo.innerHTML = '';
      createLoader('Додавання нової книги...', bookInfo);
      try {
        const newBook = {
          title: titleInput.value.trim(),
          author: authorInput.value.trim(),
          year: parseInt(yearInput.value.trim()),
          description: descriptionInput.value.trim(),
        };

        await api.post(`/books`, newBook);
        currentPage = 1;
        bookList.innerHTML = '';
        await getBooks();
        message();
      } catch (error) {
        console.error('Помилка при додаванні нової книги:', error);
      }
    }
  });
}

async function deleteBook(bookID) {
  bookInfo.innerHTML = '';
  createLoader('Видалення книги...', bookInfo);
  try {
    await api.delete(`/books/${bookID}`);
    currentPage = 1;
    bookList.innerHTML = '';
    await getBooks();
    deleteMessage();
  } catch (error) {
    console.error('Помилка при видаленні книги:', error);
  }
}

async function editBook(idOfBook) {
  try {
    const { data } = await api.get(`/books/${idOfBook}`);
    const { form, titleInput, authorInput, yearInput, descriptionInput } =
      createForm(data.title, data.author, data.year, data.description);

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const isValid = checkForm(
        form,
        titleInput,
        authorInput,
        yearInput,
        descriptionInput,
      );
      if (isValid) {
        const bookData = {
          title: titleInput.value.trim(),
          author: authorInput.value.trim(),
          year: parseInt(yearInput.value.trim()),
          description: descriptionInput.value.trim(),
        };
        try {
          bookInfo.innerHTML = '';
          createLoader('Редагування книги...', bookInfo);
          await api.put(`/books/${idOfBook}`, bookData);
          currentPage = 1;
          bookList.innerHTML = '';
          await getBooks();
          editMessage();
        } catch (error) {
          console.log(error);
        }
      }
    });
  } catch (error) {
    console.error('Помилка при редагуванні книги:', error);
  }
}

function deleteMessage() {
  bookInfo.innerHTML = '';
  setTimeout(() => {
    const message = document.createElement('p');
    message.className = 'message';
    message.textContent = 'Вітаю! Книга була успішно видалена зі списку)';
    bookInfo.appendChild(message);
  }, 1000);
  setTimeout(() => {
    bookInfo.innerHTML = '';
  }, 3000);
}

function message() {
  bookInfo.innerHTML = '';
  const message = document.createElement('p');
  message.className = 'message';
  message.textContent = 'Вітаю! Книга була успішно додана до списку)';
  bookInfo.appendChild(message);
}

function editMessage() {
  bookInfo.innerHTML = '';
  const message = document.createElement('p');
  message.className = 'message';
  message.textContent = 'Вітаю! Книга була успішно відредагована)';
  bookInfo.appendChild(message);
}

function listEndMessage() {
  bookInfo.innerHTML = '';
  const messagePag = document.createElement('p');
  messagePag.className = 'book-title';
  messagePag.textContent = 'Кінець списку';
  bookInfo.appendChild(messagePag);
}

paginattionButton.addEventListener('click', async () => {
  paginattionButton.style.display = 'none';
  currentPage += 1;
  getBooks();
});

newBookButton.addEventListener('click', showAddBookForm);

document.addEventListener('DOMContentLoaded', async () => {
  await getBooks();
  console.log('Книги завантажені:');
});
