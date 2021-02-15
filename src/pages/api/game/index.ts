import { NextApiHandler } from "next";
import { prisma } from "../../../prisma";
import { Int } from "io-ts";
import { getOrElseW } from "fp-ts/Either";
import { pipe } from "fp-ts/function";

const gameHandler: NextApiHandler = async (req, res) => {
  if (req.method === "PUT") {
    const size = pipe(
      Int.decode(req.body.size),
      getOrElseW(() => {
        throw new Error("non integer");
      })
    );

    const krepzen = await prisma.krepzen.create({
      data: {
        size,
      },
    });

    res.send(krepzen);
  }
};

export default gameHandler;
