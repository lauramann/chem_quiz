import React, { Component } from 'react';
import withFirebaseAuth from 'react-with-firebase-auth'
import firebase from './firebaseConfig';
import Button from '@material-ui/core/Button';
import FacultyDashboard from './components/FacultyDashboard';
import StudentDashboard from './components/StudentDashboard';
import Avatar from '@material-ui/core/Avatar';
import './styling/App.css';
import './styling/App.css';
import 'typeface-roboto';

// Connect to firebase
const firebaseAppAuth = firebase.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};
//Set reference to users table in database to usersRef
var database = firebase.database();
var usersRef = database.ref("users");

// App class
// Whole application starts from this class
// ----------------------------------------------------------------------------------
// state explanations:
//    isFaculty: bool -> determines whether user is faculty or not (therefore student)
// ----------------------------------------------------------------------------------
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFaculty: null
    }

    // declare methods
    this.verifyUser = this.verifyUser.bind(this);
    this.writeUserData = this.writeUserData.bind(this)
    this.readUserData = this.readUserData.bind(this);
    this.gotOne = this.gotOne.bind(this);
  }

  // calls readUserData after updating occurs
  // prevents calling state in an infinite loop
  componentDidUpdate(prevProps) {
    if (!prevProps.user && this.props.user) {
      this.readUserData(this.props.user.email)
    }
  }

  // gets username from email and creates reference in database
  readUserData(email) {
    let userName = email.split('@')[0]
    let userRef = usersRef.child(userName)
    userRef.on("value", this.gotOne);
  }

  // sets data from readUserData to state
  gotOne(data) {
    this.setState({ isFaculty: data.val().isFaculty })
  }

  // gets username from email and adds user to database
  writeUserData(email) {
    let userName = email.split('@')[0]
    let userRef = usersRef.child(userName)

    // if user is not already in the database, initially add them as a student
    // when a faculty signs into system, they will manually have to be changed in db
    userRef.once('value', function (snapshot) {
      if (!snapshot.hasChild('isFaculty')) {
        userRef.update({ isFaculty: false });
      }
    });
  }

  // ensures that user is from Trent University and displays faculty or student dashboard
  verifyUser() {
    // user must have email address from trent u
    // *this could be taken out for testing with outlook for staff
    if (this.props.user && this.props.user.email.endsWith("@trentu.ca")) {
      // add user to db
      this.writeUserData(this.props.user.email)
      return (
        // displayed at the top of the page regardless of their status: signout and avatar
        <div>
          <Avatar alt="Remy Sharp" src={this.props.user.photoURL} className="avatar" />
          <div id="signoutButton">
            <Button variant="contained" color="primary" onClick={this.props.signOut}>Sign out</Button>
          </div>
          
          {/* if user is faculty, display faculty dashboard, otherwise display student dashboard */}
          {this.state.isFaculty === true
            ? <FacultyDashboard name={this.props.user.displayName} email={this.props.user.email.split('@')[0]} />
            : <StudentDashboard name={this.props.user.displayName} img={this.props.user.photoURL} username={this.props.user.email.split('@')[0]} />}
        </div>
      );
    }

    // if email isn't from Trent U, revert back to login page
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
        {/* Display sign in */}
        {/* If you want to test without having to sign in each time you update, 
            comment out the following 8 lines and uncomment the line displaying
            FacultyDashboard or StudentDashboard */}
          {
            user
              ? <p></p> : <p className="signinNote">Please sign in.</p>
          }
          <div>{
            this.verifyUser()
          }
          </div>
          {/* <FacultyDashboard /> */}
          {/* <StudentDashboard /> */}
        </header>
      </div>

    );
  }
}

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(App);
