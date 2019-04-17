import React, { PureComponent } from "react";
// import Button from '@material-ui/core/Button';
import firebase from './firebaseConfig';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Quiz from './Quiz';

var database = firebase.database()

class StudentDashboard extends PureComponent {
  constructor(props) {
    super(props);
    this.gotOne = this.gotOne.bind(this);
    this.state = {
      courses: {},
      coursesArray: [],
      courseCode: '',
      quiz: null,
    }
    this.showCourses = this.showCourses.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleQuiz = this.handleQuiz.bind(this);
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
    console.log(chosenCourse)
  }

  handleQuiz(quiz) {
    this.setState({quiz: quiz})
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
          {Object.values(courseObj.quizzes).map((quiz, i) => (
            
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {quiz.name}
                </Typography>
              </CardContent>
              <CardActions>
                <Button onClick={() => this.handleQuiz(quiz)} size="small">Start Quiz</Button>
              </CardActions>
            </Card>
          ))}
        </div>
      )
    }

    // if(individualCourses != undefined) {
    //   return(
    //     individualCourses.map((course) => (
    //       <div>
    //         {course.courseCode != chosenCourse ? console.log("do not match") 
    //         : <div>
    //         <h2>{course.courseCode}: {course.courseName}</h2>
    //         {Object.values(course.quizzes).map((quiz)=>(
    //           <div>
    //           {<h3>{quiz.name}</h3>}
    //           {console.log(quiz.name)}
    //           {Object.values(quiz).map((quiz) => (
    //             <div>
    //               {/* {<p>{quiz}</p>} */}
    //               {console.log(quiz)}
    //               {<h4>{quiz.question}</h4>}
    //               {console.log(quiz.question)}
    //               {<p>{quiz.answer}</p>}
    //               {console.log(quiz.answer)}
    //             </div>

    //           ))}
    //         </div>
    //         ))}
    //         </div>
    //       }
    //       </div>
    //     )
    //   ))
    // }

    // if (individualCourses != undefined) {
    //   return (
    //     individualCourses.map((course) => (
    //       <div>
    //         {console.log(course)}
    //         {course.courseCode == chosenCourse ? console.log("match") : console.log("dont match")}
    //         {console.log("chosen course: " +chosenCourse)}
    //         {<h2>{course.courseName}</h2>}
    //         {console.log(course.courseName)}
    //         {Object.values(course.quizzes).map((quiz) => (
    //           <div>
    //             {<h3>{quiz.name}</h3>}
    //             {console.log(quiz.name)}
    //             {Object.values(quiz).map((quiz) => (
    //               <div>
    //                 {/* {<p>{quiz}</p>} */}
    //                 {console.log(quiz)}
    //                 {<h4>{quiz.question}</h4>}
    //                 {console.log(quiz.question)}
    //                 {<p>{quiz.answer}</p>}
    //                 {console.log(quiz.answer)}
    //               </div>

    //             ))}
    //           </div>
    //         ))}
    //       </div>
    //     ))
    //   )
    // }


  }

  render() {
    // console.log(this.state.courses)
    return (
      <div>

        <h1>Welcome, {this.props.name}</h1>
        <h2>Student Dashboard</h2>
        <InputLabel>Select a Course</InputLabel>
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
        {this.showCourses(this.state.courseCode)}
        {this.state.quiz != null ? <Quiz quiz={this.state.quiz} /> : console.log()}
      </div>
    );
  }
}
export default StudentDashboard;