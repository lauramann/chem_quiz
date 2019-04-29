import React, { PureComponent } from "react";
import QuizForm from './QuizForm';
import firebase from '../firebaseConfig';
import AddCircle from '@material-ui/icons/AddCircle';
import {Card, CardContent, CardActions, Typography, Button, Fab, Dialog,
        DialogActions, DialogContent, DialogTitle, TextField} from '@material-ui/core';

var database = firebase.database()
var coursesRef = database.ref("courses");

class FacultyDashboard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showQuizForm: false,
      courses: {},
      coursesArray: [],
      open: false,
      courseCode: '',
      courseName: '',
      submit: true, 
      modal: ''

    }
    this.showCourses = this.showCourses.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.gotOne = this.gotOne.bind(this);
    this.createQuestion = this.createQuestion.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
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

  handleClickOpen(event) {
    console.log(event.target.id)
    this.setState({ open: true, modal: event.target.id });
    console.log(this.state.modal)
  };

  handleClose(event) {
    this.setState({ open: false});
  };

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

  createQuestion() {
    this.setState({ showQuizForm: !this.state.showQuizForm })
  }

  showCourses() {
    
      return (
          <div  id="cards">
          {Object.values(this.state.courses).map((course, i) => (
            <Card id="course-card" className="course-card" >
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

  }

  render() {
    return (
      <div>
        <h1 className="dashboard">Faculty Dashboard</h1>
        <div className="wrapper">
          <h2>Welcome, {this.props.name}</h2>
        </div>
        <div className="faculty-main">
          <div className="create-course">
            <Fab id="createCourse" onClick={((e) => this.handleClickOpen(e))} variant="extended" aria-label="Delete" >

              <AddCircle />
              <p className="button-text">Add Course</p>

            </Fab>
           
          </div>
          <div className="create-question">
            <Fab id="createQuiz" onClick={((e) => this.handleClickOpen(e))} variant="extended" aria-label="Delete" >
              <AddCircle />
              <p className="button-text">Add Question</p>

            </Fab>
          </div>
          {this.state.showQuizForm ? <QuizForm /> : console.log()}

        </div>
        <h2 className="yourCourses" >Your Courses</h2>
        <div className="facultyCourses">
        {Object.getOwnPropertyNames(this.state.courses).length > 0 ? this.showCourses() : console.log()}

        </div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">{this.state.modal == 'createCourse' ? "Add New Course" : "Create New Quiz"}</DialogTitle>
          <DialogContent>
            {this.state.modal == 'createCourse' ?
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
              <Button disabled={this.state.submit} onClick={this.handleSubmit} color="primary">Submit</Button>

            </form> : <QuizForm />}
          </DialogContent> 
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
export default FacultyDashboard;