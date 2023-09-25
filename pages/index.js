import Head from "next/head";
import RouterLink from '../components/router-link';

import pageStyles from "../styles/page.module.css";
import cardStyles from "../styles/card.module.css";
import gridStyles from "../styles/grid.module.css";
import footerStyles from "../styles/footer.module.css";

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
		className={cardStyles.card}
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
		<div className={pageStyles.container}>
			<Head>
				<title>AI RPG Admin</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={`${pageStyles.main} ${pageStyles.main_center} ${pageStyles.main_large_padding}`}>
				<h1 className={pageStyles.title}>View and edit collections!</h1>

				<p className={pageStyles.description}>
					Get started by clicking a category below.
				</p>

				<ul className={gridStyles.grid}>{collectionNames.map(makeCard)}</ul>
			</main>

			<footer className={footerStyles.footer}></footer>

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
				code {
					background: #fafafa;
					border-radius: 5px;
					padding: 0.75rem;
					font-size: 1.1rem;
					font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
						DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
				}
			`}</style>
		</div>
	);
}
