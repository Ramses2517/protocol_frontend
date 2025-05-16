import React from "react";
import { css } from "@emotion/css";

const webStubStyles = {
  container: css`
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-family: "Chakra Petch", sans-serif;
    font-size: 18px;
    font-weight: 400;
    line-height: 1.5;
    color: #ffffff;
    padding: 20px;
  `,
  textWrapper: css`
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 8px; /* Расстояние между элементами */
  `,
  link: css`
      font-family: "Space Mono", sans-serif;
    color: #17E585;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  `,
};

export const WebStub: React.FC = () => {
  return (
    <div className={webStubStyles.container}>
      <div className={webStubStyles.textWrapper}>
        <span>
          Sorry, fren! No web version here.
        </span>
        <span>👇</span>
        <a
          href="https://t.me/FrogProtocolBot"
          target="_blank"
          rel="noopener noreferrer"
          className={webStubStyles.link}
        >
          App
        </a>
      </div>
    </div>
  );
};
