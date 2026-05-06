"use client";

/**
 * SupporterAvatarImage
 *
 * Tiny client island for the avatar `<img>` so we can swap to the
 * initial fallback when GitHub returns 404 / 403 (deleted, suspended,
 * or rate-limited user). Parent always renders the initial circle
 * underneath; this image overlays on top, then hides itself on error.
 */

import Image from "next/image";
import { useState } from "react";

type Props = {
	src: string;
	alt: string;
};

const SupporterAvatarImage: React.FC<Props> = ({ src, alt }) => {
	const [errored, setErrored] = useState(false);

	if (errored) return null;

	return (
		<Image
			src={src}
			alt={alt}
			fill
			sizes="36px"
			className="border-border/60 rounded-full border object-cover"
			onError={() => setErrored(true)}
		/>
	);
};

export default SupporterAvatarImage;
