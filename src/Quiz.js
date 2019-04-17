import React, { PureComponent } from "react";
import Button from '@material-ui/core/Button';

class Quiz extends PureComponent {
    constructor(props) {
        super(props);
        this.getOptions = this.getOptions.bind(this);
    }

    getOptions(question) {
        let arr = []
        arr.push(question.wrong1)
        arr.push(question.wrong3)
        arr.push(question.answer)
        arr.push(question.wrong2)
        console.log(arr)
        return (arr)
    }

    render() {
        console.log(this.props.quiz)
        console.log("quiz length: " + Object.values(this.props.quiz).length)
        const q = Object.values(this.props.quiz)
        const questions = []
        for(let i=0;i<q.length-1;i++) {
            questions.push(q[i])
        }
        console.log(questions)

        return (
            <div>
                <h1>{this.props.quiz.name}</h1>
                {questions.map((q, i) => (
                    // {if(i<Object.values(this.props.quiz).length) console.log}
                    <div>
                        {console.log(q)}
                        {console.log(i)}
                        {console.log(q.length)}
                        <h2>{q.question}</h2>
                            {this.getOptions(q).map((opt) => (
                                <Button onClick={console.log("clicked")} size="small">{opt}</Button>
                                // <li>{opt}</li>
                            ))}
                    </div>
                ))}

            </div>
        );
    }
}
export default Quiz;