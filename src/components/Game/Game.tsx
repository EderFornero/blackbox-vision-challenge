/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useRef } from "react";
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

    const scrollRef = useRef<(HTMLDivElement | null)[]>([]);

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


    const handleAnswerSelection = (questionId: string, answer: string, index: number) => {
        setIsSelectedAnswer((prev) => ({ ...prev, [questionId]: answer }));

        //scroll
        if (index < questions.length - 1 && scrollRef.current[index + 1]) {
            scrollRef.current[index + 1]?.scrollIntoView({ behavior: "smooth" });
        }
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
        if (score > 90) return "💯 PERFECTO 💯";
        if (score > 40 && score <= 95) return "💪 MUY BUENO 💪";
        if (score > 10 && score <= 40) return "😀 BUENO 😀";
        if (score < 10) return "💩 MAL 💩";

        return "💩 MAL 💩";
    }

    console.log("ref", scrollRef.current.length)

    const showResults = (question: Question) => {
        return (
             isGameOver && isSelectedAnswer[question.id] && (
                <div className={
                    isSelectedAnswer[question.id] === question.correct_answer
                        ? styles.correctAnswer
                        : styles.wrongAnswer
                }>
                    {isSelectedAnswer[question.id] === question.correct_answer
                        ? "✅"
                        : "❌"}
                </div>
            ))
    }


    const restartGame = () => {
        setIsGameOver(false);
        setIsSelectedAnswer({});
        setScore(0);

        location.reload();
    }

    return (
        <div className={styles.gameContainer}>
            <div className={`${styles.gameIntro}`}>
                <h1>RESPONDE LAS PREGUNTAS</h1>
                <ul className={styles.list}>
                    <li>Respuesta correcta (Verdadero/Falso): 5 PUNTOS 👍</li>
                    <li>Respuesta correcta (multiple choice): 10 PUNTOS 🔥</li>
                    <li>Respuesta incorrecta: 0 PUNTOS 😢</li>
                </ul>
            </div>


            <div className={styles.startGame}>
                {questions.length > 0 ?
                    questions.map((question, index) => (
                        <div key={question.id} ref={(e) => scrollRef.current[index] = e} className={styles.questionContainer}>
                            {/*se usa esta prop "dangerouslySetInnerHTML" para representar comillas correctamente*/}
                            <div className={styles.questionNameContainer}>
                            <h3 dangerouslySetInnerHTML={{ __html: question.question }} className={styles.questionName} />
                            <h3>{showResults(question)}</h3>
                            </div>
                           
                            {question.type === "boolean" ? (
                                <div className={styles.answers}>
                                    <Button
                                        selected={isSelectedAnswer[question.id] === "True" ? true : false}
                                        onClick={() => handleAnswerSelection(question.id, "True", index)}
                                    >
                                        True
                                    </Button>

                                    <Button
                                        selected={isSelectedAnswer[question.id] === "False" ? true : false}
                                        onClick={() => handleAnswerSelection(question.id, "False", index)}>
                                        False
                                    </Button>
                                </div>
                            ) : (
                                <div className={styles.answers}>
                                    {question.answers.map((answer: string) => (
                                        <Button
                                            key={answer}
                                            selected={isSelectedAnswer[question.id] === answer ? true : false}
                                            onClick={() => handleAnswerSelection(question.id, answer, index)}>
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
                            {/* {isGameOver && isSelectedAnswer[question.id] && (
                                <div className={
                                    isSelectedAnswer[question.id] === question.correct_answer
                                        ? styles.correctAnswer
                                        : styles.wrongAnswer
                                }>
                                    {isSelectedAnswer[question.id] === question.correct_answer
                                        ? "✅"
                                        : "❌"}
                                </div>
                            )} */}
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
                            Enviar respuestas
                        </Button>
                    </div>
                )}


            {isGameOver && (
                <div className={styles.results}>
                    <h2>Tu puntuación es: <span className={styles.scoreNumber}>{score}</span> {personalizedScore(score)} </h2>
                    <button className={styles.restartButton} onClick={restartGame}>
                        Volver a jugar 
                        <span>🔄</span>
                    </button>
                </div>
                
            )}

        </div>
    );
}

export default Game;
