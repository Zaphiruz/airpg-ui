import Head from "next/head";
import Badge from "../../components/badge/badge.index";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import RemoveItemDialog from "../../components/remove-item-dialog/remove-item-dialog.index";

import cardStyles from "../../styles/card.module.css";
import pageStyles from "../../styles/page.module.css";
import footerStyles from "../../styles/footer.module.css";
import listStyles from "../../styles/list.module.css";

import { useRouter } from "next/router";
import { titleCase } from "../../utils/format";
import { getCollection, cancelItem } from "../../utils/collections-manager";

export const getServerSideProps = async ({ params }) => {
	let collectionItems = await getCollection(params.collectionName)

	return {
		props: {
			collectionItems,
		},
	};
};

export const ListCard = ({item, collectionName, cancelItemCallback}) => (
	<li
		key={item._id}
		className={cardStyles.list_card}
		style={{ margin: "0.5rem" }}
	>
		<div style={{ float: "right" }}>
			<Button variant="outlined" color='primary' startIcon={<EditIcon />}>Edit</Button>
			<RemoveItemDialog item={item} collectionName={collectionName} callback={cancelItemCallback}></RemoveItemDialog>
		</div>
		<dl className={listStyles.dl}>
			<div>
				<dt>Name</dt>
				<dd>{item.name}</dd>
			</div>
			<div>
				<dt>Description</dt>
				<dd>{item.description}</dd>
			</div>
		</dl>
		<div style={{ float: "right" }}>{
      item.tags?.map((tag) => (
        <Badge key={`${item._id}-${tag}-tag`}>{tag}</Badge>
      )) ?? "None"
    }</div>
	</li>
);

export default function Page({ collectionItems }) {
	const router = useRouter();
	const collectionName = router.query.collectionName;

  const cancelItemCallback = (collectionName, item) => async (doDelete) => {
    if (!doDelete) return;

    return cancelItem(collectionName, item).then(() => {
      return router.reload();
    })
  }

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
						{collectionItems?.map(item => (
              <ListCard key={item._id} item={item} collectionName={collectionName} cancelItemCallback={cancelItemCallback(collectionName, item)}></ListCard>
            ))}
					</ul>
				</section>
			</main>

			<footer className={footerStyles.footer}></footer>
		</div>
	);
}
