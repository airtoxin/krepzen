import { NextApiHandler } from "next";
import { prisma } from "../../../prisma";
import { range, select, unwrap } from "../../../utils";
import { string, type } from "io-ts";
import { v4 } from "uuid";

const colors = ["red", "blue", "purple", "green"] as const;

const gameDetailHandler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    const { id } = unwrap(type({ id: string }))(req.query);
    const { token } = unwrap(type({ token: string }))(req.body);
    const newToken = v4();
    await prisma.krepzen.updateMany({
      where: {
        id,
        token,
      },
      data: {
        token: newToken,
      },
    });

    const tileSet = select(
      range(3).flatMap((row) =>
        range(3).map((col) => ({ row, col, color: select(colors, 1)[0] }))
      ),
      2
    );
    res.send({ token: newToken, tileSet });
  }
};

export default gameDetailHandler;
