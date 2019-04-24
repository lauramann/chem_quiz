import React, { PureComponent } from "react";
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

class Quiz extends PureComponent {
    constructor(props) {
        super(props);
        this.getOptions = this.getOptions.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.shuffle = this.shuffle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getQuestions = this.getOptions.bind(this);
        this.state = ({
            userAnswers: 0,
            questionsSize: 0,
        })
    }

    handleClick(selected, questionIndex, optionIndex) {
        console.log(selected)
        console.log(optionIndex)
        let quizVals = Object.values(this.props.quiz)
        console.log(quizVals[questionIndex])
        console.log(selected)
        console.log(questionIndex)
        if (quizVals[questionIndex].answer == selected) {
            document.getElementById(questionIndex +"opt" + optionIndex).style.borderStyle = "solid";
            document.getElementById(questionIndex +"opt" + optionIndex).style.borderWidth = "1px";
            document.getElementById(questionIndex +"opt" + optionIndex).style.borderColor = "green";
            console.log("right!")
            let num = questionIndex+1
            // console.log(document.getElementById("question" + num))
            console.log(this.state.questionsSize)
            console.log(num)
            if(num<this.state.questionsSize)
                document.getElementById("question" + num).style.display = "block";
            else{
                (console.log("end of questions"))
                // document.getElementById("submit-button").style.display = "block";
            }
        }
        else {
            document.getElementById(questionIndex +"opt" + optionIndex).style.borderStyle = "solid";
            document.getElementById(questionIndex +"opt" + optionIndex).style.borderWidth = "1px";
            document.getElementById(questionIndex +"opt" + optionIndex).style.borderColor = "red";
            console.log("wrong!")
        }
    }

    handleSubmit() {
        console.log(this.state.userAnswers)
        console.log("Submitted")

    }

    getOptions(question) {
        let arr = []
        arr.push(question.wrong1)
        arr.push(question.wrong3)
        arr.push(question.answer)
        arr.push(question.wrong2)

        return (this.shuffle(arr))
    }

    getQuestions() {
        const q = Object.values(this.props.quiz)
        const questions = []
        for (let i = 0; i < q.length; i++) {
            questions.push(q[i])
        }
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
        console.log(this.state.userAnswers)
        console.log(this.props.user)
        const q = Object.values(this.props.quiz)
        const questions = []
        for (let i = 0; i < q.length-1; i++) {
            questions.push(q[i])
        }
        this.setState({questionsSize: questions.length})

        return (
            <div>
                {questions.map((q, i) => (
                    <div id={"question"+i} style={i<1 ? {display:"block"}: {display:"none"} }>
                        <h3>{i+1}. {q.question}</h3>

                        {this.getOptions(q).map((opt, j) => (
                            <Button id={i+"opt"+j} onClick={() => this.handleClick(opt, i, j)} size="small">{opt}</Button>
                        ))}
                    </div>
                ))}
                {/* {<Button id="submit-button" style={{display:"none"}} onClick={this.handleSubmit}>Submit</Button>} */}

            </div>
        );
    }
}
export default Quiz;