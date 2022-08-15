import React, { useState, useEffect } from "react";
import axios from "axios";
import Result from "./Result";

const questionList = [];
const questionMax = 60;

while (questionList.length < questionMax){
    let randomValue = Math.round(Math.random() * 720);
    if (!questionList.includes(randomValue)){
        questionList.push(randomValue);
    }
}

localStorage.setItem("choisenAnswers", JSON.stringify({}));

const Question = () => {

    const [checked, setChecked] = useState([]);
    const [listNumber, setListNumber] = useState(0);
    const [show, setShow] = useState(false);

    const [question, setQuestion] = useState(null);
    const [questionNumber, setQuestionNumber] = useState(questionList[listNumber]);
    const url = `http://127.0.0.1:8000/api/question/${questionNumber}/`;

    useEffect(() => {

        let realAnswers = JSON.parse(localStorage.getItem("realAnswers"));
        if (realAnswers !== null && Object.keys(realAnswers).includes(String(questionNumber))){
            setQuestion(realAnswers[questionNumber])
        } else{
            axios.get(url).then(result => {
                setQuestion(result.data);                
                if (realAnswers === null) {
                    realAnswers = {};
                }
                realAnswers[questionNumber] = result.data;
                localStorage.setItem("realAnswers", JSON.stringify(realAnswers))
    
            });
        }

        let choisenAnswers = JSON.parse(localStorage.getItem("choisenAnswers"));
        if (choisenAnswers !== null && Object.keys(choisenAnswers).includes('' + questionNumber)){
            setChecked(choisenAnswers[questionNumber]);
        }
    }, [url]);

    const buttonCommand = (newNumber) => {
        let choisenAnswers = localStorage.getItem('choisenAnswers') !== null ? JSON.parse(localStorage.getItem('choisenAnswers')) : {};
        choisenAnswers[questionNumber] = checked;
        localStorage.setItem("choisenAnswers", JSON.stringify(choisenAnswers));
        
        setChecked([]);
        setListNumber(newNumber);
        setQuestionNumber(questionList[newNumber]);
    }

    const add_to_checked = (value) => {
        if (checked.includes(value)){
            setChecked(checked.filter(item => item !== value));      
        }else{
            setChecked(checked.concat(value));
        }
    };

    const finish_test = () => {
        let choisenAnswers = localStorage.getItem('choisenAnswers') !== null ? JSON.parse(localStorage.getItem('choisenAnswers')) : {};
        choisenAnswers[questionNumber] = checked;
        localStorage.setItem("choisenAnswers", JSON.stringify(choisenAnswers));

        setChecked([]);
        setShow(true);
    }
    
    if (question){

        let true_answers = 0;

        question.answers.map((answer) => {
            if (answer.is_True){
                true_answers = true_answers + 1;
            }
        });

        
        return(
            <div className="main-zone">
                {show ? (<Result question_list={questionList}></Result>) : (
                    <>
                    <div className="question-zone">
                        <span>Вопрос номер {listNumber + 1} из {questionMax}</span>
                        <div className="question-text">
                            {question.question_text}
                        </div>
    
                    </div>
                    <div className="image-zone">
                        {question.have_image && (
                            <img className="img" src={require(`./../assets/images/${question.image_number}`)} />
                        )}
                    </div>
                    <div className="answers-zone">
                        {question.answers.map((answer) => (
                            <div className="answer-variant" key={answer.id}>
                                {true_answers === 1 ? (
                                    <input type="radio" name="radio-btn" id={answer.id} checked={checked.some(answr => {return JSON.stringify(answr) == JSON.stringify(answer)})} value={answer.answer} className="radio-btn" onChange={(e) => setChecked([answer])} />
                                ) : (
                                    <input type="checkbox" name="check-btn" id={answer.id} checked={checked.some(answr => {return JSON.stringify(answr) == JSON.stringify(answer)})} value={answer.answer} className="check-btn" onChange={(e) => add_to_checked(answer)} />
                                )}
                                <label htmlFor={answer.id}>{answer.answer}</label>
                            </div>
                        ))}
                    </div>
        
                    <div className="button-zone">
                        {listNumber > 0 && (<button className="back-button" onClick={() => buttonCommand(listNumber - 1)}>Предыдущий вопрос</button>)}
                        {listNumber + 1 !== questionMax ? (
                            <button onClick={() => buttonCommand(listNumber + 1)}>Следующий вопрос</button>
                        ) : (
                            <button className="finish-button" onClick={() => finish_test()}>Закончить тест</button>
                        )}
                    </div>
                    </>
                )}
                        
            </div>
        )
    }else{
        return(<></>)
    }

}


export default Question;