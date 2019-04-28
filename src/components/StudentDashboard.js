import React, { PureComponent } from "react";
import firebase from '../firebaseConfig';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Quiz from './Quiz';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import '../styling/studentDashboard.css'
import { withStyles } from '@material-ui/core/styles';
import '../styling/facultyDashboard.css';

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

let database = firebase.database()
let usersRef = database.ref("users")

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
    this.showCourses = this.showCourses.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
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

  handleClickOpen(quiz) {
    this.setState({
      open: true,
      quiz: quiz
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange(event) {
    let changeObj = {}
    let individualCourses = Object.values(this.state.courses)
    let chosen = event.target.value
    let chosenCourse = {}
    if (event.target.id) {
      changeObj[event.target.id] = event.target.value
    }
    else changeObj[event.target.name] = event.target.value

    this.setState(changeObj);

    if (individualCourses != undefined) {
      individualCourses.map((course) => {
        if (course.courseCode == chosen) {
          chosenCourse = course
        }
      })
    }
    // console.log(chosenCourse)
  }

  showCourses(chosenCourse) {
    let individualCourses = Object.values(this.state.courses)
    let courseObj = null

    if (individualCourses != undefined) {
      individualCourses.map((course) => {
        if (course.courseCode == chosenCourse) {
          courseObj = course
        }
      })
    }

    if (courseObj != null) {
      return (
        <div>
          <h2>{courseObj.courseCode}: {courseObj.courseName}</h2>
          <div  id="cards">
          {Object.values(courseObj.quizzes).map((quiz, i) => (

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
            
          ))}
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
          {/* <div className="student-head"> */}
            
            <h2>Welcome, {this.props.name}</h2>
          {/* </div> */}
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
        {this.showCourses(this.state.courseCode)}
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
              Submit
            </Button>
          </DialogActions>
          </Dialog>
        {/* {this.state.quiz != null ? <Quiz quiz={this.state.quiz} user={this.props.username} submitted="no" /> : console.log()} */}
        </div>
      </div>
    );
  }
}
export default StudentDashboard;