import React, { PureComponent } from "react";
import Button from '@material-ui/core/Button';
import firebase from './firebaseConfig';

var database = firebase.database()

class StudentDashboard extends PureComponent {
  constructor(props) {
    super(props);
    this.gotOne = this.gotOne.bind(this);
  }

  componentDidMount() {
    let coursesRef = database.ref("courses")
    coursesRef.on("value", this.gotOne);
  }

  gotOne(data) {
    console.log(data.val())
    return(<p></p>)
    // this.setState({ coursesArray: Object.keys(data.val()) })
    // console.log(this.state.coursesArray)
  }

  render() {
    return (
      <div>
        <h1>Welcome, {this.props.name}</h1>
      </div>
    );
  }
}
export default StudentDashboard;