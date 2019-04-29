import React, { PureComponent } from "react";
// import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import CourseForm from './CourseForm';
import QuizForm from './QuizForm';
import firebase from '../firebaseConfig';
import AddCircle from '@material-ui/icons/AddCircle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import {Card, CardContent, CardActions, Typography} from '@material-ui/core';

var database = firebase.database()
var coursesRef = database.ref("courses");

var database = firebase.database()

class FacultyDashboard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showCourseForm: false,
      showQuizForm: false,
      courses: {},
      coursesArray: [],
      open: false,
      courseCode: '',
      courseName: '',
      submit: true
    }

    this.showCourses = this.showCourses.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.createCourse = this.createCourse.bind(this);
    this.gotOne = this.gotOne.bind(this);
    this.createQuestion = this.createQuestion.bind(this);
  }

  handleChange(event) {
    let changeObj = {}
    changeObj[event.target.id] = event.target.value
    this.setState(changeObj);

    if (event.target.id == "courseName") this.setState({ submit: false })
  }

  handleSubmit(event) {
    let courseRef = coursesRef.child(this.state.courseCode)
    courseRef.update({ courseName: this.state.courseName, creatorEmail: this.props.email, courseCode: this.state.courseCode });
    event.preventDefault();
    this.setState({ open: false });
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  componentDidMount() {
    let coursesRef = database.ref("courses")
    coursesRef.on("value", this.gotOne);
  }

  gotOne(data) {
    // return (<p></p>)
    let coursesArray = Object.keys(data.val())
    this.setState({
      courses: data.val(),
      coursesArray: coursesArray
    })
  }

  createCourse() {
    this.setState({ showCourseForm: !this.state.showCourseForm })
    // return (<CourseForm />)
  }

  createQuestion() {
    this.setState({ showQuizForm: !this.state.showQuizForm })
  }

  showCourses() {
    
      return (
          <div  id="cards">
          {Object.values(this.state.courses).map((course, i) => (
            <Card id="course-card" className="course-card" >
            {console.log(course)}
              <CardContent>
                <Typography id="card-font" variant="h5" component="h6">
                  {course.courseCode+": "+ course.courseName}
                </Typography>
              </CardContent>
              {'quizzes' in course ? 
              <CardActions>
                <Button onClick={console.log("clicked")}>See Quizzes</Button>
              </CardActions>
              : <CardActions>
              <Button disabled="true" onClick={console.log()}>No Quizzes</Button>
            </CardActions>
            }
            </Card>
            
          ))}
          </div>
      )
    // }

  }

  render() {
console.log(Object.getOwnPropertyNames(this.state.courses).length)
    
    return (
      <div>
        <h1 className="dashboard">Faculty Dashboard</h1>
        <div className="wrapper">
          <h2>Welcome, {this.props.name}</h2>
        </div>
        <div className="faculty-main">
          {/* <div className="button-container"> */}
          <div className="create-course">
            {/* <Fab onClick={this.createCourse} variant="extended" aria-label="Delete" > */}
            <Fab onClick={this.handleClickOpen} variant="extended" aria-label="Delete" >

              <AddCircle />
              <p className="button-text">Add Course</p>

            </Fab>
            {/* <Button variant="contained" color="primary" onClick={this.createCourse}>Add Course</Button> */}
          </div>
          {this.state.showCourseForm ? <CourseForm email={this.props.email} /> : console.log()}
          <div className="create-question">
            {/* <Button variant="contained" color="primary" onClick={this.createQuestion}>Add Question</Button> */}
            <Fab onClick={this.createQuestion} variant="extended" aria-label="Delete" >
              <AddCircle />
              <p className="button-text">Add Question</p>

            </Fab>
          </div>
          {this.state.showQuizForm ? <QuizForm /> : console.log()}
          {/* </div> */}

        </div>
        <h2 className="yourCourses" >Your Courses</h2>
        <div className="facultyCourses">
        {Object.getOwnPropertyNames(this.state.courses).length > 0 ? this.showCourses() : console.log()}
          {/* <p>Show Courses </p> */}
        </div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add New Course</DialogTitle>
          <DialogContent>
            <form>
              <TextField
                id="courseCode"
                label="Course Code"
                value={this.state.courseCode}
                onChange={this.handleChange}
                margin="normal"
              />
              <TextField
                id="courseName"
                label="Course Name"
                value={this.state.courseName}
                onChange={this.handleChange}
                margin="normal"
              />
              {/* <Button variant="contained" color="primary" onClick={this.handleSubmit}>Submit</Button> */}
              {/* <input type="submit" value="Submit" /> */}
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button disabled={this.state.submit} onClick={this.handleSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
export default FacultyDashboard;