import Head from "next/head";
import styles from "../styles/Home.module.css";
import { FunctionComponent, useCallback, useState } from "react";
import { useRouter } from "next/router";

export const Home: FunctionComponent = () => {
  const router = useRouter();
  const [size, setSize] = useState(5);
  const createNewGame = useCallback(() => {
    fetch("/api/game", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        size,
      }),
    })
      .then((res) => res.json())
      .then((krepzen) => {
        router.push(`/game/${krepzen.id}?token=${krepzen.token}`);
      });
  }, [size]);

  return (
    <div className={styles.container}>
      <Head>
        <title>KREPZEN</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>KREPZEN</h1>

        <section>
          <p>Select size</p>

          <select
            value={size}
            onChange={(event) =>
              setSize(Number.parseInt(event.target.value, 10))
            }
          >
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
          </select>
        </section>

        <button onClick={createNewGame}>new game</button>
      </main>
    </div>
  );
};

export default Home;
