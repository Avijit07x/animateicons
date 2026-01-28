import { redirect } from "next/navigation";
import React from "react";
type Props = {};

const page: React.FC<Props> = () => {
	redirect("/icons/lucide");
};

export default page;
