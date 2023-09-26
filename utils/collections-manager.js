import { getRequestFormat } from './format';

const host = 'http://47.34.186.48:8080';

const stripRecipe = (recipe) => {
	let delta = { ...recipe };
	if (delta.materials) {
		delta.materials = delta.materials.map(material => material._id);
	}
	if (delta.item) {
		delta.item = delta.item._id;
	}
	return delta;
}

export const deleteItem = async (collectionName, item) => {
	console.log("Delete Item", collectionName, item._id)
	return fetch(`${host}/api/${collectionName}/${item._id}`, {
		method: "DELETE"
	})
}

export const editItem = async (collectionName, item, delta) => {
	console.log("Edit Item", collectionName, item._id, delta)

	if (collectionName === 'recipes') {
		item = stripRecipe(item);
		delta = stripRecipe(delta);
	}

	let responce = await fetch(`${host}/api/${collectionName}/${item._id}`, {
		method: "PUT",
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			...item,
			...delta
		})
	});
	return responce.json();
}

export const saveItem = async (collectionName, item) => {
	console.log("New Item", collectionName, item);
	let responce = await fetch(`${host}/api/${collectionName}`, {
		method: "POST",
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(item)
	});
	return responce.json();
}

export const getCollection = async (collectionName, query) => {
	console.log("Get Colleciton", collectionName);
	let responce = await fetch(
		getRequestFormat(`${host}/api/${collectionName}`, query)
	);
	return responce.json();
}

export const getCollectionNames = async () => {
	let responce = await fetch(`${host}/meta/collectionNames`);
	return responce.json();
}