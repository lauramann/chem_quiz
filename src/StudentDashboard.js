import React, { PureComponent } from "react";
// import Button from '@material-ui/core/Button';
import firebase from './firebaseConfig';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

var database = firebase.database()

class StudentDashboard extends PureComponent {
  constructor(props) {
    super(props);
    this.gotOne = this.gotOne.bind(this);
    this.state = {
      courses: {},
      coursesArray: []
    }
    this.showCourses = this.showCourses.bind(this);
  }

  componentDidMount() {
    let coursesRef = database.ref("courses")
    coursesRef.on("value", this.gotOne);
  }

  gotOne(data) {
    let coursesArray = Object.keys(data.val())
    this.setState({ 
      courses: data.val(),
      coursesArray: coursesArray
     })
    
  }

  showCourses() {
    let coursesArray = Object.keys(this.state.courses)
    let individualCourses = Object.values(this.state.courses)
    let entries = Object.entries(this.state.courses)
    let course1 = individualCourses[0]
    let stateCourses = this.state.courses
    let quizzes = []
    console.log(entries)
    let dataStruc = individualCourses[0]
    // if(dataStruc != undefined)
    //   console.log(Object.values(dataStruc.quizzes).name)

      if(individualCourses !=undefined){
        individualCourses.map((course) =>(
          <div>
            {console.log(course.courseName)}
          {console.log(course.quizzes)}
          {Object.values(course.quizzes).map((quiz)=> (
            console.log(quiz.name)
          ))}
          </div>
        )) 
      }


  }

  render() {
    // console.log(this.state.courses)
    return (
      <div>
        {this.showCourses()}
        <h1>Welcome, {this.props.name}</h1>
        <h2>Student Dashboard</h2>
        <InputLabel>Course</InputLabel>
        <Select
          id="course"
          value={this.state.courseCode}
          onChange={this.handleChange}
          inputProps={{
            name: 'courseCode',
            id: 'course-code',
          }}
        >
          {this.state.coursesArray.map((course) =>
            <MenuItem key={course} value={course}>{course}</MenuItem>)}
        </Select>
        
      </div>
    );
  }
}
export default StudentDashboard;