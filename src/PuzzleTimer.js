import { useContext, useEffect, useState } from "react";
import React from "react";
import { PuzzleStateContext } from "./App";

const PuzzleTimer = () => {
    const [timerString, setTimerString] = useState('00:00:00');
    const { puzzleState } = useContext(PuzzleStateContext);

    const puzzleSolved = puzzleState.puzzleSolved;

    useEffect(() => {
        if(puzzleSolved) {
            return;
        }

        const loadTime = new Date();
        const timerInterval = setInterval(() => {
            const elapsedSeconds = Math.floor((new Date() - loadTime) / 1000);
            const hours = Math.floor(elapsedSeconds / 3600)
                .toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
            const minutes = Math.floor((elapsedSeconds % 3600) / 60)
                .toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
            const seconds = (elapsedSeconds % 60)
                .toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
            const timeString = `${hours}:${minutes}:${seconds}`;
            setTimerString(timeString);
        }, 1000)
        return () => {
            clearInterval(timerInterval);
        }
    }, [puzzleSolved]);

    return (
        <div id="puzzle-timer">{timerString}</div>
    )
}

export { PuzzleTimer as default };