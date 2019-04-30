import React, { PureComponent } from "react";
import firebase from '../firebaseConfig';
import Quiz from './Quiz';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { withStyles } from '@material-ui/core/styles';
import {InputLabel, MenuItem, Select, Card, CardActions, 
        CardContent, Typography, Button, Dialog} from '@material-ui/core';
import '../styling/facultyDashboard.css';
import '../styling/studentDashboard.css'

// connect to database
let database = firebase.database()

// StudentDashboard class
// Displayed for students only
// Shows their courses and quizzes
// ----------------------------------------------------------------------------------
// state explanations:
//    courses: object -> courses from the database
//    coursesArray: array -> array of courses values (so we can use map() function)
//    courseCode: string -> example: COIS 2020
//    quiz: object -> quiz selected by student, passed to <Quiz /> component
//    open: bool -> determines whether dialog is open or closed
// ----------------------------------------------------------------------------------
class StudentDashboard extends PureComponent {
  constructor(props) {
    super(props);
    this.gotOne = this.gotOne.bind(this);
    this.state = {
      courses: {},
      coursesArray: [],
      courseCode: '',
      quiz: null,
      open: false
    }

    // declare methods
    this.showCourses = this.showCourses.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
  }

  // gets courses data from db
  // prevents calling state in an infinite loop
  componentDidMount() {
    let coursesRef = database.ref("courses")
    coursesRef.on("value", this.gotOne);
  }

  // sets state to courses data from db
  gotOne(data) {
    let coursesArray = Object.keys(data.val())
    this.setState({
      courses: data.val(),
      coursesArray: coursesArray
    })
  }

  // opens dialog, and sets quiz to the selected quiz to start
  handleClickOpen(quiz) {
    this.setState({
      open: true,
      quiz: quiz
    });
  };

  // closes dialog
  handleClose = () => {
    this.setState({ open: false });
  };

  // handles when user selects a course
  handleChange(event) {
    let changeObj = {}
    let chosenCourse = {}
    let individualCourses = Object.values(this.state.courses)
    
    // value will be the course code
    let chosen = event.target.value
    
    // if selected class has an id attribute
    if (event.target.id) {
      changeObj[event.target.id] = event.target.value
    }
    // otherwise use name attribute
    else changeObj[event.target.name] = event.target.value

    // this will automatically set the state of the courseCode to be the value
    // example: changeObj = {courseCode: 'PHYS 2093'}
    this.setState(changeObj);
  }

  showCourses(chosenCourse) {
    let individualCourses = Object.values(this.state.courses)
    let courseObj = null

    console.log(chosenCourse)

    if (individualCourses != undefined) {
      individualCourses.map((course) => {
        if (course.courseCode == chosenCourse) {
          courseObj = course
        }
      })
    }
    console.log(courseObj)

    if (courseObj != null) {
      return (
        <div>
          <h2>{courseObj.courseCode}: {courseObj.courseName}</h2>
          <div id="cards">
          {"quizzes" in courseObj ? Object.values(courseObj.quizzes).map((quiz, i) => (

            <Card className="quiz-card">
              <CardContent>
                <Typography variant="h5" component="h2">
                  {quiz.name}
                </Typography>
              </CardContent>
              <CardActions>
                <Button onClick={() => this.handleClickOpen(quiz)}>Start Quiz</Button>
              </CardActions>
            </Card>
            
          ))
          : <p>No Quizzes</p>
           }
          </div>
        </div>
      )
    }

  }

  render() {
    return (
      <div>
        <h1 className="dashboard">Student Dashboard</h1>
        <div className="wrapper">
            
            <h2>Welcome, {this.props.name}</h2>
        </div>
        <div className="student-main">
        <div className="select">
        <InputLabel className="select-label">Select a Course</InputLabel>
        <Select
        className="drop-down"
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
        {this.state.courseCode != '' ? this.showCourses(this.state.courseCode): null}
        <Dialog
            onClose={this.handleClose}
            aria-labelledby="customized-dialog-title"
            open={this.state.open}
          >
          <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
            {this.state.quiz ? this.state.quiz.name: ""}
          </DialogTitle>
          <DialogContent>
          <Quiz quiz={this.state.quiz} user={this.props.username} submitted="no" />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
          </Dialog>
        </div>
      </div>
    );
  }
}
export default StudentDashboard;

// styling for dialog (quiz), taken from Google's Material UI
// https://material-ui.com/demos/dialogs/
const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500],
  },
}))(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        console.log("close")
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit,
  },
}))(MuiDialogActions);