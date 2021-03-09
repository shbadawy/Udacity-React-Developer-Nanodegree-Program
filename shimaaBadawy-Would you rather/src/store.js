import { combineReducers , createStore } from 'redux'

const CREATE_POLL = 'create_poll';
const MODIFY_POLL = 'create_poll';
const GET_POLL = 'get_poll';
const RECIEVE_DATA = 'recieve_data';
const SELECT_USER = 'select_user';
const RESET_USER = 'reset_user';
const MODIFY_USER = 'modify_user';


export function addPollAction (poll) {

  return {
    type: CREATE_POLL,
    poll
  }

}

export function modifyPollAction (poll){

  return {
    type:MODIFY_POLL,
    poll

  }

}

export function recieveAllDataAction (polls,users){

  return {
    type: RECIEVE_DATA,
    polls,
    users
  }

}

export function selectUserAction (user) {

  return {
    type: SELECT_USER,
    user
  }

}

export function resetUserAction () {

  return {
    type: RESET_USER
  }

}

export function modifyUserAction (user){

  return {
    type:MODIFY_USER,
    user

  }

}

function poll (store = [], action) {

  switch (action.type) {

    case CREATE_POLL:
      store[action.poll.id] = action.poll;
      return store;

    case MODIFY_POLL:
      return store.map( (poll) =>
      poll.id !== action.poll.id ? poll : Object.assign({},action.poll)
    )
    case GET_POLL:
      return store.filter( (poll) => poll.id === action.id)

    case RECIEVE_DATA:
      return action.polls

    default:
    return store

  }//SWITCH

}

function user (store=[], action) {

    switch (action.type){

      case RECIEVE_DATA:
      return action.users;

      case MODIFY_USER:
        return Object.values(store).map( (user) =>
        user.id !== action.user.id ? user : Object.assign({},action.uset)
        )

      default:
      return store;

    }
}

function selectedUser (store=[], action){

  switch (action.type) {

    case SELECT_USER:
      return action.user

    case RESET_USER:
      return []

    default:
      return store

  }

}

export const store = createStore(combineReducers({poll,user,selectedUser}))

 