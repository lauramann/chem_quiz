import React, { Component } from 'react';
import withFirebaseAuth from 'react-with-firebase-auth'
import firebase from 'firebase';
import 'firebase/auth';
import firebaseConfig from './firebaseConfig';
import './App.css';
import 'typeface-roboto';
import Button from '@material-ui/core/Button';
import FacultyDashboard from './FacultyDashboard';
import "./App.css";

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};
var database = firebase.database();
var usersRef = database.ref("users");

class App extends Component {
  constructor(props) {
    super(props);
    this.verifyUser = this.verifyUser.bind(this);
    this.writeInitialUserData = this.writeInitialUserData.bind(this)
  }

  writeInitialUserData(email) {
    let userName = email.split('@')[0]
    let userRef = usersRef.child(userName)
    userRef.update({isFaculty: false});
  }

  verifyUser() {
    if (this.props.user && this.props.user.email.endsWith("@trentu.ca")) {

      this.writeInitialUserData(this.props.user.email)
      return (
        <div>
          <Button variant="contained" color="primary" onClick={this.props.signOut}>Sign out</Button>
          <FacultyDashboard name={this.props.user.displayName} />
        </div>
      );
    }
    else {
      // console.log("not user")
      this.props.signOut()
      return (<Button variant="contained" color="primary" onClick={this.props.signInWithGoogle}>Sign in with Google</Button>)

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
              ? <p></p> : <p>Please sign in.</p>
          }
          {
            this.verifyUser()
          }
        </header>
        {/* {this.state.isAuth} ?  */}
      </div>

    );
  }
}

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(App);
