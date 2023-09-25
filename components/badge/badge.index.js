import badgeStyles from "./badge.module.css";

import { titleCase } from "../../utils/format";

export const Badge = ({ children, style, className }) => (
	<span style={style} className={`${badgeStyles.badge} ${className ?? ''}`}>
		{titleCase(children)}
	</span>
);
export default Badge;
