import * as React from "react";
import Modal from "@mui/material/Modal";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import flexStyles from "../styles/flex.module.css";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 440,
	bgcolor: "background.paper",
	boxShadow: 24,
	p: 4,
};

export default ({ item, collectionName, callback }) => {
	const [open, setOpen] = React.useState(false);
	const [delta, setDelta] = React.useState({});
	const [dirty, setDirty] = React.useState(false);
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
		let tags = delta.tags ?? item.tags;
		let clone = [...tags];

		clone.splice(tags.indexOf(tag), 1);

		return applyDelta("tags", clone);
	}

	function addTag(newTag) {
		let clone = new Set([...item.tags, ...(delta.tags ?? []), newTag.toUpperCase()]);
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
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Typography id="modal-modal-title" variant="h6" component="h2">
						Edit <strong>{item.name}</strong>
					</Typography>

					<form>
						<FormControl sx={{ width: "25ch", margin: "0.5rem 0" }}>
							<InputLabel sx={{ background: "white" }} htmlFor="name">
								Name
							</InputLabel>
							<OutlinedInput
								placeholder="Please enter a name"
								id="name"
								value={delta.name ?? item.name}
								onChange={(e) => applyDelta("name", e.currentTarget.value)}
							/>
						</FormControl>
						<FormControl fullWidth sx={{ margin: "0.5rem 0" }}>
							<TextField
								id="description"
								label="Description"
								multiline
								rows={4}
								value={delta.description ?? item.description}
								onChange={(e) =>
									applyDelta("description", e.currentTarget.value)
								}
							/>
						</FormControl>

						<div className={`${flexStyles.flex} ${flexStyles.space_between}`}>
							<div>
								<TagModal item={item} callback={addTag}></TagModal>
							</div>

							<div>
								{(delta.tags ?? item.tags)?.map((tag) => (
									<Chip
										key={`edit-${item._id}-${tag}-tag`}
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
}
