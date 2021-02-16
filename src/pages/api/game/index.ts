import { NextApiHandler } from "next";
import { prisma } from "../../../prisma";
import { Int } from "io-ts";
import { unwrap } from "../../../utils";

const gameHandler: NextApiHandler = async (req, res) => {
  if (req.method === "PUT") {
    const size = unwrap(Int)(req.body.size);

    const krepzen = await prisma.krepzen.create({
      data: {
        size,
      },
    });

    res.send(krepzen);
  }
};

export default gameHandler;
