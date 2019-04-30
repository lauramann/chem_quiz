import React, { PureComponent } from "react";
import QuizForm from './QuizForm';
import firebase from '../firebaseConfig';
import AddCircle from '@material-ui/icons/AddCircle';
import { Card, CardContent, CardActions, Typography, Button, Fab, Dialog,
  DialogActions, DialogContent, DialogTitle, TextField
} from '@material-ui/core';

// connect to database and set coursesRef to courses from db
var database = firebase.database()
var coursesRef = database.ref("courses");

// FacultyDashboard class
// Displayed for faculty only (isFaculty==true)
// Faculty can create courses and quizzes
// Shows their courses
// ----------------------------------------------------------------------------------
// state explanations:
//    showQuizForm: bool -> determines whether to show the quiz form or course form
//    courses: object -> courses from db
//    coursesArray: array -> array of courses from db
//    open: bool -> determines whether to open quiz or course dialog
//    courseCode: string -> example: PHYS 2093
//    courseName: string -> example: Introduction to Physics
//    submit: bool -> determines whether to show submit
// ----------------------------------------------------------------------------------
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

    // declare methods
    this.showCourses = this.showCourses.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.gotOne = this.gotOne.bind(this);
    this.createQuestion = this.createQuestion.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  // gets data from from and sets it to corresponding state
  handleChange(event) {
    let changeObj = {}
    changeObj[event.target.id] = event.target.value
    this.setState(changeObj);

    if (event.target.id == "courseName") this.setState({ submit: false })
  }

  // update data in db with course information
  handleSubmit(event) {
    let courseRef = coursesRef.child(this.state.courseCode)
    courseRef.update({ courseName: this.state.courseName, creatorEmail: this.props.email, courseCode: this.state.courseCode });
    event.preventDefault();
    this.setState({ open: false });
  }

  // opens dialog modal
  handleClickOpen(event) {
    this.setState({ modal: event.target.id });
    this.setState({ open: true });
  };

  // closes dialog modal
  handleClose(event) {
    this.setState({ open: false });
  };

  // connects to database after it has updated
  // prevents infitnite loop in calling state
  componentDidMount() {
    let coursesRef = database.ref("courses")
    coursesRef.on("value", this.gotOne);
  }

  // sets data from db to state variables
  gotOne(data) {
    let coursesArray = Object.keys(data.val())
    this.setState({
      courses: data.val(),
      coursesArray: coursesArray
    })
  }

  // set showQuizForm to opposite of what it was (to open and close it)
  createQuestion() {
    this.setState({ showQuizForm: !this.state.showQuizForm })
  }

  // shows all courses
  showCourses() {
    return (
      <div id="cards">
        {/* loop through courses array and display each one as a card */}
        {Object.values(this.state.courses).map((course, i) => (
          <Card id="course-card" className="course-card" >
            <CardContent>
              <Typography id="card-font" variant="h5" component="h6">
                {course.courseCode + ": " + course.courseName}
              </Typography>
            </CardContent>

            {/* if there are quizzes in the course, display how many quizzes */}
            {'quizzes' in course ?
              <CardActions>
                <Button onClick={console.log("clicked")}>{Object.keys(course.quizzes).length > 1 ? Object.keys(course.quizzes).length + " Quizzes" : Object.keys(course.quizzes).length + " Quiz"}</Button>
              </CardActions>

              // Otherwise show No Quizzes
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

          {/* Create course area */}
          <div className="create-course">
            <Fab id="createCourse" onClick={((ev) => this.handleClickOpen(ev))} variant="extended" aria-label="Delete" >
              <AddCircle />
              <p className="button-text">Add Course</p>
            </Fab>
          </div>

          {/* Create question area */}
          <div className="create-question">
            <Fab id="createQuiz" onClick={((e) => this.handleClickOpen(e))} variant="extended" aria-label="Delete" >
              <AddCircle />
              <p className="button-text">Add Question</p>
            </Fab>
          </div>

          {/* If this.state.showQuizForm isn't false, show QuizForm */}
          {this.state.showQuizForm ? <QuizForm /> : null}

        </div>

        {/* Show Courses  */}
        <h2 className="yourCourses" >Your Courses</h2>
        <div className="facultyCourses">
          {Object.getOwnPropertyNames(this.state.courses).length > 0 ? this.showCourses() : null}

        </div>

        {/* Dialog opens depending on this.state.open */}
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          {/* show title based on which button was clicked */}
          <DialogTitle id="form-dialog-title">{this.state.modal == 'createCourse' ? "Add New Course" : "Add New Quiz"}</DialogTitle>
          <DialogContent>
            {/* If the creat course button was clicked, show form to create a course */}
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
              </form>

              // Otherwise show <QuizForm />
              : <QuizForm />}
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