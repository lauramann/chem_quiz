import React, { PureComponent } from "react";
// import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import CourseForm from './CourseForm';
import QuizForm from './QuizForm';
import firebase from './firebaseConfig';

var database = firebase.database()

class FacultyDashboard extends PureComponent {
  constructor(props) {
    super(props);
    this.createCourse = this.createCourse.bind(this);
    this.gotOne = this.gotOne.bind(this);
  }

  componentDidMount() {
    let coursesRef = database.ref("courses")
    coursesRef.on("value", this.gotOne);
  }

  gotOne(data) {
    console.log(data.val())
    // this.setState({ coursesArray: Object.keys(data.val()) })
    // console.log(this.state.coursesArray)
  }

  createCourse() {
    console.log("Create Course :)")
    return (<CourseForm />)
  }

  render() {
    return (
      <div>
        <h1>Welcome, {this.props.name}</h1>
        <Button variant="contained" color="primary" onClick={this.createCourse}>Add Course</Button>
        <CourseForm email={this.props.email} />
        <QuizForm />
      </div>
    );
  }
}
export default FacultyDashboard;