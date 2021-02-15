import {
  FunctionComponent,
  Reducer,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useRouter } from "next/router";
import { Krepzen } from "@prisma/client";
import styles from "../../styles/Game.module.css";

const Game: FunctionComponent = () => {
  const router = useRouter();
  const [, setToken] = useState<string>();
  const [krepzen, setKrepzen] = useState<Krepzen>();
  const [activeCell, setActiveCell] = useState<{ row: number; col: number }>();
  type CellState = { row: number; col: number; active: boolean };
  const [cells, cellsDispatch] = useReducer<
    Reducer<CellState[][], { type: "init"; size: number }>
  >((state, action) => {
    switch (action.type) {
      case "init": {
        return Array.from(Array(action.size)).map((_, row) =>
          Array.from(Array(action.size)).map((__, col) => ({
            row,
            col,
            active: false,
          }))
        );
      }
    }
    return state;
  }, []);

  useEffect(() => {
    if (typeof router.query.token === "string") {
      setToken(router.query.token);
      // router.replace(`/game/${router.query.id}`);
      fetch(`/api/game/${router.query.id}?token=${router.query.token}`)
        .then((res) => res.json())
        .then((krepzen) => {
          setKrepzen(krepzen);
          cellsDispatch({ type: "init", size: krepzen.size });
        });
    } else {
      router.replace("/");
    }
  }, []);

  if (krepzen == null) return null;

  console.log("@activeCell", activeCell);

  return (
    <div>
      {cells.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: "flex" }}>
          {row.map((cell) => (
            <div
              key={cell.col}
              className={
                activeCell &&
                cell.col - 1 <= activeCell.col &&
                activeCell.col <= cell.col + 1 &&
                cell.row - 1 <= activeCell.row &&
                activeCell.row <= cell.row + 1
                  ? styles.active
                  : ""
              }
              style={{
                width: "2rem",
                height: "2rem",
                border: "solid 1px",
              }}
              onMouseEnter={() => {
                setActiveCell(cell);
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Game;
