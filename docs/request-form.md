# Request form setup

The "Request an icon" form in the gallery saves every request as a row in a Google Sheet. The site sends each request from the server to a small Apps Script that lives inside the sheet. No Google Cloud project or API keys are needed.

## 1. Create the sheet and the script

1. Open [sheets.new](https://sheets.new) and name the sheet, for example "AnimateIcons requests".
2. Open **Extensions > Apps Script**.
3. Delete the sample code, paste the contents of `scripts/apps-script/request-form.gs`, and save.

## 2. Add the secret

1. Make a secret in a terminal: `openssl rand -hex 32`.
2. In Apps Script, open **Project Settings** (the gear), scroll to **Script Properties**, and add a property named `SECRET` with that value.

The script refuses every request while `SECRET` is missing or shorter than 32 characters.

## 3. Deploy it as a web app

1. Click **Deploy > New deployment**, pick the type **Web app**.
2. Set **Execute as** to **Me** and **Who has access** to **Anyone**. The secret is what keeps others out.
3. Click **Deploy**, then **Authorize access**. Google warns that the app isn't verified because it's your own script: choose **Advanced**, then **Go to (project name)**, then **Allow**. It only asks for access to this spreadsheet.
4. Copy the **Web app URL**. It starts with `https://script.google.com/macros/s/` and ends with `/exec`.

## 4. Connect the site

Add both values to `.env.local` and to the Vercel project (Settings > Environment Variables), then redeploy:

```bash
REQUEST_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
REQUEST_WEBHOOK_SECRET=the-same-secret-as-the-script-property
```

Both are server-only. Never prefix them with `NEXT_PUBLIC_`.

The first request creates a **Requests** tab with a header row. To format an existing tab, pick `setupSheet` in the Apps Script function menu and click **Run**.

## Email for each request

1. In **Project Settings > Script Properties**, add `NOTIFY_EMAIL` with the address that should get the emails.
2. Pick `sendTestNotification` in the function menu and click **Run**. Google asks once for permission to send email as you. A test email arrives within a minute.
3. Deploy a new version (see below).

Every subject starts with `[AnimateIcons]`, so a Gmail filter on that tag can label them and keep them out of Spam. Each email names the request type and sender, lists every field, links to the sheet, and replies go straight to the sender. Google allows about 100 emails a day on a personal account. When that runs out, requests are still saved, just without an email. The sheet's own notification settings don't work here, because the script writes as you and Google doesn't notify you about your own changes.

## Changing the script later

Use **Deploy > Manage deployments**, edit the existing deployment and pick **New version**. This keeps the same URL. A new deployment gets a new URL.

## Rotating the secret

Make a new secret, update the `SECRET` script property and `REQUEST_WEBHOOK_SECRET` in Vercel, then redeploy the site. Requests sent with the old secret are refused straight away.

## What protects it

- The URL and secret never reach the browser. The form posts to a Next.js server action, which adds the secret.
- The server only forwards to `https://script.google.com`.
- Both the server and the script check every field, strip control and invisible characters, and cap lengths.
- The script compares the secret in constant time and stores values that start with `=`, `+`, `-` or `@` as plain text, so the sheet never runs them as formulas.
- Bots that fill the hidden field get a fake success and nothing is saved.
- Each visitor can send 5 requests every 10 minutes, and the sheet accepts at most 30 rows a minute overall.
