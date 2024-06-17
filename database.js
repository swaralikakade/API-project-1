//creating a database

const books =[
    {
        ISBN:"12345Book",
        title:"Tesla",
        pubDate:"2024-06-15",
        language:"en",
        numPage:"250",
        author:[1,2] ,//ids of two authors
        publications:[1],
        category:["tech", "space","education"]

    }

]

const author = [
    {
       id:1,
       name:"Swarali" ,
       books:["12345Book","secretBook"]
    },
    {
        id:2,
        name:"Elon Musk",
        books:["12345Book"]

    }
]


const publication =[
    {
        id:1,
        name:"writex",
        books:["12345Book"]
    },
    {
        id:2,
        name:"writex2",
        books:[]
    }
]


//to export this dataset

module.exports = {books,author, publication};