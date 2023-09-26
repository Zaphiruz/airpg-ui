
import Modal from "@mui/material/Modal";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import OutlinedInput from "@mui/material/OutlinedInput";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import flexStyles from "../styles/flex.module.css";

import * as React from "react";
import { getCollection } from "../utils/collections-manager";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	bgcolor: "background.paper",
	boxShadow: 24,
	p: 4,
};

export default ({ item: recipe, collectionName, callback }) => {
	const [open, setOpen] = React.useState(false);
	const [delta, setDelta] = React.useState({});
	const [dirty, setDirty] = React.useState(false);
	const [itemsCollection, setItemsCollection] = React.useState([]);

	React.useEffect(() => {
		getCollection('items')
			.then(setItemsCollection)
	}, [])

	const handleOpen = () => {
		setOpen(true);
		clearRecord();
	};
	const handleClose = () => {
		setOpen(false);
		clearRecord();
	};

	function applyDelta(key, value) {
		setDirty(true);

		setDelta({
			...delta,
			[key]: value,
		});
	}

	function removeTags(tag) {
		let tags = delta.tags ?? recipe.tags;
		let clone = [...tags];

		clone.splice(tags.indexOf(tag), 1);

		return applyDelta("tags", clone);
	}

	function addTag(newTag) {
		let clone = new Set([
			...recipe.tags,
			...(delta.tags ?? []),
			newTag.toUpperCase(),
		]);
		return applyDelta("tags", Array.from(clone));
	}

	const saveRecord = async (delta) => {
		await callback(delta, () => handleClose());
	};

	const clearRecord = () => {
		setDirty(false);

		setDelta({});
	};

	return (
		<div>
			<Button
				variant="outlined"
				color="primary"
				size="small"
				startIcon={<EditIcon />}
				onClick={handleOpen}
			>
				Edit
			</Button>
			<Modal
				open={open}
				onClose={handleClose}
				size="large"
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Typography id="modal-modal-title" variant="h6" component="h2">
						Edit <strong>Recipe</strong>
					</Typography>

					<form>
						<FormControl fullWidth sx={{ margin: "1rem 0" }}>
							<InputLabel id={`edit-${recipe._id}-item`}>Item</InputLabel>
							<Select
								labelId={`edit-${recipe._id}-item`}
								id={`edit-${recipe._id}-item-select`}
								label="Item"
								value={itemsCollection.find(item => item._id === (delta.item ?? recipe.item)._id)}
								onChange={(e) => {
									applyDelta("item", e.target.value);
								}}
							>
								{itemsCollection?.map(item => (
									<MenuItem key={`edit-${recipe._id}-items-select-${item._id}`} value={item}>{item.name}</MenuItem>
								))}
							</Select>
						</FormControl>

						<FormControl fullWidth sx={{ margin: "1rem 0" }}>
							<InputLabel id={`edit-${recipe._id}-materials`} sx={{ backgroundColor: 'white', padding: '0 0.3rem' }}>Materials</InputLabel>
							<Select
								labelId={`edit-${recipe._id}-materials`}
								id={`edit-${recipe._id}-materials-select`}
								multiple
								value={(delta.materials ?? recipe.materials).map(item => item._id).reduce((c, v) => {
									let material = itemsCollection.find(material => material._id === v);
									if (material) {
										c.push(material);
									}
									return c;
								}, []) ?? []}
								onChange={(e) => {applyDelta("materials", e.target.value)}}
								input={<OutlinedInput label="Tag" />}
								renderValue={(selected) => (
									<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
									  {selected.map((material) => (
										<Chip key={`edit-${recipe._id}-materials-select-${material._id}`} label={material.name} />
									  ))}
									</Box>
								  )}
							>
								{itemsCollection.map((material) => (
									<MenuItem key={material._id} value={material}>
										<Checkbox checked={!!(delta.materials ?? recipe.materials).find(item => material._id === item._id)} />
										<ListItemText primary={material.name} />
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<div className={`${flexStyles.flex} ${flexStyles.space_between}`}>
							<div>
								<TagModal item={recipe} callback={addTag}></TagModal>
							</div>

							<div>
								{(delta.tags ?? recipe.tags)?.map((tag) => (
									<Chip
										key={`edit-${recipe._id}-${tag}-tag`}
										label={tag}
										size="small"
										variant="outlined"
										onDelete={() => removeTags(tag)}
										deleteIcon={<DeleteIcon />}
										color="error"
										sx={{ margin: "0 0.25rem" }}
									/>
								))}
							</div>
						</div>

						<div className={`${flexStyles.flex} ${flexStyles.end}`}>
							<Button
								variant="outlined"
								color="secondary"
								onClick={clearRecord}
								disabled={!dirty}
								sx={{ margin: "0.5rem" }}
							>
								Clear
							</Button>
							<Button
								variant="outlined"
								color="success"
								onClick={() => saveRecord(delta)}
								disabled={!dirty}
								sx={{ margin: "0.5rem" }}
							>
								Save
							</Button>
						</div>
					</form>
				</Box>
			</Modal>
		</div>
	);
};

function TagModal({ item, callback }) {
	const [open, setOpen] = React.useState(false);
	const [newTag, setNewTag] = React.useState("");
	const handleOpen = () => {
		clearNewTag();
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
		clearNewTag();
	};

	const clearNewTag = () => {
		setNewTag("");
	};

	const saveNewTagHandler = (newTag) => {
		callback(newTag);
		handleClose();
	};

	return (
		<React.Fragment>
			<Chip
				key={`edit-${item._id}-new-tag`}
				label="New Tag"
				size="small"
				variant="outlined"
				icon={<AddCircleOutlineIcon />}
				color="success"
				sx={{ marginLeft: "0.25rem" }}
				onClick={handleOpen}
			/>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="child-modal-title"
				aria-describedby="child-modal-description"
			>
				<Box sx={{ ...style, width: 200 }}>
					<h2 id="child-modal-title">
						New tag for <strong>{item.name}</strong>
					</h2>
					<p id="child-modal-description">
						Please enter the new tag that you want to add.
					</p>

					<FormControl sx={{ width: "25ch", margin: "0.5rem 0" }}>
						<InputLabel sx={{ background: "white" }} htmlFor="tag">
							Tag
						</InputLabel>
						<OutlinedInput
							placeholder="Please enter a tag"
							id="tag"
							value={newTag}
							onChange={(e) => setNewTag(e.currentTarget.value)}
							autoFocus
						/>
					</FormControl>

					<div className={`${flexStyles.flex} ${flexStyles.space_between}`}>
						<Button variant="outlined" color="secondary" onClick={handleClose}>
							Close
						</Button>
						<Button
							onClick={() => saveNewTagHandler(newTag)}
							variant="outlined"
							color="success"
							disabled={!newTag}
						>
							Add Tag
						</Button>
					</div>
				</Box>
			</Modal>
		</React.Fragment>
	);
};
