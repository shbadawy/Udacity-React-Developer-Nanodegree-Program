
import React from 'react'
import './App.css'
import * as DataAPI from './_DATA.js'
import {BrowserRouter  as Router,Route, Link,Switch} from 'react-router-dom'
import {withRouter} from 'react-router-dom'
import {Login, Home, SubmitPoll, PollDetails, CreatePoll, LeaderboardPage} from './Components'
import {store,recieveAllDataAction,selectUserAction} from "./store";

class App extends React.Component{  

  selectUser = (userName,users) => {
    
    const userInfo = Object.values(users).filter( (user) => user.id === userName) 
    store.dispatch(selectUserAction(userInfo))
  
  }

  componentDidMount() {

    Promise.all([
          DataAPI._getQuestions(),
          DataAPI._getUsers()
        ]).then( ([ polls, users ]) => {
            store.dispatch(recieveAllDataAction(polls,users))
      })

      store.subscribe(() => this.forceUpdate())
      
  }

  render(){

    const users = store.getState().user
    const polls = store.getState().poll
    const currentUser = store.getState().selectedUser
    
    return (
      <div>
      <Router>
      <Switch>

        <Route exact path='/'>
          {<Login users={users} selectUser={this.selectUser} redirectLink=''/>}
        </Route>

        <Route exact path='/questions/show/:userid' render= {(props) => (
          <Home {...props} polls={polls} user={currentUser} users={users} selectUser={this.selectUser}/>
        )} />
        
        <Route exact path='/questions/:question_id/submit' render= { (props) => (
          <SubmitPoll {...props} user={currentUser} users={users} selectUser={this.selectUser} polls={polls}/>
        )} />

        <Route exact path='/questions/:question_id' render= { (props) => (
          <PollDetails  {...props} user={currentUser} users={users} selectUser={this.selectUser} polls={polls}/>
        )}/>

        <Route exact path='/add' render= { (props) => (
          <CreatePoll {...props} user={currentUser} users={users} selectUser={this.selectUser} />
        )}/>

        <Route exact path= '/leaderboard' render= { (props) => (
          
          <LeaderboardPage {...props}  user={currentUser} users={users} selectUser={this.selectUser}/>

        )}/>

        <Route render= { (props) => (
          <div>
            <h1> 404 - Not Found! </h1>
            <Link to="/"> <button>Go Home</button></Link>
          </div>
        )}/>
      </Switch>
      </Router>
      </div>
    )

  }

}

export default withRouter( App );
//ENDUI

