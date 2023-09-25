const host = 'http://127.0.0.1:8080';

export const cancelItem = async (collectionName, item) => {
	console.log("Delete Item", collectionName, item._id)
	return fetch(`${host}/api/${collectionName}/${item._id}`, {
		method: "DELETE"
	})
}

export const cancelItemHandler = (collectionName, item) => async (doDelete) => {
	if (!doDelete) return;

	return cancelItem(collectionName, item);
}

export const getCollection = async (collectionName) => {
	console.log("Get Colleciton", collectionName);
	let responce = await fetch(
		`${host}/api/${collectionName}`
	);
	return responce.json();
}

export const getCollectionNames = async () => {
	let responce = await fetch(`${host}/meta/collectionNames`);
	return responce.json();
}