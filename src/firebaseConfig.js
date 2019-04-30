import firebase from 'firebase';

// Information needed for connecting to database
const config = {
    apiKey: "AIzaSyBGDvQdCiWuHqvX8Q1LencFk9gO19l1-10",
    authDomain: "trent-chemistry.firebaseapp.com",
    databaseURL: "https://trent-chemistry.firebaseio.com",
    projectId: "trent-chemistry",
    storageBucket: "trent-chemistry.appspot.com",
    messagingSenderId: "357251055536"
  };

  // Initialize app to database
  firebase.initializeApp(config);


  // firebase can be imported on any component and referenced easily,
  //    saving having this code on each page
  export default firebase;