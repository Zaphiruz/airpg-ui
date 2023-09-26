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

export default ({ collectionName, callback }) => {
	const [open, setOpen] = React.useState(false);
	const [item, setItem] = React.useState({ name: "", description: "", tags: [] });
	const [dirty, setDirty] = React.useState(false);
	const handleOpen = () => {
		setOpen(true);
		clearRecord();
	};
	const handleClose = () => {
		setOpen(false);
		clearRecord();
	};

	function applyItem(key, value) {
		setDirty(true);

		setItem({
			...item,
			[key]: value,
		});
	}

	function removeTags(tag) {
		let clone = [...(item.tags ?? [])];
		clone.splice(tags.indexOf(tag), 1);

		return applyItem("tags", clone);
	}

	function addTag(newTag) {
		let clone = new Set([...(item.tags ?? []), newTag.toUpperCase()]);
		return applyItem("tags", Array.from(clone));
	}

	const saveRecord = async (item) => {
		await callback(item, () => handleClose());
	};

	const clearRecord = () => {
		setDirty(false);

		setItem({});
	};

	return (
		<div style={{ marginTop: "1rem" }} >
			<div className={`${flexStyles.flex} ${flexStyles.end}`}>
				<Button
					variant="outlined"
					color="success"
					size="large"
					startIcon={<AddCircleOutlineIcon />}
					onClick={handleOpen}
					xs={{ marginRight: "auto" }}
				>
					New {collectionName}
				</Button>
			</div>

			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Typography id="modal-modal-title" variant="h6" component="h2">
						New <strong>{collectionName}</strong>
					</Typography>

					<form>
						<FormControl sx={{ width: "25ch", margin: "0.5rem 0" }}>
							<InputLabel sx={{ background: "white" }} htmlFor="name">
								Name
							</InputLabel>
							<OutlinedInput
								placeholder="Please enter a name"
								id="name"
								value={item.name}
								onChange={(e) => applyItem("name", e.currentTarget.value)}
							/>
						</FormControl>
						<FormControl fullWidth sx={{ margin: "0.5rem 0" }}>
							<TextField
								id="description"
								label="Description"
								multiline
								rows={4}
								value={item.description}
								onChange={(e) =>
									applyItem("description", e.currentTarget.value)
								}
							/>
						</FormControl>

						<div className={`${flexStyles.flex} ${flexStyles.space_between}`}>
							<div>
								<TagModal item={item} callback={addTag}></TagModal>
							</div>

							<div>
								{item.tags?.map((tag) => (
									<Chip
										key={`new-item-${tag}-tag`}
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
								onClick={() => saveRecord(item)}
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
				key={`new-item-new-tag`}
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
}
