import Head from "next/head";
import styles from "../styles/Home.module.css";
import RouterLink from '../components/router-link';

import { titleCase } from '../utils/format';

export const getServerSideProps = async () => {
	let responce = await fetch("http://127.0.0.1:8080/meta/collectionNames");
	let collectionNames = await responce.json();

	return {
		props: {
			collectionNames,
		},
	};
};


const makeCard = (collectionName) => (
	<RouterLink href={`collections/${collectionName}`}
		className={styles.card}
		key={collectionName}
	>
		<li>
			<h3>{titleCase(collectionName)}</h3>
			<p>Description for {collectionName} here.</p>
		</li>
	</RouterLink>
);

export default function Home({ collectionNames }) {
	return (
		<div className={styles.container}>
			<Head>
				<title>AI RPG Admin</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main>
				<h1 className={styles.title}>View and edit collections!</h1>

				<p className={styles.description}>
					Get started by clicking a category below.
				</p>

				<ul className={styles.grid}>{collectionNames.map(makeCard)}</ul>
			</main>

			<footer></footer>

			<style jsx>{`
				main {
					padding: 5rem 0;
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
				}
				footer {
					width: 100%;
					height: 100px;
					border-top: 1px solid #eaeaea;
					display: flex;
					justify-content: center;
					align-items: center;
				}
				footer img {
					margin-left: 0.5rem;
				}
				footer a {
					display: flex;
					justify-content: center;
					align-items: center;
					text-decoration: none;
					color: inherit;
				}
				code {
					background: #fafafa;
					border-radius: 5px;
					padding: 0.75rem;
					font-size: 1.1rem;
					font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
						DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
				}
			`}</style>

			<style jsx global>{`
				html,
				body {
					padding: 0;
					margin: 0;
					font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
						Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
						sans-serif;
				}
				* {
					box-sizing: border-box;
				}
			`}</style>
		</div>
	);
}
