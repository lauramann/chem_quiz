import React, { PureComponent } from "react";
import Button from '@material-ui/core/Button';

class Quiz extends PureComponent {
    constructor(props) {
        super(props);
        this.getOptions = this.getOptions.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.state = ({
            userAnswers: this.props.quiz
        })
    }

    handleClick(selected) {
        console.log(selected)

    }

    getOptions(question) {
        let arr = []
        arr.push(question.wrong1)
        arr.push(question.wrong3)
        arr.push(question.answer)
        arr.push(question.wrong2)

        return (arr)
    }

    render() {
        console.log(this.state.userAnswers)
        console.log(this.props.user)
        const q = Object.values(this.props.quiz)
        const questions = []
        for(let i=0;i<q.length;i++) {
            questions.push(q[i])
        }

        return (
            <div>
                <h1>{this.props.quiz.name}</h1>
                {questions.map((q, i) => (
                    <div>
                        <h2>{q.question}</h2>
                            {this.getOptions(q).map((opt) => (
                                <Button onClick={() => this.handleClick(q)} size="small">{opt}</Button>
                            ))}
                    </div>
                ))}

            </div>
        );
    }
}
export default Quiz;