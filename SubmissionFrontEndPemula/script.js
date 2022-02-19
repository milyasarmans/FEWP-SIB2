let daftarBuku = [];
const BOOK_ID = "buku";
const BOOK_INCOMPLETED = "incompleteBookshelfList";
const BOOK_COMPLETE = "completeBookshelfList";
const STORAGE_KEY = "BOOKSHELF_APPS";

function generateBuku(Title, Author, Year, isCompleted) {
    const teksJudulBuku = document.createElement("h4");
    teksJudulBuku.innerText = Title;

    const teksPenulisBuku = document.createElement("p");
    teksPenulisBuku.innerText = Author;

    const teksTahunBuku = document.createElement("p");
    teksTahunBuku.innerText = Year;

    const container = document.createElement("div");
    container.classList.add("action");

    container.append(
        btnCekBuku(isCompleted),
        btnUbah(),
        btnHapus()
    );

    const konten = document.createElement("article");
    konten.classList.add("book_item");
    konten.append(teksJudulBuku, teksPenulisBuku, teksTahunBuku, container);
    return konten;
}

function btnCekBuku(isCompleted) {
    return btn('green', (isCompleted ? 'Belum Selesai Dibaca' : 'Selesai Dibaca'), function(event) {
        if (isCompleted) {
            toInCompleted(event.target.parentElement.parentElement);
        } else {
            toComplete(event.target.parentElement.parentElement);
        }
    });
}

function btnUbah() {
    return btn("orange", "Edit Buku", function(event) {
        ubhBuku(event.target.parentElement.parentElement);
    });
}

function btnHapus() {
    return btn("red", "Hapus Buku", function(event) {
        hpsBuku(event.target.parentElement.parentElement);
    });
}

function btn(buttonClassType, buttonText, eventListener) {
    const tmbl = document.createElement("button");
    tmbl.classList.add(buttonClassType);
    tmbl.innerText = buttonText;
    tmbl.addEventListener(
        "click",
        function(event) {
            eventListener(event);
        });
    return tmbl;
}

function tambahBuku() {
    const daftarBelumSelesai = document.getElementById(BOOK_INCOMPLETED);
    const daftarSelesai = document.getElementById(BOOK_COMPLETE);
    const judulBuku = document.getElementById("inputBookTitle").value;
    const penulisBuku = document.getElementById("inputBookAuthor").value;
    const tahunBuku = document.getElementById("inputBookYear").value;
    const isCompleted = document.getElementById("inputBookIsComplete").checked;
    const book = generateBuku(judulBuku, penulisBuku, tahunBuku, isCompleted);
    const oBuku = generateObjekBuku(judulBuku, penulisBuku, tahunBuku, isCompleted)

    book[BOOK_ID] = oBuku.id;
    daftarBuku.push(oBuku);
    if (isCompleted) {
        daftarSelesai.append(book);
    } else {
        daftarBelumSelesai.append(book);
    }
    simpanDataStorage();
}

function toComplete(bookElement) {
    const book = cariBuku(bookElement[BOOK_ID]);
    book.isCompleted = true;

    const dBuku = generateBuku(book.Title, book.Author, book.Year, isCompleted = true);
    dBuku[BOOK_ID] = book.id;

    const daftarSelesai = document.getElementById(BOOK_COMPLETE);
    daftarSelesai.append(dBuku);

    bookElement.remove();
    simpanDataStorage();
}

function toInCompleted(bookElement) {
    const book = cariBuku(bookElement[BOOK_ID]);
    book.isCompleted = false;

    const dBuku = generateBuku(book.Title, book.Author, book.Year, book.isCompleted);
    dBuku[BOOK_ID] = book.id;

    const daftarBelumSelesai = document.getElementById(BOOK_INCOMPLETED);
    daftarBelumSelesai.append(dBuku);

    bookElement.remove();
    simpanDataStorage();
}


function hpsBuku(bookElement) {
    const close = document.getElementById("popUp");
    close.style.display = "block";

    const btnTidak = document.querySelector(".btn-tidak");
    const btnYa = document.querySelector(".btn-ya");

    btnYa.addEventListener('click', function(event) {
        const posisiBuku = cariSesuaiIndex(bookElement[BOOK_ID]);
        daftarBuku.splice(posisiBuku, 1);
        bookElement.remove();
        close.style.display = "none";
        simpanDataStorage();
    })

    btnTidak.addEventListener('click', function(event) {
        close.style.display = "none";
    })

    window.onclick = function(event) {
        if (event.target == close) {
            close.style.display = "none";
        }
    }
}

function ubhBuku(bookElement) {
    const editModal = document.getElementById("editModal");
    editModal.style.display = "block";

    const book = cariBuku(bookElement[BOOK_ID]);
    const ubahId = document.getElementById("inputEditBookId");
    const ubahJudul = document.getElementById("inputEditBookTittle");
    const ubahPenulis = document.getElementById("inputEditBookAuthor");
    const ubahTahun = document.getElementById("inputEditBookYear");
    const ubahKeterangan = document.getElementById("inputEditBookIsComplete");

    ubahId.value = book.id;
    ubahJudul.value = book.Title;
    ubahPenulis.value = book.Author;
    ubahTahun.value = book.Year;
    ubahKeterangan.checked = book.isCompleted;

    const smpn = document.querySelector(".simpan");
    smpn.addEventListener('click', function(event) {
        ubahBuku(ubahJudul.value, ubahPenulis.value, ubahTahun.value, ubahKeterangan.checked, book.id);
        editModal.style.display = "none";
    });

    const btl = document.querySelector(".batal");
    btl.addEventListener("click", function(event) {
        editModal.style.display = "none";
        event.preventDefault();
    })

    window.onclick = function(event) {
        if (event.target == editModal) {
            editModal.style.display = "none";
        }
    }
}

function ubahBuku(Title, Author, Year, isCompleted, Id) {
    const tempatBuku = JSON.parse(localStorage[STORAGE_KEY]);
    const indexBuku = cariSesuaiIndex(Id);

    tempatBuku[indexBuku] = {
        id: Id,
        Title: Title,
        Author: Author,
        Year: Year,
        isCompleted: isCompleted
    };

    const mBuku = JSON.stringify(tempatBuku);
    localStorage.setItem(STORAGE_KEY, mBuku);
    location.reload(true);
}

function cariSesuaiJudul(kataKunci) {
    const iBuku = document.querySelectorAll(".book_item");
    for (let book of iBuku) {
        const title = book.childNodes[0];
        if (!title.innerText.toLowerCase().includes(kataKunci)) {
            title.parentElement.style.display = 'none';
        } else {
            title.parentElement.style.display = '';
        }
    }
}

function isStorageExist() {
    if (typeof(Storage) === undefined) {
        alert("Mohon maaf Peramban Anda tidak mendukung Local Storage")
        return false;
    }
    return true;
}

function simpanData() {
    const mBuku = JSON.stringify(daftarBuku);
    localStorage.setItem(STORAGE_KEY, mBuku);
    document.dispatchEvent(new Event("ondatasaved"));
}

function ambilData() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
    if (data !== null)
        daftarBuku = data;
    document.dispatchEvent(new Event("ondataloaded"));
}

function simpanDataStorage() {
    if (isStorageExist()) {
        simpanData();
    }
}

function generateObjekBuku(Title, Author, Year, isCompleted) {
    return {
        id: +new Date(),
        Title,
        Author,
        Year,
        isCompleted
    }
}

function cariBuku(buku) {
    for (book of daftarBuku) {
        if (book.id === buku)
            return book;
    }
    return null;
}

function cariSesuaiIndex(buku) {
    let index = 0
    for (book of daftarBuku) {
        if (book.id === buku)
            return index;
        index++;
    }
    return -1;
}

function ketBuku() {
    const daftarBelumSelesai = document.getElementById(BOOK_INCOMPLETED);
    let daftarSelesai = document.getElementById(BOOK_COMPLETE);
    for (book of daftarBuku) {
        const dBuku = generateBuku(book.Title, book.Author, book.Year, book.isCompleted);
        dBuku[BOOK_ID] = book.id;
        if (book.isCompleted) {
            daftarSelesai.append(dBuku);
        } else {
            daftarBelumSelesai.append(dBuku);
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const submitBuku = document.getElementById("inputBook");
    submitBuku.addEventListener("submit", function(event) {
        tambahBuku();
    });

    const btnCek = document.getElementById("inputBookIsComplete");
    const btnSubmit = document.querySelector("#bookSubmit > span");
    btnCek.addEventListener("change", function() {
        if (btnCek.checked) {
            btnSubmit.innerText = "Selesai Dibaca";
        } else {
            btnSubmit.innerText = "Belum Selesai Dibaca";
        }
    });

    const btnCari = document.getElementById("searchSubmit");
    btnCari.addEventListener("click", function(event) {
        const kataKunci = document.getElementById("searchBookTitle").value;
        cariSesuaiJudul(kataKunci.toLowerCase());
        event.preventDefault();
    });

    if (isStorageExist()) {
        ambilData();
    }

});

document.addEventListener("ondatasaved", () => {
    console.log("Data berhasil di simpan");
});

document.addEventListener("ondataloaded", () => {
    ketBuku();
});