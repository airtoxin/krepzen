import {
  FunctionComponent,
  Reducer,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import styles from "./Game.module.css";
import { clamp, unwrap } from "../../utils";
import { array, Int, string, type } from "io-ts";

export type Props = {
  id: string;
  size: number;
  token: string;
};

type CellState = {
  row: number;
  col: number;
  color?: string;
  dead?: true;
  active?: { rowInActive: number; colInActive: number };
};

type Tile = {
  row: number;
  col: number;
  color: string;
};

export const Game: FunctionComponent<Props> = ({ id, size, token }) => {
  const [activeToken, setActiveToken] = useState(token);
  const [tileSet, setTileSet] = useState<Tile[]>();
  const initialCells = useMemo<CellState[][]>(
    () =>
      Array.from(Array(size)).map((_, row) =>
        Array.from(Array(size)).map((__, col) => ({
          row,
          col,
        }))
      ),
    [size]
  );
  const getCenterFromMousePosition = useCallback(
    (mousePosition: { row: number; col: number }) => ({
      row: clamp(mousePosition.row, 1, size - 2),
      col: clamp(mousePosition.col, 1, size - 2),
    }),
    [size]
  );

  const getTileFromCell = useCallback(
    (cell: CellState) =>
      cell.active &&
      tileSet?.find(
        (t) =>
          t.row === cell.active!.rowInActive &&
          t.col === cell.active!.colInActive
      ),
    [tileSet]
  );
  const getNextColor = useCallback(
    (cell: CellState): string | undefined => {
      const tile = getTileFromCell(cell);
      let nextColor = cell.color;
      if (tile && tile.color === cell.color) {
        nextColor = undefined;
      } else if (tile && cell.color == null) {
        nextColor = tile.color;
      } else if (tile && tile.color !== cell.color) {
        nextColor = "black";
      }
      return nextColor;
    },
    [getTileFromCell]
  );

  const [cells, cellsDispatch] = useReducer<
    Reducer<
      CellState[][],
      | { type: "setActive"; mouse: { row: number; col: number } }
      | { type: "placeTile"; mouse: { row: number; col: number } }
    >
  >((state, action) => {
    switch (action.type) {
      case "setActive": {
        return state.map((row) =>
          row.map((cell) => {
            const center = getCenterFromMousePosition(action.mouse);
            const activeRange =
              center.row - 1 <= cell.row &&
              cell.row <= center.row + 1 &&
              center.col - 1 <= cell.col &&
              cell.col <= center.col + 1;
            return {
              ...cell,
              active: activeRange
                ? {
                    rowInActive: cell.row - (center.row - 1),
                    colInActive: cell.col - (center.col - 1),
                  }
                : undefined,
            };
          })
        );
      }
      case "placeTile": {
        return state.map((row) =>
          row.map((cell) => {
            const color = getNextColor(cell);

            return {
              ...cell,
              color,
              dead: color === "black" ? (true as const) : undefined,
            };
          })
        );
      }
      default: {
        return state;
      }
    }
  }, initialCells);

  const fetchTileSet = useCallback(() => {
    fetch(`/api/game/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: activeToken,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const { token, tileSet } = unwrap(
          type({
            token: string,
            tileSet: array(type({ row: Int, col: Int, color: string })),
          })
        )(data);
        setActiveToken(token);
        setTileSet(tileSet);
      });
  }, [id, activeToken]);

  useEffect(fetchTileSet, []);

  return (
    <div>
      {cells.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: "flex" }}>
          {row.map((cell) => (
            <div
              key={cell.col}
              className={[
                cell.active ? styles.active : "",
                cell.color ? styles[cell.color] : "",
                (() => {
                  const tile = getTileFromCell(cell);
                  return tile ? styles[tile.color] : "";
                })(),
              ].join(" ")}
              style={{
                width: "6rem",
                height: "6rem",
                border: "solid 1px",
              }}
              onMouseEnter={() => {
                cellsDispatch({ type: "setActive", mouse: cell });
              }}
              onClick={() => {
                cellsDispatch({ type: "placeTile", mouse: cell });
                fetchTileSet();
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
