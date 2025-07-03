import {keyframes} from "@emotion/react";

export const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

export const slideRight = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% { 
    transform: translateX(0px);
    opacity: 1;
  }
`;

export const slideUp = keyframes`
  0% {
    transform: translateY(20px);
  }
  100% { 
    transform: translateY(0px);
  }
`;
