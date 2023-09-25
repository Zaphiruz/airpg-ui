import Head from "next/head";
import Badge from "../../components/badge/badge.index";

import cardStyles from "../../styles/card.module.css";
import pageStyles from "../../styles/page.module.css";
import footerStyles from "../../styles/footer.module.css";
import listStyles from "../../styles/list.module.css";

import { useRouter } from "next/router";
import { titleCase } from "../../utils/format";

export const getServerSideProps = async ({ params }) => {
	let responce = await fetch(
		`http://127.0.0.1:8080/api/${params.collectionName}`
	);
	let collectionItems = await responce.json();

	return {
		props: {
			collectionItems,
		},
	};
};

const makeBadge = (tag) => (
  <Badge key={tag}>{tag}</Badge>
)

export const makeListCard = (item) => (
	<li key={item._id} className={cardStyles.list_card} >
		<dl className={listStyles.dl}>
			<div>
				<dt>Name</dt>
				<dd>{item.name}</dd>
			</div>
			<div>
				<dt>Description</dt>
				<dd>{item.description}</dd>
			</div>
      <div>
				<dt>Tags</dt>
        <dd>{item.tags?.map(makeBadge) ?? "None"}</dd>
			</div>
		</dl>
	</li>
);

export default function Page({ collectionItems }) {
	const router = useRouter();
	const collectionName = router.query.collectionName;

	return (
		<div className={pageStyles.container}>
			<Head>
				<title>AI RPG {titleCase(collectionName)} Collection</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={pageStyles.main}>
				<h1 className={pageStyles.title}>
					{titleCase(collectionName)} Collection
				</h1>
				<p className={pageStyles.description}>
					Here, you can use basic CRUD opperations on{" "}
					{titleCase(collectionName)} items
				</p>

				<section>
					<ul className={listStyles.ui}>
						{collectionItems?.map(makeListCard)}
					</ul>
				</section>
			</main>

			<footer className={footerStyles.footer}></footer>
		</div>
	);
}
