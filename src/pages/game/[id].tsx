import { GetServerSideProps } from "next";
import { prisma } from "../../prisma";
import { Game, Props } from "../../features/Game";

export default Game;

export const getServerSideProps: GetServerSideProps<Props> = async (req) => {
  if (typeof req.query.id !== "string" || typeof req.query.token !== "string")
    return { redirect: { destination: "/", permanent: false } };

  const krepzen = await prisma.krepzen.findFirst({
    where: { id: req.query.id, token: req.query.token },
  });
  if (krepzen == null)
    return { redirect: { destination: "/", permanent: false } };

  return {
    props: { id: req.query.id, size: krepzen.size, token: krepzen.token },
  };
};
