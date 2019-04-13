import React, { Component } from 'react';
import withFirebaseAuth from 'react-with-firebase-auth'
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './firebaseConfig';
import './App.css';
import Login from './Login.js';

const firebaseApp = firebase.initializeApp(firebaseConfig);

const firebaseAppAuth = firebaseApp.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

class App extends Component {
  constructor(props) {
    super(props);
    // this.state = {

    // }
  this.verifyUser = this.verifyUser.bind(this);
  }
  

  verifyUser() {
    if(this.props.user && this.props.user.email.endsWith(".trentu.ca")) {
      // if(this.props.user) {
        console.log("user")
        return (<button onClick={this.props.signOut}>Sign out</button>)
      }
      else {
        console.log("not user")
        // this.props.signOut()
        return(<button onClick={this.props.signInWithGoogle}>Sign in with Google</button>)

      }
  }

  render() {

    const {
      user,
      signOut,
      signInWithGoogle,
    } = this.props;

    console.log(user)

    return (
      <div className="App">
        <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          {
            user 
              ? <p>Hello, {user.displayName}</p>
              : <p>Please sign in.</p>
          }
          {
            this.verifyUser()
          }
        </header>
      </div>
    );

    // return (
    //   <div className="App">
    //     <Login />
    //   </div>
    // );
  }
}

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(App);
