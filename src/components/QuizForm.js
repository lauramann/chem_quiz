import React, { PureComponent } from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import firebase from '../firebaseConfig';
import {Select, MenuItem, InputLabel} from '@material-ui/core';
import '../styling/quizForm.css';

// connect to database
var database = firebase.database()

// QuizForm class
// Displays quiz
// ----------------------------------------------------------------------------------
// state explanations:
//    question: string -> question created by user
//    answer: string -> right answer created by user
//    wrong1: string -> wrong answer created by user
//    wrong2: string -> wrong answer created by user
//    wrong3: string -> wrong answer created by user
//    courseCode: string -> example: PHYS 2093
//    coursesArray: bool -> array of courses from db
//    name: string -> name of quiz created by user
//    quiz: array -> quiz created by user
// ----------------------------------------------------------------------------------
class QuizForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            question: '',
            answer: '',
            wrong1: '',
            wrong2: '',
            wrong3: '',
            courseCode: '',
            coursesArray: [],
            name: '',
            quiz: []
        };

        // declare methods
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.gotOne = this.gotOne.bind(this);
        this.handleAddQuestion = this.handleAddQuestion.bind(this);
    }

    // set coursesRef to courses from db
    // prevents infinite loop when calling setState
    componentDidMount() {
        let coursesRef = database.ref("courses")
        coursesRef.on("value", this.gotOne);
    }

    // sets data from db to state
    gotOne(data) {
        this.setState({ coursesArray: Object.keys(data.val()) })
    }

    // set data from form to corresponding state variable
    handleChange(event) {
        let changeObj = {}
        if (event.target.id) {
            changeObj[event.target.id] = event.target.value
        }
        else changeObj[event.target.name] = event.target.value

        this.setState(changeObj);
    }

    // saves each question added by user into one object
    handleAddQuestion(event) {
        let quest = this.state.quiz
        quest.push({
            question: this.state.question,
            answer: this.state.answer,
            options: {
                0: this.state.wrong1,
                1: this.state.wrong2,
                2: this.state.wrong3
            },
            wrong1: this.state.wrong1,
            wrong2: this.state.wrong2,
            wrong3: this.state.wrong3
        })

        // save quiz to state and reset form
        this.setState({
            quiz: quest,
            question: '',
            answer: '',
            wrong1: '',
            wrong2: '',
            wrong3: ''

        })

        document.getElementById("quiz-form").reset();

    }

    // submitts quiz to datatbase
    handleSubmit(event) {
        // ensures that the last question is added to quiz object
        this.handleAddQuestion()

        // gets db references and creates "quizzes" in course in db
        let quizzesRef = database.ref("courses/" + this.state.courseCode)
        let quiz = quizzesRef.child('quizzes')
        let finalQuiz = this.state.quiz
        finalQuiz.name = this.state.name

        // add full quiz to db
        quiz.push(finalQuiz);
        event.preventDefault();
    }

    render() {
        return (

            <form id="quiz-form">
                <div className="select-course">
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
                        {/* loop through courses to display all courses */}
                        {this.state.coursesArray.map((course) =>
                            <MenuItem key={course} value={course}>{course}</MenuItem>)}
                    </Select>
                </div>
                <div className="name-quiz">
                    <TextField
                        id="name"
                        label="Name of Quiz"
                        value={this.state.name}
                        onChange={this.handleChange}
                        margin="normal"
                    />
                </div>
                <div className="question-answer">
                    <p>Create a question and provide the correct answer:</p>
                    <TextField
                        id="question"
                        label="Question"
                        value={this.state.question}
                        onChange={this.handleChange}
                        margin="normal"
                    />

                    <TextField
                        id="answer"
                        label="Correct Answer"
                        value={this.state.answer}
                        onChange={this.handleChange}
                        margin="normal"
                    />
                </div>
                <p>Provide some wrong answers:</p>
                <div className="options">
                    <TextField
                        id="wrong1"
                        label="Option 1"
                        value={this.state.wrong1}
                        onChange={this.handleChange}
                        margin="normal"
                    />
                    <TextField
                        id="wrong2"
                        label="Option 2"
                        value={this.state.wrong2}
                        onChange={this.handleChange}
                        margin="normal"
                    />
                    <TextField
                        id="wrong3"
                        label="Option 3"
                        value={this.state.wrong3}
                        onChange={this.handleChange}
                        margin="normal"
                    />
                </div>
                <p>To add another question to this quiz, choose Add Question. When you're all done, click Submit.</p>
                <Button variant="contained" color="primary" onClick={this.handleAddQuestion}>Add Question</Button>
                <Button variant="contained" color="primary" onClick={this.handleSubmit}>Submit</Button>
            </form>
        );
    }
}
export default QuizForm;