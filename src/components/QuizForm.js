import React, { PureComponent } from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import firebase from '../firebaseConfig';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import '../styling/quizForm.css';

var database = firebase.database()

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
        let changeObj = {}
        if (event.target.id) {
            changeObj[event.target.id] = event.target.value
        }
        else changeObj[event.target.name] = event.target.value

        this.setState(changeObj);
    }

    gotOne(data) {
        this.setState({ coursesArray: Object.keys(data.val()) })
    }

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

        this.setState({ quiz: quest })
        document.getElementById("quiz-form").reset();
        this.setState({
            question: '',
            answer: '',
            wrong1: '',
            wrong2: '',
            wrong3: ''

        })

    }

    handleSubmit(event) {
        this.handleAddQuestion()
        let quizzesRef = database.ref("courses/" + this.state.courseCode)
        let quiz = quizzesRef.child('quizzes')
        let finalQuiz = this.state.quiz
        finalQuiz.name = this.state.name
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