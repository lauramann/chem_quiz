import React, { Component } from 'react';
import withFirebaseAuth from 'react-with-firebase-auth'
import firebase from './firebaseConfig';
import './styling/App.css';
import 'typeface-roboto';
import Button from '@material-ui/core/Button';
import FacultyDashboard from './FacultyDashboard';
import StudentDashboard from './StudentDashboard';
import './styling/App.css';
import Avatar from '@material-ui/core/Avatar';

const firebaseAppAuth = firebase.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};
var database = firebase.database();
var usersRef = database.ref("users");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFaculty: null
    }
    this.verifyUser = this.verifyUser.bind(this);
    this.writeUserData = this.writeUserData.bind(this)
    this.readUserData = this.readUserData.bind(this);
    this.gotOne = this.gotOne.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.user && this.props.user) {
      this.readUserData(this.props.user.email)
    }
  }

  readUserData(email) {
    let userName = email.split('@')[0]
    let userRef = usersRef.child(userName)
    userRef.on("value", this.gotOne);
}

  writeUserData(email) {
    let userName = email.split('@')[0]
    let userRef = usersRef.child(userName)

    userRef.once('value', function (snapshot) {
      if (!snapshot.hasChild('isFaculty')) {
        userRef.update({ isFaculty: false });
      }
    });
  }

  gotOne(data) {
      this.setState({isFaculty: data.val().isFaculty})
  }

  verifyUser() {
    if (this.props.user && this.props.user.email.endsWith("@trentu.ca")) {

      this.writeUserData(this.props.user.email)
      return (
        <div>
          <Avatar alt="Remy Sharp" src={this.props.user.photoURL} className="avatar"/>
          <div id="signoutButton">
          <Button variant="contained" color="primary" onClick={this.props.signOut}>Sign out</Button>
          </div>
          {this.state.isFaculty === true
          ? <FacultyDashboard name={this.props.user.displayName} email={this.props.user.email.split('@')[0]} /> 
          : <StudentDashboard name={this.props.user.displayName} img={this.props.user.photoURL} username={this.props.user.email.split('@')[0]} />}
        </div>
      );
    }
    else {
      this.props.signOut()
      return (<div id="signinButton">
        <Button variant="contained" color="primary" onClick={this.props.signInWithGoogle}>Sign in with Google</Button>
        </div>)

    }
  }

  render() {
    const {
      user,
    } = this.props;


    return (
      <div className="App">
        <header className="App-header">
          {
            user
              ? <p></p> : <p className="signinNote">Please sign in.</p>
          }
          <div>{
            this.verifyUser()
          }
          </div>
        </header>
      </div>

    );
  }
}

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(App);
