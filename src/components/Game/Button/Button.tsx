/* eslint-disable prettier/prettier */
import React from "react";

import {ButtonProps} from "../../../types";

import styles from "./Button.module.scss";

const Button: React.FC<ButtonProps> = ({children, className, onClick, selected}) => {
  return (
    <button className={`${styles.btn} ${className} ${selected ? styles.selected : ""}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
