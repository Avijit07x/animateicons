/** External links used across the docs shell (rail, footer, pager). */
export const REPO_URL = "https://github.com/Avijit07x/animateicons";
export const TWITTER_URL = "https://twitter.com/avijit07x";
export const LINKEDIN_URL = "https://www.linkedin.com/in/Avijit07x";
export const ISSUES_URL = `${REPO_URL}/issues`;
export const NEW_ISSUE_URL = `${REPO_URL}/issues/new`;

/** GitHub "edit this page" URL for the .mdx backing a docs pathname. */
export const editUrl = (pathname: string) =>
	`${REPO_URL}/edit/main/app${pathname}/page.mdx`;
