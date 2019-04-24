import React, { PureComponent } from "react";
// import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import CourseForm from './CourseForm';
import QuizForm from './QuizForm';
import firebase from './firebaseConfig';
import Skipper from './Skipper';

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
    return(<p></p>)
  }

  createCourse() {
    return (<CourseForm />)
  }

  render() {
    return (
      <div>
        <h1>Welcome, {this.props.name}</h1>
        <h2>Faculty Dashboard</h2>
        {/* <Skipper /> */}
        <Button variant="contained" color="primary" onClick={this.createCourse}>Add Course</Button>
        <CourseForm email={this.props.email} />
        <QuizForm />
      </div>
    );
  }
}
export default FacultyDashboard;