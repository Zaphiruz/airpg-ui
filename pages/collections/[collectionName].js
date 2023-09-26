import Head from "next/head";
import Button from "@mui/material/Button";
import MainNav from '../../components/main-nav';
import RemoveItemDialog from "../../components/remove-item-dialog";
import EditItemModal from "../../components/edit-item-modal";
import SaveItemModal from "../../components/save-item-modal";
import EditRecipesModal from "../../components/edit-recipes-modal";
import SaveRecipesModal from "../../components/save-recipes-modal";
import SearchBar from "../../components/search-bar";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import ClearIcon from "@mui/icons-material/Clear";

import cardStyles from "../../styles/card.module.css";
import pageStyles from "../../styles/page.module.css";
import footerStyles from "../../styles/footer.module.css";
import listStyles from "../../styles/list.module.css";
import flexStyles from "../../styles/flex.module.css";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { titleCase, getRequestFormat } from "../../utils/format";
import {
	getCollection,
	deleteItem,
	editItem,
	saveItem,
	getCollectionNames,
} from "../../utils/collections-manager";

export const getServerSideProps = async ({ params, query }) => {

	let collectionNames = getCollectionNames();
	let collectionItems = getCollection(params.collectionName, {
		...query,
		collectionName: undefined,
	});

	return Promise.all([collectionNames, collectionItems]).then(([collectionNames, collectionItems]) =>
		({
			props: {
				collectionName: params.collectionName,
				collectionItems,
				collectionNames,
			},
		})
	);
};

export default function Page({collectionItems, collectionName, collectionNames }) {
	const router = useRouter();
	const query = Object.fromEntries(useSearchParams().entries());
	const pathname = usePathname();
	const currnetTags = query.tags ?? '';
	const showRecipeScreens = collectionName === 'recipes';

	const deleteItemCallback = (collectionName, item) => async (doDelete) => {
		if (!doDelete) return;

		return deleteItem(collectionName, item).then(() => {
			router.replace(getRequestFormat(pathname, query));
		});
	};

	const editItemCallback =
		(collectionName, item) => async (delta, callback) => {
			if (!delta) return;

			return editItem(collectionName, item, delta).then((newItem) => {
				if (newItem) {
					callback();
					router.replace(getRequestFormat(pathname, query));
				}
			});
		};

	const saveItemCallback = (collectionName) => async (item, callback) => {
		if (!item) return;

		return saveItem(collectionName, item).then((newItem) => {
			if (newItem) {
				callback();
				router.replace(getRequestFormat(pathname, query));
			}
		});
	};

	const searchTags = (tags, collectionName) => {
		router.replace(getRequestFormat(pathname, { tags }));
	};

	const clearTags = (collectionName) => {
		router.replace(pathname);
	};

	const searchCallback = (e) => {
		console.log(e.currentTarget.value);
		console.log(e.currentTarget.checkValidity());
	};

	const renderItem = (item) => (
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
	)

	const renderRecipe = (recipe) => (
		<dl className={listStyles.dl}>
			<div>
				<dt>Item</dt>
				<dd>{recipe?.item.name}</dd>
			</div>
			<div>
				<dt>Materials</dt>
				<dd>
					<ul className={listStyles.list_ul}>
						{recipe?.materials.map((material) => (
							<li key={`materials-${material._id}`}>{material.name}</li>
						))}
					</ul>
				</dd>
			</div>
		</dl>
	)

	return (<>
		<MainNav collectionNames={collectionNames} />

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

				<section>
					<div
						className={`${flexStyles.flex} ${flexStyles.space_between} ${flexStyles.centered}`}
						style={{ marginTop: "1rem" }}
					>
						<Button
							variant="outlined"
							color="secondary"
							startIcon={<ClearIcon />}
							onClick={() => clearTags(collectionName)}
						>
							Clear Search
						</Button>
						{
						(showRecipeScreens)
							? <SaveRecipesModal
								collectionName={collectionName}
								callback={saveItemCallback(collectionName)}
							/>
							: <SaveItemModal
								collectionName={collectionName}
								callback={saveItemCallback(collectionName)}
							/>
						}

					</div>

					<ul className={listStyles.ul}>
						{collectionItems?.map((item) => (
							<li
								key={item._id}
								className={cardStyles.list_card}
							>
								<div className={`${flexStyles.flex} ${flexStyles.end}`}>
									<div style={{ margin: "0 0.25rem" }}>
										{(showRecipeScreens)
											? <EditRecipesModal
												item={item}
												collectionName={collectionName}
												callback={editItemCallback(collectionName, item)}
											/>
											: <EditItemModal
												item={item}
												collectionName={collectionName}
												callback={editItemCallback(collectionName, item)}
											/>
										}
									</div>

									<div style={{ margin: "0 0.25rem" }}>
										<RemoveItemDialog
											item={item}
											collectionName={collectionName}
											callback={deleteItemCallback(collectionName, item)}
										></RemoveItemDialog>
									</div>
								</div>
								{
									(showRecipeScreens)
										? renderRecipe(item)
										: renderItem(item)
								}

								<Stack
									direction="row"
									spacing={1}
									justifyContent="flex-end"
									alignItems="center"
									flexWrap="wrap"
									useFlexGap
								>
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
							</li>
						))}
					</ul>
				</section>
			</main>

			<footer className={footerStyles.footer}></footer>
		</div>
	</>);
}
