
import React from 'react'
import * as DataAPI from './_DATA.js'
import {BrowserRouter  as Router,Route, Link,Switch} from 'react-router-dom'
import serializeForm from 'form-serialize'
import { Redirect } from 'react-router';
import {store, addPollAction, modifyPollAction,resetUserAction,modifyUserAction} from "./store";


class UnAnsweredPoll extends React.Component {

    state = {redirect:false}
    user = store.getState().selectedUser;
  
    submitAnswer = (e) =>{
  
        e.preventDefault();
        const values = serializeForm(e.target,{hash:true})
        const userID = this.user[0].id;
        const pollID = this.props.match.params.question_id
        const choise = values["choice"]
        const answer = {"authedUser": userID, "qid":pollID, "answer": choise };
        DataAPI._saveQuestionAnswer(answer).then ( () => {
  
          var selectedPoll = Object.values(store.getState().poll).filter ( (poll) => poll.id ===  pollID)[0];
          selectedPoll[values["choice"]].votes.push(userID);
          store.dispatch(modifyPollAction(selectedPoll));
  
          this.user[0].answers[pollID] = choise;
          const newUser = {};
          newUser[userID] = this.user[0];
          store.dispatch(modifyUserAction(newUser));
  
        } )
  
        this.setState({redirect:true});
  
      }
  
    render () {
      
      const users = this.props.users;
      const redirect = this.state.redirect;
      if (redirect){return <Redirect to={`/questions/show/${this.user[0].id}`} />}
      else {
  
        return(
          <div>
          {Object.values(this.props.polls).filter ( (poll) => poll.id === this.props.match.params.question_id).map( (poll) => (
    
            <div key={poll.id}>
            <img src={ Object.values(users).filter((user) => user.id === poll.author)[0].avatarURL} width="30" height="30" class="pl-3" alt="profile pic"/>
            <p>Authered by: {poll.author}</p>
            <p>Would you rather ...</p>
            <form onSubmit={this.submitAnswer} >
              <input type="radio"
               name="choice"
               value="optionOne"
              />
              <label for="choice1">{poll.optionOne.text}</label>
              <br></br>
              <input type="radio"
               name="choice"
               value="optionTwo"
              />
              <label for="choice2">{poll.optionTwo.text}</label>
              <br></br>
              <br></br>
              <button type="submit">Submit</button>
            </form>
    
          </div>
    
          )) }
    
    
          </div>
    
        )
  
      }
     }
  
  }
  
  
  class AnsweredPoll extends React.Component {
  
    render () {
  
      const polls = this.props.polls;
      const qID = this.props.match.params.question_id;
      const user =  this.props.user ;
      const users = this.props.users;
       const answers= user[0].answers;
  
      return(
        <div>
            {Object.values(polls).filter ( (poll) => poll.id === qID).map ( (poll) =>(
              <div key={poll.id}>
                <img src={ Object.values(users).filter((user) => user.id === poll.author)[0].avatarURL} width="30" height="30" class="pl-3" alt="profile pic"/>
                <p> Authored by : {poll.author}</p>
                <p> Would you rather ... </p>
                <p> {poll.optionOne.text} : {poll.optionOne.votes.length} ({((poll.optionOne.votes.length)/(poll.optionOne.votes.length+poll.optionTwo.votes.length))*100}%) {answers[poll.id]==="optionOne"?"(✔)":""}</p>
                <p> {poll.optionTwo.text} : {poll.optionTwo.votes.length} ({((poll.optionTwo.votes.length)/(poll.optionOne.votes.length+poll.optionTwo.votes.length))*100}%) {answers[poll.id]==="optionTwo"?"(✔)":""}</p>
              </div>
            ))}
        </div>
      )}
  
  }
  
  class Polls extends React.Component {    
    
      sortPolls = (polls) => {
  
        var result = []
        var i = 0;
        
        polls.forEach( (poll) => {
          for (i=0 ; i<result.length; i++){
            
            if (poll.timestamp >= result[i].timestamp) { break;}
  
          }
          result.splice(i, 0, poll);
        });
          return result;
  
      }
  
      render(){
        
        const userID = this.props.match.params.userid;
        const polls = this.props.polls;
  
        const answeredPolls = Object.values(polls).filter( (poll) => (poll.optionOne.votes.includes(userID) || poll.optionTwo.votes.includes(userID)) ).map( (poll) => poll)
        const unansweredPolls = Object.values(polls).filter( (poll) => (!poll.optionOne.votes.includes(userID) && !poll.optionTwo.votes.includes(userID)) ).map( (poll) => poll )
  
        const sortedAnsweredPolls = this.sortPolls(answeredPolls)
        const sortedUnAnsweredPolls = this.sortPolls(unansweredPolls)
  
        return (
          <div >
  
            <div class="hidden" id="answered-section">
              <h1> Answered </h1>
              <ul>
                 {sortedAnsweredPolls.map ((poll) => (
  
                        <li key={poll.id}>{
                          <div>
                            <p>Authored By: {poll.author}</p>
                            <p> Would you rather</p>
                            <p>{poll.optionOne.text}</p>
                            <Link to={`/questions/${poll.id}`}><button> View Poll </button> </Link>
                          </div>
                        }</li>
  
                      ))
                      
  
                }</ul>
            </div>
  
            <div id="unanswered-section">
                <h1> Un-Answered </h1>
                <ul>
                {sortedUnAnsweredPolls.map( (poll) => (
                  <li key={poll.id}>{
                    <div>
                      <p>Authored By: {poll.author}</p>
                      <p> Would you rather</p>
                      <p>{poll.optionOne.text}</p>
                      <Link to={`/questions/${poll.id}/submit`}><button> View Poll </button> </Link>
                    </div>
                  }</li>
  
                ))
                 
                }</ul>
            </div>
  
          </div>
        )}
  
  }
  
  class NavBarItems extends React.Component{
  
    resetUser = () => {store.dispatch(resetUserAction())}
  
    render (){
      const navBarData = {"/questions/show/":"Home","/add": "New poll", "/leaderboard":"Leaderboard", "/":"Logout"};
      const userID = this.props.userInfo.id; 
      const userImage =  this.props.userInfo.avatarURL;
      const userName  =  this.props.userInfo.name;
  
      return (
  
        <div >
            <nav class="navbar navbar-expand-lg navbar navbar-dark bg-primary">
              <a class="navbar-brand" href="/#">
                <img src={userImage} width="30" height="30" class="pl-3" alt="profile pic"/>
              </a>
              <span class="navbar-text">{userName}</span>
              <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse mr-5" id="navbarNav">
                <ul class="navbar-nav">{
                    Object.entries(navBarData).map ( (data,i) => (
                      <li class={`nav-item ${i===0?"active":""}`} key={i}>
                        <Link to={`${data[0]}${data[1]==="Home"?userID:""}`}> <a class="nav-link" href="/#" onClick = { data[1] === "Logout"? this.resetUser : ()=>{} }>{data[1]}</a> </Link>
                      </li>
                    ))
                    }</ul>
                    
              </div>
            </nav>
          </div>
  
      )
  
    }
  
  }
  class NavBar extends React.Component {
  
    render(){
  
      const userInfo =  this.props.user[0];
  
      return (
      
            <NavBarItems userInfo={userInfo}/> 
  
      )
  
    }
  
  }
  
  class Leaderboard extends React.Component {
  
      getData = (users) =>{
        var data = []
  
        Object.values(users).forEach( (user) => {
          data.push({"total":user.questions.length+Object.values(user.answers).length,
                      "picture":user.avatarURL, 
                      "username":user.id, 
                      "questions asked":user.questions.length, 
                      "questions answered":Object.values(user.answers).length})
        })
        
        return data;
  
      }
  
      sortData = (data) => {
  
          var result = []
          var i = 0;
          
          data.forEach( (entryObject) => {
            
            for (i=0 ; i<data.length; i++){
  
              if (entryObject.total <= data[i].total) break;
  
            }
  
            for (i ; i<data.length; i++){
  
              if (entryObject.total >= data[i].total) break;
  
            }
  
            result.splice(i, 0, entryObject);
  
          });
  
          return result;
  
      }
      render(){
  
        const users = this.props.users;
        const data = this.getData(users);
        const sortedData = this.sortData(data);
  
        return(
  
          <div>
              <table class="table table-borderless table-responsive">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Total</th>
                    <th scope="col">Avatar</th>
                    <th scope="col">Username</th>
                    <th scope="col">Question asked</th>
                    <th scope="col">Question answered</th>
                  </tr>
                </thead>
                <tbody>{
                  sortedData.map ( (object,i) => (
                      
                    <tr key={i}>
                      <th scope="row">{i+1}</th>
                      {
                      Object.values(object).map( (entry,j) => (
  
                          <td>{ j===1? <img src={entry} width="30" height="30" class="pl-3" alt="profile pic"/> : entry}</td>
  
                        ) )
                    }</tr>
                      
  
                  ))
                  }</tbody>
              </table>
          </div>
  
        )
  
  
      }
  
  }
  
  export class Login extends React.Component {
  
    render(){
  
      return(
  
        <div>
              <h1>Select a user</h1>
              <div>
              {  
                Object.values(this.props.users).map ( (user) => (
                <div key={user.id}>
                  <p style={{display:"inline"}} >{user.id}</p>
                  <Link to={this.props.redirectLink === '' ? `/questions/show/${user.id}` :  this.props.redirectLink}><button onClick={()=>{this.props.selectUser(user.id,this.props.users)}}>Select</button></Link>
                </div>
                ))
              }
              </div>
            </div>
  
      )
  
    }
  
  }
  
  class HomeItems extends React.Component{
  
    switchTab = (tabID) => {
  
      if(tabID === 1){
  
        document.getElementById("unanswered-section").classList.remove("hidden");
        document.getElementById("unanswered-section").classList.add("active");
  
        document.getElementById("answered-section").classList.add("hidden");
        document.getElementById("answered-section").classList.remove("active");
  
      }
      else if (tabID === 2)  {
  
        document.getElementById("unanswered-section").classList.add("hidden");
        document.getElementById("unanswered-section").classList.remove("active");
  
        document.getElementById("answered-section").classList.remove("hidden");
        document.getElementById("answered-section").classList.add("active");
  
      }
      
    }
  
    render(){
  
      return (
  
        <div>
            <NavBar user={this.props.user}/>
  
            <ul class="nav nav-tabs">
              <li class="nav-item" >
                <a class="nav-link active"  onClick={()=>{this.switchTab(1)}}>Un-answered polls</a>
              </li>
              <li class="nav-item" >
                <a class="nav-link"  onClick={()=>{this.switchTab(2)}}>answered polls</a>
              </li>
            </ul>
  
            <div>{<Polls {...this.props} polls={this.props.polls} user={this.props.user}/>}</div>
  
            </div>
  
      )
  
    }
  
  }
  
  export class Home extends React.Component {
  
    render(){
  
      return this.props.user === undefined || this.props.user.length === 0  ? <Login users={this.props.users} selectUser={this.props.selectUser} redirectLink={this.props.location.pathname}/> : <HomeItems {...this.props} polls={this.props.polls} user={this.props.user}/>
  
    }
  
  }
  
   class SubmitPollItems extends React.Component {
  
    render() {
  
      return(
  
        <div>
          <NavBar user={this.props.user}/>
          <UnAnsweredPoll {...this.props} polls={this.props.polls} user={this.props.user} users={this.props.users}/>
        </div>
  
      )
  
    }
  
  }
  
  export class SubmitPoll extends React.Component {
  
    render() {
  
      return this.props.user === undefined || this.props.user.length === 0  ? <Login users={this.props.users} selectUser={this.props.selectUser} redirectLink={this.props.location.pathname}/> : <SubmitPollItems {...this.props} user={this.props.user} polls={this.props.polls} users={this.props.users}/>
  
    }
  
  }
  
  class PollDetailsItems extends React.Component {
  
    render(){
  
      return (
  
        <div>
              <NavBar user={this.props.user}/>
              <AnsweredPoll {...this.props} polls= {this.props.polls} user={this.props.user} users={this.props.users}/>
        </div>
  
      )
  
    }
  
  }
  
  export class PollDetails extends React.Component {
  
    render() {
  
      return this.props.user === undefined || this.props.user.length === 0  ? <Login users={this.props.users} selectUser={this.props.selectUser} redirectLink={this.props.location.pathname}/> : <PollDetailsItems {...this.props} user={this.props.user} polls={this.props.polls} users={this.props.users}/>
  
    }
  
  }
  
  class LeaderboardItems extends React.Component {
  
    render() {
  
      return (
  
        <div>
          <NavBar user={this.props.user}/>
          <Leaderboard users={this.props.users}/>
        </div>
  
      )
  
    }
  
  }
  
  export class LeaderboardPage extends React.Component {
  
    render(){
      return this.props.user === undefined || this.props.user.length === 0 ? <Login users={this.props.users} selectUser={this.props.selectUser} redirectLink={this.props.location.pathname}/> : <LeaderboardItems user={this.props.user} users={this.props.users}/>
  
    }
  
  }
  
  class CreatePollItems extends React.Component {
  
    state = {redirect:false}
    user = store.getState().selectedUser
  
    addNewPoll = (e) => {
  
      e.preventDefault()
      const values = serializeForm(e.target,{hash:true})
      const question = {"optionOneText":values.option1, "optionTwoText":values.option2, "author": this.user[0].id}
      DataAPI._saveQuestion(question).then( (result) => {store.dispatch(addPollAction(result)) ;} )
      this.setState({redirect:true})
  
    }
  
    render() {
      const redirect = this.state.redirect;
      if (redirect) {return <Redirect to={`/questions/show/${this.user[0].id}`}/>}
      else {
  
        return(
  
          <div>
                <NavBar user={this.props.user}/>
                <form onSubmit={this.addNewPoll}>
                <p>Would you rather</p>
                
                <p>Option one</p>
                <input type="text"
                   name="option1"
                   placeholder="Option one text"
                />
    
                <p>Option two</p>
                <input type="text"
                   name="option2"
                   placeholder="Option two text"
                />
    
              <button type="submit">Submit</button>
                </form>
              </div>
    
        )
  
      }  
  
    }
  
  }
  
  export class CreatePoll extends React.Component{
  
    render(){
  
        return this.props.user === undefined || this.props.user.length === 0  ? <Login users={this.props.users} selectUser={this.props.selectUser} redirectLink={this.props.location.pathname}/> : <CreatePollItems user={this.props.user}/>
  
    }
  
  }