import Link from "next/link";
import React from "react";

const LINK_CLASS = "text-primary underline underline-offset-4";

export const PRIVACY_UPDATED = "October 24, 2026";

export const PRIVACY_SUMMARY =
	"No accounts, no ads and no tracking cookies. The site counts visits without knowing who you are. The only personal details I get are what you type into the request form.";

export const PRIVACY_SECTIONS: { title: string; body: React.ReactNode }[] = [
	{
		title: "Who runs this site",
		body: (
			<p>
				AnimateIcons is a free, open-source project run by Avijit Dey. I am
				responsible for the data described on this page.
			</p>
		),
	},
	{
		title: "Visit statistics",
		body: (
			<p>
				The site uses Vercel Web Analytics to count page views, where visitors
				come from, their country, device and browser. It sets no cookies, does
				not follow you to other sites and cannot tell who you are. Visitors are
				only told apart within a single day. I use this to see which pages
				people find useful.
			</p>
		),
	},
	{
		title: "The request form",
		body: (
			<>
				<p>
					When you send a request, I get your name, your email, your message,
					the icon and library you asked for, and the page you sent it from. I
					use it only to read your request and reply to you, because you asked
					me to.
				</p>
				<p>
					It is saved to a Google Sheet and emailed to me, both through my
					Google account. I don&apos;t sell it, share it or add you to a mailing
					list. I keep requests for up to 12 months, then delete them. Ask any
					time and I&apos;ll delete yours sooner.
				</p>
				<p>
					To stop spam, the server checks your IP address so the form can&apos;t
					be sent too many times in a few minutes. It is held in memory only and
					never saved.
				</p>
			</>
		),
	},
	{
		title: "Hosting",
		body: (
			<p>
				The site runs on Vercel. Like any web host, Vercel sees your IP address
				and browser details when a page loads, so it can deliver the page and
				block attacks, and keeps short logs for that. Vercel and Google may
				handle data in the United States and other countries, under their own
				safeguards.
			</p>
		),
	},
	{
		title: "Settings saved in your browser",
		body: (
			<p>
				The site remembers a few choices on your device, like your package
				manager, your framework, whether the docs sidebar is open and whether
				you closed a notice. They are only used to show the site the way you
				left it. Clearing your browser data removes them.
			</p>
		),
	},
	{
		title: "Supporters",
		body: (
			<p>
				Tips and sponsorships go through GitHub Sponsors, Buy Me a Coffee,
				PayPal or your own UPI app, under their own privacy policies. I never
				see your card or bank details. The{" "}
				<Link href="/sponsors" className={LINK_CLASS}>
					Supporters
				</Link>{" "}
				page shows the names, pictures and notes of people who made their
				support public there. Anonymous supporters are not shown. Ask and
				I&apos;ll take you off.
			</p>
		),
	},
	{
		title: "Packages and tools",
		body: (
			<p>
				The npm packages collect nothing. The CLI and the MCP server only
				download icons from this site and send nothing about you or your
				project.
			</p>
		),
	},
	{
		title: "Links to other sites",
		body: (
			<p>
				Links to GitHub, npm, X, AI chat tools and other sites take you to
				places with their own privacy policies. The Open in AI buttons only pass
				along the public docs page you chose.
			</p>
		),
	},
	{
		title: "Your rights",
		body: (
			<p>
				You can ask what I have about you, ask me to correct it or ask me to
				delete it. If you live in the EU, the UK or another place with privacy
				laws, you can also complain to your local data protection authority.
			</p>
		),
	},
	{
		title: "Children",
		body: (
			<p>
				The site is made for developers and is not aimed at children. I
				don&apos;t knowingly collect data from them.
			</p>
		),
	},
	{
		title: "Contact",
		body: (
			<p>
				For anything about your data, open{" "}
				<Link href="/icons/lucide" className={LINK_CLASS}>
					the icons page
				</Link>
				, choose Request an icon in the sidebar and pick Something else, or
				message{" "}
				<Link
					href="https://x.com/avijit07x"
					target="_blank"
					rel="noopener noreferrer"
					className={LINK_CLASS}
				>
					@avijit07x
				</Link>{" "}
				on X. If this page changes, the date at the top changes too.
			</p>
		),
	},
];
