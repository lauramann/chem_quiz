import React, { PureComponent } from "react";
// import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import firebase from './firebaseConfig';

var database = firebase.database()
var coursesRef = database.ref("courses");

class CourseForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { courseCode: '', courseName: '' };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

handleChange(event) {
    let changeObj = {}
    changeObj[event.target.id] = event.target.value
    this.setState(changeObj);
}

handleSubmit(event) {
    let courseRef = coursesRef.child(this.state.courseCode)
    courseRef.update({courseName: this.state.courseName, creatorEmail: this.props.email, courseCode: this.state.courseCode});
    event.preventDefault();
}

render() {
    return (
        <div>
            <Paper elevation={1}>
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
                    <Button variant="contained" color="primary" onClick={this.handleSubmit}>Submit</Button>
                    {/* <input type="submit" value="Submit" /> */}
                </form>
            </Paper>
        </div>
    );
}
}
export default CourseForm;