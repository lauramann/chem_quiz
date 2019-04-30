import React, { PureComponent } from "react";
import Button from '@material-ui/core/Button';

// Quiz class
// Displays quiz content
// ----------------------------------------------------------------------------------
// state explanations:
//    userAnswers: num -> keeps count of user's answers
//    questionsSize: num -> gets length of questions array
//    tempUserAnswers: num -> used for keeping track how many guesses user has made
// ----------------------------------------------------------------------------------
class Quiz extends PureComponent {
    constructor(props) {
        super(props);

        this.state = ({
            userAnswers: 0,
            questionsSize: 0,
            tempUserAnswers: 0,
        })

        // declare methods
        this.getOptions = this.getOptions.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.shuffle = this.shuffle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // handles when a user clicks on a quiz answer
    handleClick(selected, questionIndex, optionIndex) {
        this.setState({tempUserAnswers: this.state.tempUserAnswers+1})
        let quizVals = Object.values(this.props.quiz)

        // if the user has selected the right answer
        if (quizVals[questionIndex].answer == selected) {
            console.log("right!")
            // if this is the first guess, increase score by 1
            if(this.state.tempUserAnswers == 1) 
                this.setState({userAnswers: this.state.userAnswers+1})

            // if this is the second guess, increase score by .5
            else if(this.state.tempUserAnswers == 2)
                this.setState({userAnswers: this.state.userAnswers+0.5});

            // otherwise, the user's score does not increase

            // reset tempUserAnswers to 0
            this.setState({tempUserAnswers: 0})

            // change styling of the answer they selected to have a green border
            document.getElementById(questionIndex +"opt" + optionIndex).style.borderStyle = "solid";
            document.getElementById(questionIndex +"opt" + optionIndex).style.borderWidth = "1px";
            document.getElementById(questionIndex +"opt" + optionIndex).style.borderColor = "green";
            
            //if this is not the last questions, set display of next question to "block"
            let num = questionIndex+1
            if(num<this.state.questionsSize)
                document.getElementById("question" + num).style.display = "block";
            
            // otherwise show submit button
            else{
                (console.log("end of questions"))
                document.getElementById("submit-button").style.display = "block";
            }
        }

        // if user did not select the right answer
        else {
            // change styling of the answer they selected to have a red border
            document.getElementById(questionIndex +"opt" + optionIndex).style.borderStyle = "solid";
            document.getElementById(questionIndex +"opt" + optionIndex).style.borderWidth = "1px";
            document.getElementById(questionIndex +"opt" + optionIndex).style.borderColor = "red";
            console.log("wrong!")
        }
    }

    handleSubmit() {
        console.log("Submitted")
    }

    // get all answer options and put into an array
    // this can be used with the shuffle method
    getOptions(question) {
        let arr = []
        arr.push(question.wrong1)
        arr.push(question.wrong3)
        arr.push(question.answer)
        arr.push(question.wrong2)

        return (arr)
    }

    //Shuffle method taken from StackOverflow: 
    //https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    render() {
        // create array, questions, of questions from quiz
        const q = Object.values(this.props.quiz)
        const questions = []
        for (let i = 0; i < q.length-1; i++) {
            questions.push(q[i])
        }
        // set questionsSize to length of questions array
        this.setState({questionsSize: questions.length})

        return (
            <div>
                {/* loop through questions and display each one */}
                {questions.map((q, i) => (
                    // if it's the first question (i=0) display, otherwise display:none
                    <div id={"question"+i} style={i<1 ? {display:"block"}: {display:"none"} }>
                        <h3>{i+1}. {q.question}</h3>

                        {/* loop through options and display each as buttons */}
                        {this.getOptions(q).map((opt, j) => (
                            <Button id={i+"opt"+j} onClick={() => this.handleClick(opt, i, j)} size="small">{opt}</Button>
                        ))}
                    </div>
                ))}
                {/* submit button displayed when all questions have been answered */}
                {<Button id="submit-button" style={{display:"none"}} onClick={this.handleSubmit}>Submit</Button>}

            </div>
        );
    }
}
export default Quiz;