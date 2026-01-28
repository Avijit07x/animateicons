import React from "react";

type Props = {
	children: React.ReactNode;
};

const layout: React.FC<Props> = ({ children }) => {
	return <>{children}</>;
};

export default layout;
