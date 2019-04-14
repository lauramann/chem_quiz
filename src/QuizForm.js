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
        this.state = { question: '', answer: '', wrong1: '', wrong2: '', wrong3: '', courseCode: '', coursesArray: [] };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCourseChange = this.handleCourseChange.bind(this);
        this.readUserData = this.readUserData.bind(this);
        this.gotOne = this.gotOne.bind(this);
    }

    handleChange(event) {
        console.log(event.target.id)
        let changeObj = {}
        changeObj[event.target.id] = event.target.value
        this.setState(changeObj);
    }

    handleCourseChange(event) {
        let courseObj = {}
        courseObj[event.target.id] = event.target.value
        console.log(courseObj)
        this.setState(courseObj);
    }

    readUserData() {
        let coursesRef = database.ref("courses")
        coursesRef.on("value", this.gotOne, errData);

        // function gotOne(data) {
        //     this.setState({coursesArray: Object.keys(data.val())})
        // }

        function errData(data) {
            console.log("erro")
        }

        console.log(this.state.coursesArray)
    }

    gotOne(data) {
        this.setState({coursesArray: Object.keys(data.val())})
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

    componentDidMount() {
        this.readUserData()
    }

    render() {
        // console.log(this.readUserData())
        // console.log(firebase.database())
        return (
            <div>
                <Paper elevation={1}>
                    <form>
                        <InputLabel>Course</InputLabel>
                        <Select
                            value={this.state.courseCode}
                            onChange={this.handleChange}
                            inputProps={{
                                name: 'Course',
                                id: 'course-code',
                            }}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
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
                        <Button variant="contained" color="primary" onClick={this.handleSubmit}>Submit</Button>
                    </form>
                </Paper>
            </div>
        );
    }
}
export default QuizForm;