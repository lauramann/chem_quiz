import React, { PureComponent } from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import firebase from './firebaseConfig';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

var database = firebase.database()
// var coursesRef = database.ref("courses");

class QuizForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { question: '', answer: '', wrong1: '', wrong2: '', wrong3: '', courseCode: '', coursesArray: [], name: '', quiz: []};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.gotOne = this.gotOne.bind(this);
        this.handleAddQuestion = this.handleAddQuestion.bind(this);
    }

    componentDidMount() {
        let coursesRef = database.ref("courses")
        coursesRef.on("value", this.gotOne);
    }

    handleChange(event) {
        console.log(event.target.id)
        let changeObj = {}
        changeObj[event.target.id] = event.target.value
        this.setState(changeObj);
    }

    gotOne(data) {
        this.setState({coursesArray: Object.keys(data.val())})
        console.log(this.state.coursesArray)
    }

    handleAddQuestion(event) {
        let quest = this.state.quiz.push({question: this.state.question, answer:this.state.answer, wrong1: this.state.wrong1, wrong2: this.state.wrong2, wrong3: this.statewrong3})
        console.log(quest)
        // this.setState({ quiz: [...this.state.quiz, quest] }) 
        // this.setState({ 
        //     quiz: this.state.quiz.push(quest)
        //   })
        this.setState({ quiz: quest })
          document.getElementById("quiz-form").reset();
          this.setState({
            question: '',
            answer: '',
            wrong1: '',
            wrong2: '',
            wrong3: ''

          })
          
          console.log(this.state.quiz)

    }

    handleSubmit(event) {
        // alert('A name was submitted: ' + this.state.value);
        console.log(event)
        let quizzesRef = database.ref("courses/" + this.state.courseCode + "/quizzes")
        let quiz = quizzesRef.child(5)

        let question = {
            answer: this.state.answer,
            question: this.state.question,
            options: {
                0: this.state.wrong1,
                1: this.state.wrong2,
                2: this.state.wrong3
            }
        }
        quiz.push(question);
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <Paper elevation={1}>
                    <form id="quiz-form">
                        <InputLabel>Course</InputLabel>
                        <Select
                            value={this.state.courseCode}
                            onChange={this.handleChange}
                            inputProps={{
                                name: 'Course',
                                id: 'course-code',
                            }}
                        >
                        {this.state.coursesArray.map((course) => 
                        <MenuItem key={course} value={course}>{course}</MenuItem>)}
                        </Select>
                        <TextField
                            id="name"
                            label="Name of Quiz"
                            value={this.state.name}
                            onChange={this.handleChange}
                            margin="normal"
                        />
                        <TextField
                            id="question"
                            label="Question"
                            value={this.state.question}
                            onChange={this.handleChange}
                            margin="normal"
                        />
                        <TextField
                            id="answer"
                            label="Answer"
                            value={this.state.answer}
                            onChange={this.handleChange}
                            margin="normal"
                        />
                        <TextField
                            id="wrong1"
                            label="Wrong Answers"
                            value={this.state.wrong1}
                            onChange={this.handleChange}
                            margin="normal"
                        />
                        <TextField
                            id="wrong2"
                            // label="Course Name"
                            value={this.state.wrong2}
                            onChange={this.handleChange}
                            margin="normal"
                        />
                        <TextField
                            id="wrong3"
                            // label="Course Name"
                            value={this.state.wrong3}
                            onChange={this.handleChange}
                            margin="normal"
                        />
                        <Button variant="contained" color="primary" onClick={this.handleAddQuestion}>Add Question</Button>
                        <Button variant="contained" color="primary" onClick={this.handleSubmit}>Submit</Button>
                    </form>
                </Paper>
            </div>
        );
    }
}
export default QuizForm;