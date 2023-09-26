import { getRequestFormat } from './format';

const host = 'http://127.0.0.1:8080';

export const cancelItem = async (collectionName, item) => {
	console.log("Delete Item", collectionName, item._id)
	return fetch(`${host}/api/${collectionName}/${item._id}`, {
		method: "DELETE"
	})
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