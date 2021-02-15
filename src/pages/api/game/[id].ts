import { NextApiHandler } from "next";
import { prisma } from "../../../prisma";

const individualGameHandler: NextApiHandler = async (req, res) => {
  if (req.method === "GET") {
    console.log("@req.query", req.query);
    if (typeof req.query.id !== "string") return res.status(400).end();
    if (typeof req.query.token !== "string") return res.status(400).end();

    const krepzen = await prisma.krepzen.findFirst({
      where: { id: req.query.id, token: req.query.token },
    });
    if (krepzen == null) return res.status(400).end();
    console.log("@krepzen", krepzen);

    res.send(krepzen);
  }
};

export default individualGameHandler;
