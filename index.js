const express = require("express");

var bodyParser = require("body-parser"); //to access the post data we have to use bodyParser


//Database
const database = require("./database");


//initialize express
const booky = express();

booky.use(bodyParser.urlencoded({extended: true})); 
booky.use(bodyParser.json());


/*
Route           /
Description     get all the books
Access          PUBLIC
Parameter       NONE
Methods         GET
*/


booky.get("/", (req,res)=>{
    return res.json({books:database.books});
});

/*
Route           /is
Description     get specific book on ISBN
Access          PUBLIC
Parameter       isbn
Methods         GET
*/

booky.get("/is/:isbn",(req,res)=>{
    const getSpecificBook = database.books.filter(
        (book) =>book.ISBN === req.params.isbn
    );

    if(getSpecificBook.length ===0){
        return res.json({error: `No book found for ISBN of ${req.params.isbn}`})
    }

    return res.json({book: getSpecificBook});
});

/*
Route           /c
Description     get specific book on category
Access          PUBLIC
Parameter       category
Methods         GET
*/


booky.get("/c/:category", (req,res) =>{
    const getSpecificBook = database.books.filter(
        (book) =>book.category.includes(req.params.category)
    );

    if(getSpecificBook.length===0){
        return res.json({error: `No book found for category ${req.params.category}`})
    }

    return res.json({book: getSpecificBook});
});


/*
Route           /lang
Description     get list of book based on language
Access          PUBLIC
Parameter       language
Methods         GET
*/

booky.get("/lang/:language",(req,res)=>{
    const getSpecificBook = database.books.filter(
        (book) => book.language.includes(req.params.language)
    );

    if(getSpecificBook.length===0){
        return res.json({error: `No book found for language ${req.params.language}`})
    }

    return res.json({book : getSpecificBook})
});


//for authors

/*
Route           /author
Description     get all authors
Access          PUBLIC
Parameter       NONE
Methods         GET
*/


booky.get("/author",(req,res) =>{
    return res.json({authors: database.author});
});


/*
Route           /id
Description     get specific author
Access          PUBLIC
Parameter       id
Methods         GET
*/


booky.get("/id/:id", (req,res)=>{
    const authorId = parseInt(req.params.id); // Parse the id to an integer
    const getSpecificAuthor = database.author.filter((author) => author.id === authorId);

    if(getSpecificAuthor.length===0){
        return res.json({error: `No author found for id ${req.params.id}`})

    }

    return res.json({author:getSpecificAuthor})
});

/*
Route           /author/book
Description     get all authors based on books
Access          PUBLIC
Parameter       isbn
Methods         GET
*/

booky.get("/author/books/:isbn", (req,res)=>{
    const getSpecificAuthor = database.author.filter(
        (author) => author.books.includes(req.params.isbn)
    );

    if(getSpecificAuthor.length ===0){
        return res.json({
            error: `No author found for the book of ${req.params.isbn}`
        })
    }

    return res.json({authors: getSpecificAuthor});
});


// For publication

/*
Route           /publications
Description     get all publications
Access          PUBLIC
Parameter       NONE
Methods         GET
*/

booky.get("/publications",(req,res)=>{
    return res.json({publications:database.publication});
});


/*
Route           /publications/:id
Description     get specific publication
Access          PUBLIC
Parameter       id
Methods         GET
*/

booky.get("/publications/:id", (req,res)=>{
    const publicationId = parseInt(req.params.id)
    const getSpecificPublication = database.publication.filter(
        (publication)=> publication.id === publicationId
    );

    if(getSpecificPublication.length ===0){
        return res.json({error: `No book found for id of ${req.params.id}`})
    }

    return res.json({publication: getSpecificPublication});
});

/*
Route           /publications/books/:isbn
Description     get list of publication based on  book
Access          PUBLIC
Parameter       isbn
Methods         GET
*/


booky.get("/publications/books/:isbn", (req,res)=>{
    const getSpecificPublication = database.author.filter(
        (author) => author.books.includes(req.params.isbn)
    );

    if(getSpecificPublication.length ===0){
        return res.json({
            error: `No author found for the book of ${req.params.isbn}`
        })
    }

    return res.json({authors: getSpecificPublication});
});

//POST 

/*
Route           /book/new
Description     add new books
Access          PUBLIC
Parameter       NONE
Methods         POST
*/

booky.post("/book/new", (req,res)=>{
    const newBook = req.body;
    database.books.push(newBook);
    return res.json({updatedBooks : database.books})
})

/*
Route           /author/new
Description     add new authors
Access          PUBLIC
Parameter       NONE
Methods         POST
*/

booky.post("/author/new",(req,res)=>{
    const newAuthor=req.body;
    database.author.push(newAuthor);
    return res.json(database.author);
});

/*
Route           /publication/new
Description     add new publications
Access          PUBLIC
Parameter       NONE
Methods         POST
*/

booky.post("/publication/new",(req,res)=>{
    const newPublication = req.body;
    database.publication.push(newPublication);
    return res.json(database.publication);
});

// PUT REQUEST

/*
Route           /publication/update/book
Description     update/add new publication
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/

booky.put("/publication/update/book/:isbn" , (req,res) => {
    //update the publication database
    database.publication.forEach((pub) =>{
        if(pub.id === req.body.pubId) {
            return pub.books.push(req.params.isbn);
        }
    });

    //update the book database
    database.books.forEach((book)=>{
        if(book.ISBN === req.params.isbn) {
            book.publications = req.body.pubId;
            return;
        }
    });

    return res.json(
        {
            books : database.books,
            publications:database.publication ,
            message : "Successfully updated publications"
        }
    )
});


// DELETE REQUEST

/*
Route           /book/delete
Description     delete a book
Access          PUBLIC
Parameter       isbn
Methods         DELETE
*/

booky.delete("/book/delete/:isbn" , (req,res)=>{
    //Whichever book that does not match with the isbn, just send it to 
    // updatedBookDatabase array and rest will be filtered out

    const updatedBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn
    )

    database.books = updatedBookDatabase;

    return res.json({books: database.books})
});



/*
Route           /book/delete/author
Description     delete an author from a book and vice versa
Access          PUBLIC
Parameter       isbn , authorId
Methods         DELETE
*/


booky.delete("/book/delete/author/:isbn/:authorId", (req,res) =>{
    //update the book database
    database.books.forEach((book)=>{
        if(book.ISBN === req.params.isbn) {
            const newAuthorList = book.author.filter(
                (eachAuthor)=> eachAuthor !== parseInt(req.params.authorId)
            );
            book.author = newAuthorList;
            return;

        }
    });

    //update the author database
    database.author.forEach((eachAuthor) => {
        if(eachAuthor.id === parseInt(req.params.authorId)) {
            const newBookList = eachAuthor.books.filter(
                (book) => book !== req.params.isbn
            );
            eachAuthor.books = newBookList;
            return;
        }
    });
    return res.json({
        book: database.books,
        author : database.author,
        message : "Author was deleted !!"
    });
});




booky.listen(3000, ()=>{
    console.log("server is up and running");
});

