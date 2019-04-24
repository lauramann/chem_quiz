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
            prevIndex: -1,
            right: false
        })
    }

    handleClick(selected, i) {
        let quizVals = Object.values(this.props.quiz)
        console.log(quizVals[i])
        console.log(selected)
        console.log(i)
        if (quizVals[i].answer == selected) {
            console.log("right!")
            let num = i+1
            console.log(document.getElementById("question" + num))
            document.getElementById("question" + num).style.display = "block";
        }
        else console.log("wrong!")
    }

    handleSubmit() {
        console.log(this.state.userAnswers)
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
        for (let i = 0; i < q.length; i++) {
            questions.push(q[i])
        }

        return (
            <div>
                <h1>{this.props.quiz.name}</h1>
                {questions.map((q, i) => (
                    <div id={"question"+i} style={i<1 ? {display:"block"}: {display:"none"} }>
                        <h2>{q.question}</h2>

                        {this.getOptions(q).map((opt) => (
                            <Button onClick={() => this.handleClick(opt, i)} size="small">{opt}</Button>
                        ))}
                    </div>
                ))}
                <Button onClick={this.handleSubmit()}>Submit</Button>

            </div>
        );
    }
}
export default Quiz;