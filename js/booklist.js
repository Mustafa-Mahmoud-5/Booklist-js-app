
// book class
class Book
{
    constructor(title,author,isbn) // this will be the class that we will build our object from it
    {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
};



// Ui Class

class Ui // this class will contain alot of methods that is relative to every thing happens inside the application
{
    static displayBooks() // looping through the books objects that stored in the local storage and display them when the page load for one time
    {

        let books = Store.getBooks(); // make books = the returned array from this method which will be an array of objects

        books.forEach( (book) => { // looping through each object 

            Ui.addBookToList(book); // make the table using another method instead of writting static code
        });
    };


    static addBookToList(book) // make the table structure and display it in the table .. this method will take the object that we want to display on the table
    {
        const list = document.getElementById(`book-list`);

        let row = document.createElement(`tr`)

        row.innerHTML = 
        `   
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.isbn}</td>
                <td><a href = "#" class= "btn btn-danger btn-sm">X</a></td>
        `

        list.appendChild(row); // put the table structure inside the book-list class
    };

    static deleteData(element) // delete the book from the table (carry the e.target as parameter)
    {
        if(element.classList.contains(`btn-sm`)) //check if the e.target was the btn
        {
            element.parentElement.parentElement.remove(); //remove the row

            Ui.displayAlert("Book Removed", `success`); //call a method that displays an alert which takes message and the bootstrap color class

        }
    };

    static clearInputs() // clear the inputs from any old text each time the user click on the btn
    {
        let myInps = document.querySelectorAll(".form-control");

        myInps.forEach((myInp) =>{

            myInp.value = ""; // loop through the inpts and delete their value
        });
    };

    static displayAlert(message, className) // show alert (takes message and bs4 class name)
    {
        let alertMessage = document.querySelector(`#alertMessage`); // this is html div that will be the alert
        
        alertMessage.textContent = message; // the div text will be the message parameter

        alertMessage.setAttribute(`class`, `alert alert-${className} font-weight-bold`); // give it a class of alert-(bootstrap color class name)

        alertMessage.style.display= "block"; //  we will display it none after 3 sec so, we want it to show again on the next click

        setTimeout( () => alertMessage.style.display= "none" , 3000 ); // hide it after 3sec
    };
    
    static displayData() // display the data that the user will write on every click 
    {

        let title = document.querySelector(`#title`).value; // title inp
        let author =document.querySelector(`#author`).value; // author inp
        let isbn = document.querySelector(`#isbn`).value; // isbn inp
    
        // make validations
        if(title == "" || author == "" || isbn == "")
        {
            Ui.displayAlert("Your Data is missing", "danger"); // if data is missing, display the alert
        }
        else
        {
            // instintiate the book object from the Book class based on user inputs
            let book = new Book(title, author, isbn);
    
            Ui.addBookToList(book); // after creating our object, we will pass to this method which will add it to the table
    
            Store.AddBooks(book);  // adding the book object to the local storage ... this method takes the object and push it to the book objects array in the local storage
            
            // clear the input values
            Ui.clearInputs();

            // show alert of book added
            Ui.displayAlert("Book Added" , "success");
        }
    };
};



class Store // this class will be concerned with local storage storing
{
    static getBooks() // get the books array from local storage
    {
        let books;

        if (localStorage.getItem(`books`) === null)
        {
            books = []; // if there`s no data in the local storage then make empty array
        }

        else
        {
            books  = JSON.parse(localStorage.getItem(`books`)); // if there is stored data in the local storage the get it and parse it because it was string
        }

        return books; // return the books array whatever it is empty array or occupied array
    };

    static AddBooks(book) // add books to the local storage (takes the book object)
    {
        let books = Store.getBooks(); // assign the returned array to the books var

        books.push(book) // push the given book to the array

        localStorage.setItem(`books`, JSON.stringify(books)); // set items of key books and strigify the books array and store it inside the localStorage
    };

    static removeBooks(isbn) //remove books from local storage (takes the isbn user value as parameter)
    {
        let books = Store.getBooks(); // assign the returned array to the books var

        // loop over the books array and splice the current index
        books.forEach((book, index) => { 

            // make sure that if the deleted book has isbn of that we want to delete (we get the isbn by the e.target.parentElement.previousElementSibling.textContent) way
            if (book.isbn === isbn) 
            {
                books.splice(index, 1)
            }   
        });

        localStorage.setItem(`books`, JSON.stringify(books)); // after deleting the item we want to save the changes to the local storage
    };

};

// ________________________________calling our methods____________________________


// display the  ready data from the local storage
Ui.displayBooks() 

// display user data on click
const submitBtn = document.getElementById("submitBtn");
submitBtn.addEventListener("click", (e) =>
{
    e.preventDefault(); // prevent the default value of the submit (just for precautions)


    Ui.displayData(); // display the user data and store it inside the localstorage
});


// delete data

document.querySelector(`#book-list`).addEventListener(`click`, function(e){ // make the table body the target

    Ui.deleteData(e.target) // call the delete method and pass to it the e.target
       
    Store.removeBooks(e.target.parentElement.previousElementSibling.textContent);//save the changes to the local storage ... (pass the isbn to identify the desired deleted book)
});



