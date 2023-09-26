import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";

export default ({ searchCallback, disabled, value }) => (
	<FormControl fullWidth disabled={disabled}>
		<InputLabel
			sx={{ background: 'white' }}
			htmlFor="search-bar"
			disabled={disabled}>
			Search
		</InputLabel>
		<OutlinedInput
			value={value}
			onChange={searchCallback}
			inputProps={{
				pattern: "s*w+s*=s*w+s*",
				title: "please enter in the following format. key = value"
			}}
			disabled={disabled}
		/>
	</FormControl>
);
