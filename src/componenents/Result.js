import React, { useEffect, useState } from 'react'
import './../Result.css';


export default function Result({question_list}){
    
    const questions = JSON.parse(localStorage.getItem("realAnswers"));    
    const answers = JSON.parse(localStorage.getItem("choisenAnswers"));
    const [wrong_answers, setWrongAnswers] = useState([]);

    const [score, setScore] = useState(0);

    useEffect(() => {
        let wrong_answers_copy = Object.assign([], wrong_answers);
        let current_score = 0;

        question_list.map((question_number) => {
            let given_answer = answers[question_number];
            let real_answer = questions[question_number]["answers"];

            
            var true_count = 1;
            real_answer.map((answer) => {
                if (answer["is_True"]){
                    true_count++;
                }
            })

            var given_count = 0;
            console.log(given_answer)
            given_answer.map((answer) => {
                if (answer["is_True"]){
                    given_count++;
                }else if (!wrong_answers_copy.includes(question_number)){
                    wrong_answers_copy.push(question_number)
                }
            })
            current_score = current_score + given_count / true_count
            
        });
        setWrongAnswers(wrong_answers_copy);
        setScore(current_score);
    }, [])

    return (
        <div className='result-zone'>
            <div className='score-zone'>
                <span>Набранно баллов: {score / 60 * 100}</span>
            </div>
            <div className='wrong-answers'>
                {console.log(wrong_answers)}
                {wrong_answers.map((question_number) => (
                    <>
                        <div className='question'>
                            <span>{questions[question_number]["question_text"]}</span>
                        </div>

                            {questions[question_number]["have_image"] && (
                                <div className="image-zone">
                                    <img className="img" src={require(`./../assets/images/${questions[question_number]["image_number"]}`)} />
                                </div>
                            )}

                        <div className='given-answers'>
                            <span>Ваш ответ</span>
                            {answers[question_number].map((answer) => (
                                <div className='answer-choise'>
                                    {answer["answer"]}
                                </div>
                            ))}
                        </div>

                        <div className='true-answers'>
                            <span>Правильный ответ</span>
                            {questions[question_number]["answers"].map((answer) => (
                                    <div className='answer-choise'>
                                        {answer["is_True"] && answer["answer"]}
                                    </div>
                                )
                            )}
                        </div>
                    </>
                ))}
            </div>

            <div className='button-zone'>
                <button onClick={() => window.location.reload()}>Начать заного</button>
            </div>
        
        </div>
    )
}