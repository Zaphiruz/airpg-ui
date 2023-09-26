import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@mui/icons-material/Delete";

export const RemoveItemDialog = ({
	item,
	collectionName,
	callback,
}) => {
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const success = () => {
		handleClose();
		callback?.(true);
	};

	const cancel = () => {
		handleClose();
		callback?.(false);
	};

	return (
		<div>
			<Button
				variant="outlined"
				color="error"
				size="small"
				onClick={handleClickOpen}
				startIcon={<DeleteIcon />}
			>
				Delete
			</Button>
			<Dialog
				open={open}
				onClose={cancel}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">
					Do you want to delete <strong>{item.name}</strong> from{" "}
					<strong>{collectionName}</strong>?
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						This action will delete the record. You will not be able to restore
						it. If you want it back, you will need to reenter the data.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button variant="outlined" color="error" onClick={cancel}>
						Do Not Delete
					</Button>
					<Button
						variant="outlined"
						color="success"
						onClick={success}
						autoFocus
					>
						Agree
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default RemoveItemDialog;
