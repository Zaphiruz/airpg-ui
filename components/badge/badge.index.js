import badgeStyles from "./badge.module.css";

import { titleCase } from "../../utils/format";

export const Badge = ({ children }) => (
	<span className={badgeStyles.badge}>
		{titleCase(children)}
	</span>
);
export default Badge;
