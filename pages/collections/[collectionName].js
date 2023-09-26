import Head from "next/head";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import RemoveItemDialog from "../../components/remove-item-dialog/remove-item-dialog.index";
import SearchBar from "../../components/search-bar";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import ClearIcon from "@mui/icons-material/Clear";

import cardStyles from "../../styles/card.module.css";
import pageStyles from "../../styles/page.module.css";
import footerStyles from "../../styles/footer.module.css";
import listStyles from "../../styles/list.module.css";

import { useRouter } from "next/router";
import { titleCase } from "../../utils/format";
import { getCollection, cancelItem } from "../../utils/collections-manager";

export const getServerSideProps = async ({ params, query }) => {
	let collectionItems = await getCollection(params.collectionName, {
		...query,
		collectionName: undefined,
	});

	return {
		props: {
			collectionItems,
		},
	};
};

export default function Page({ collectionItems }) {
	const router = useRouter();
	const collectionName = router.query.collectionName;
	const currnetTags = router.query.tags ?? '';

	const cancelItemCallback = (collectionName, item) => async (doDelete) => {
		if (!doDelete) return;

		return cancelItem(collectionName, item).then(() => {
			return router.reload();
		});
	};

	const searchTags = (tags, collectionName) => {
		router.replace({
			pathname: `/collections/${collectionName}`,
			query: { tags },
		});
	};

	const clearTags = (collectionName) => {
		router.replace({
			pathname: `/collections/${collectionName}`,
			query: {},
		});
	};

	const searchCallback = (e) => {
		console.log(e.currentTarget.value);
		console.log(e.currentTarget.checkValidity());
	};

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

				<SearchBar
					searchCallback={searchCallback}
					value={currnetTags}
					disabled
				/>
				<Button
					variant="outlined"
					color="secondary"
					size="small"
					startIcon={<ClearIcon />}
					onClick={() => clearTags(collectionName)}
				>
					Clear Search
				</Button>

				<section>
					<ul className={listStyles.ui}>
						{collectionItems?.map((item) => (
							<li
								key={item._id}
								className={cardStyles.list_card}
								style={{ margin: "0.5rem" }}
							>
								<div style={{ float: "right" }}>
									<Button
										variant="outlined"
										color="primary"
										size="small"
										startIcon={<EditIcon />}
									>
										Edit
									</Button>
									<RemoveItemDialog
										item={item}
										collectionName={collectionName}
										callback={cancelItemCallback(collectionName, item)}
									></RemoveItemDialog>
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
								<div style={{ float: "right" }}>
									<Stack direction="row" spacing={1}>
										{item.tags?.map((tag) => (
											<Chip
												key={`${item._id}-${tag}-tag`}
												label={tag}
												onClick={() => searchTags(tag, collectionName)}
												size="small"
												variant="outlined"
											/>
										)) ?? "None"}
									</Stack>
								</div>
							</li>
						))}
					</ul>
				</section>
			</main>

			<footer className={footerStyles.footer}></footer>
		</div>
	);
}
