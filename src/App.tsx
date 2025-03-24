import { useState, useEffect, useRef } from "react";
import { Tetris, Board } from "./modules/Tetris";

const WIDTH = 10;
const HEIGHT = 20;
export default function TetrisGame() {
  const [board, setBoard] = useState<Board>([]);
  const game = useRef(new Tetris(WIDTH, HEIGHT, setBoard));
  useEffect(() => {
    game.current.start();
    return () => game.current.stop();
  }, [game]);

  return (
    <div className="w-screen h-screen flex flex-col items-center">
      <div className="text-center">
        <p className="text-lg">{game.current.getScore()}</p>
        <input
          type="range"
          max={1000}
          step={1}
          value={game.current.getSpeed()}
          onInput={(e) => {
            game.current.setSpeed(+e.currentTarget.value);
            console.log(e.currentTarget.value);
          }}
        />
      </div>
      <div
        className="p-5"
        style={{ width: WIDTH * 25 + "px", height: HEIGHT * 25 + "px" }}
      >
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className="w-[25px] h-[25px] border-1 border-black"
                style={{
                  borderColor: cell ? "gray" : "black",
                  backgroundColor: cell ? "black" : "white",
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
