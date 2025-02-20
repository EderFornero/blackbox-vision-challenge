/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import { Commet } from "react-loading-indicators";

import { getQuestionAPI } from "../../utils/getQuestionAPI";
import { Question } from "../../types";

import styles from "./Game.module.scss";
import Button from "./Button";


const Game: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [score, setScore] = useState<number>(0);
    const [isSelectedAnswer, setIsSelectedAnswer] = useState<{ [key: string]: string }>({});
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    //let count = 0;

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const questions = await getQuestionAPI();

                const messyAnswers = questions.map((question: Question, index: number) => {
                    const allAnswers = [...question.incorrect_answers, question.correct_answer];
                    const messyAnswers = allAnswers.sort(() => Math.random() - 0.5);

                    return {
                        ...question,
                        id: `question-${index}`,
                        answers: messyAnswers
                    }
                });

                setQuestions(messyAnswers);
            } catch (error) {
                console.log("Error fetching questions", error);
            }

        }

        fetchQuestions();
        setIsGameOver(false);
    }, [])


    const handleAnswerSelection = (questionId: string, answer: string) => {
        setIsSelectedAnswer((prev) => ({ ...prev, [questionId]: answer }));
    }


    const handleSubmit = () => {
        let totalScore = 0;

        questions.forEach((question) => {
            const userAnswer = isSelectedAnswer[question.id];

            if (!userAnswer) console.log("No hay respuesta");

            if (userAnswer) {
                if (userAnswer === question.correct_answer) {
                    totalScore += question.type === "boolean" ? 5 : 10;
                }
            }
        })
        setScore(totalScore);
        setIsGameOver(true);
    }

    console.log("SCORE", score)


    const personalizedScore = (score: number) => {
        if (score > 90) return "💯 PERFECT SCORE 💯";
        if (score > 40 && score <= 95) return "💪 GOOD SCORE 💪";
        if (score > 10 && score <= 40) return "😀 OK SCORE 😀";
        if (score < 10) return "💩 BAD SCORE 💩";

        return "💩 BAD SCORE 💩";
    }


    return (
        <div className={styles.gameContainer}>
            <div className={styles.gameIntro}>
                <h1>ANSWER THE QUESTIONS</h1>
                <ul className={styles.list}>
                    <li>Correct answer (true/false): 5 POINTS 👍</li>
                    <li>Correct answer (multiple choice): 10 POINTS 🔥</li>
                    <li>Incorrect answer: 0 POINTS 😢</li>
                </ul>
            </div>


            <div className={styles.startGame}>
                {questions.length > 0 ?
                    questions.map((question) => (
                        <div key={question.id} className={styles.questionContainer}>
                            {/*se usa esta prop para representar comillas correctamente*/}
                            <h3 dangerouslySetInnerHTML={{ __html: question.question }} className={styles.questionName} />
                            {question.type === "boolean" ? (
                                <div className={styles.answers}>
                                    <Button
                                        selected={isSelectedAnswer[question.id] === "True" ? true : false}
                                        onClick={() => handleAnswerSelection(question.id, "True")}>
                                        True
                                    </Button>
                                    <Button
                                        selected={isSelectedAnswer[question.id] === "False" ? true : false}
                                        onClick={() => handleAnswerSelection(question.id, "False")}>
                                        False
                                    </Button>
                                </div>
                            ) : (
                                <div className={styles.answers}>
                                    {question.answers.map((answer: string) => (
                                            <Button
                                                key={answer}
                                                selected={isSelectedAnswer[question.id] === answer ? true : false}
                                                onClick={() => handleAnswerSelection(question.id, answer)}>
                                                <span dangerouslySetInnerHTML={{ __html: answer }} />
                                            </Button>
                                        ))

                                    }
                                    {/* {question.incorrect_answers.map((answer: string) => (
                                        <Button
                                            key={answer}
                                            className={styles.button}
                                            onClick={() => { console.log(answer) }}>
                                            <p dangerouslySetInnerHTML={{ __html: answer }} />
                                        </Button>
                                    ))}
                                    <Button
                                        className={styles.button}
                                        onClick={() => { console.log(question.correct_answer) }}>
                                        <p dangerouslySetInnerHTML={{ __html: question.correct_answer }} />
                                    </Button> */}
                                </div>
                            )}
                            {isGameOver && isSelectedAnswer[question.id] && (
                                <div className={
                                    isSelectedAnswer[question.id] === question.correct_answer
                                        ? styles.correctAnswer
                                        : styles.wrongAnswer
                                }>
                                    {isSelectedAnswer[question.id] === question.correct_answer
                                        ? "Correct"
                                        : "Wrong"}
                                </div>
                            )}
                        </div>
                    ))
                    :
                    <Commet color="#319bcc" size="small" text="" textColor="" />
                }
            </div>


            {questions.length > 0 &&
                !isGameOver &&
                isSelectedAnswer &&
                Object.keys(isSelectedAnswer).length === questions.length &&
                (
                    <div className={styles.submitContainer}>
                        <Button className={styles.submitButton} onClick={handleSubmit}>
                            Submit Answers
                        </Button>
                    </div>
                )}


            {isGameOver && (
                <div className={styles.results}>
                    <h2>Your Score: {personalizedScore(score)}</h2>
                </div>
            )}

        </div>
    );
}

export default Game;
