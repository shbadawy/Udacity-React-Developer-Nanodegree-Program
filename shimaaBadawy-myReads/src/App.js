import React from 'react'
// import * as BooksAPI from './BooksAPI'
import './App.css'
import {Link} from 'react-router-dom'
import {Route} from 'react-router-dom'
import  * as BookAPI from './BooksAPI'
import serializeForm from 'form-serialize'

class Book extends React.Component{

render(){

const book = this.props.book
var url = null
if (book.imageLinks != null){ url = "url('" + book.imageLinks.thumbnail+ "')" || null}
else { url = "url()"}
return (
    <div className="book-top">

      <div className="book-cover" style={{ width: 128, height: 188, backgroundImage: url}}></div>
      <div className="book-shelf-changer">
        <select name='selectCategory' defaultValue={book.shelf || 'none'} onChange={ (event) => this.props.changeBookCategory(event.target.value,book)}>
          <option value="move" disabled >Move to...</option>
          <option value="currentlyReading">Currently Reading</option>
          <option value="wantToRead">Want to Read</option>
          <option value="read">Read</option>
          <option value="none">None</option>
        </select>
      </div>
      <div className="book-title" ><p>{book.title}</p></div>
      <div className="book-authors"><p>{book.authors}</p></div>

    </div>

)//Return

}//Render

}//Class

class BookShelf extends React.Component{
// Currently Reading
render() {
  return (
    <div>
    <div className="bookshelf">
    <h2 className="bookshelf-title">{this.props.bookshelfTitle}</h2>
    <div className="bookshelf-books">
    <ol className="books-grid">
      {
        this.props.books.filter( (book) => (

          book.shelf === this.props.shelf

       )).map( (book) => (

        <li key={book.id}>

        <Book
          book={book}
          changeBookCategory={this.props.changeBookCategory}
        />

        </li>

      ))}
    </ol>
    </div>
    </div>
    </div>
  )//Return

}//Render

}//Class

class SearchResults extends React.Component{
// Currently Reading
render() {
  return (
    <div>
    <ol className="books-grid">
      {
        this.props.books.map( (book) => (

        <li key={book.id}>

        <Book
          book={book}
          changeBookCategory={this.props.changeBookCategory}
        />

        </li>

      ))}
    </ol>
    </div>

  )//Return

}//Render

}//Class

class BooksApp extends React.Component {

state = {
  allBooks:[],
  searchResults:[]
}

  getAllBooks = () => {

    BookAPI.getAll()
    .then( (allBooksData) => {
      this.setState({allBooks:allBooksData})})

}

// state = {books:[]}//JSON.parse( localStorage.getItem('state') ) || initialState;

changeBookCategory = (shelf,book) => {

    BookAPI.update(book,shelf)
    .then(this.getAllBooks)


}

getSearchResult = (e) => {
e.preventDefault()
this.setState({searchResults:[]})

const values = serializeForm(e.target,{hash:true})

if (values.bookName){
  var myBooks =  Object.values(this.state.allBooks)
  var searchList=[]

  BookAPI.search(values.bookName)
  .then(  (bookEntry) => {
       if (bookEntry.error == null ){

         Object.values(bookEntry).forEach ((book) => {

           myBooks.forEach((myBook) => {

              if (myBook.id === book.id){ book.shelf = myBook.shelf }//isFound = true;}

           })
            searchList.push(book);

         })

         this.setState({searchResults:searchList})

       }

  })

}//If

}//Function

resetSearch = () => {

  this.setState ({searchResults:[]})

}

componentDidMount() {

this.getAllBooks()

}

  render() {

    return (
      <div className="app">
      <Route exact path='/search' render={() => (

        <div className="search-books">
          <div className="search-books-bar">
          <Link className="close-search" to='/' onClick={this.resetSearch }> Close </Link>
            <div className="search-books-input-wrapper">
            <form onSubmit={this.getSearchResult}>
              <input type="text"
               name="bookName"
               placeholder="Search by title or author"
              />
            </form>
            </div>
          </div>
          <SearchResults
            books={this.state.searchResults}
            changeBookCategory={this.changeBookCategory}
          />
        </div>
      )}/>


      <Route exact path='/' render={()=> (
        <div className="list-books">
          <div className="list-books-title">
            <h1>MyReads</h1>
          </div>
          <div className="list-books-content">
              <BookShelf
                bookshelfTitle="Want to Read"
                shelf="wantToRead"
                books={this.state.allBooks}
                changeBookCategory={this.changeBookCategory}
              />

              <BookShelf
                bookshelfTitle="Read"
                shelf="read"
                books={this.state.allBooks}
                changeBookCategory={this.changeBookCategory}
              />

              <BookShelf
                bookshelfTitle="Reading"
                shelf="currentlyReading"
                books={this.state.allBooks}
                changeBookCategory={this.changeBookCategory}
              />

          </div>
          <div className="open-search">
          <Link to='/search'>  <button > Add a book   </button></Link>

      </div>
    </div>
)}/>
</div>
     )//Return
  }//Render
}//Class

export default BooksApp
