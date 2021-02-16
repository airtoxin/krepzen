import { getOrElseW, mapLeft } from "fp-ts/Either";
import { Decoder } from "io-ts";
import { pipe } from "fp-ts/function";
import { PathReporter } from "io-ts/PathReporter";

export const range = (
  num: number,
  start: number = 0,
  span: number = 1
): number[] => Array.from(Array(num)).map((_, i) => start + i * span);

export const shuffle = <T>(items: readonly T[]): T[] => {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const r = Math.floor(Math.random() * (i + 1));
    const tmp = out[i]!;
    out[i] = out[r]!;
    out[r] = tmp;
  }
  return out;
};

export const select = <T>(items: readonly T[], num: number = 1) =>
  shuffle(items).slice(0, num);

export const clamp = (num: number, min: number, max: number) =>
  Math.max(min, Math.min(max, num));

export const unwrap = <R>(decoder: Decoder<unknown, R>) => (data: unknown) => {
  const result = decoder.decode(data);
  return pipe(
    result,
    mapLeft(() => {
      throw new Error(PathReporter.report(result).join(" | "));
    }),
    getOrElseW(() => {
      throw new Error("Decode error");
    })
  );
};
