import React, { PureComponent } from "react";
import Button from '@material-ui/core/Button';

class Quiz extends PureComponent {
    constructor(props) {
        super(props);
        this.getOptions = this.getOptions.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.shuffle = this.shuffle.bind(this);
        this.state = ({
            userAnswers: this.props.quiz
        })
    }

    handleClick(selected, i) {
        let quizVals = Object.values(this.props.quiz)
        console.log(quizVals[i])
        console.log(selected)
        console.log(i)
        if(quizVals[i].answer == selected) console.log("right!")
        else console.log("wrong!")
    }

    getOptions(question) {
        let arr = []
        arr.push(question.wrong1)
        arr.push(question.wrong3)
        arr.push(question.answer)
        arr.push(question.wrong2)

        return (this.shuffle(arr))
    }

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
                                <Button onClick={() => this.handleClick(opt, i)} size="small">{opt}</Button>
                            ))}
                    </div>
                ))}

            </div>
        );
    }
}
export default Quiz;