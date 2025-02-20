export interface Question {
  id: string;
  question: string;
  type: string;
  difficulty: string;
  category: string;
  correct_answer: string;
  incorrect_answers: string[];
  answers: string[];
}

export interface ButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  selected?: boolean;
}
