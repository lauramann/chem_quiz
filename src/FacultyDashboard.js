import React, { PureComponent } from "react";
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import CourseForm from './CourseForm';
import QuizForm from './QuizForm';

class FacultyDashboard extends PureComponent {
    constructor(props) {
        super(props);
        this.createCourse = this.createCourse.bind(this);
      }

      createCourse() {
          console.log("Create Course :)")
        return(<CourseForm />)
      }


  render() {
    return (
        <div>
          <h1>Welcome, {this.props.name}</h1>
          <Button variant="contained" color="primary" onClick={this.createCourse}>Add Course</Button>
        <CourseForm email={this.props.email}/>
        <QuizForm />
        </div>
      );
  }
}
export default FacultyDashboard;