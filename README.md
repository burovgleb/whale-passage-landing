# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Forms Integration (Google Sheets + Telegram)

This project sends all form submissions to a Google Apps Script webhook:
- `contact`
- `memento_mori`
- `interview_guest`

Webhook behavior:
1. validates payload,
2. appends row to Google Sheets,
3. sends Telegram notification to one group/channel,
4. applies honeypot + rate limit.

### 1) Configure frontend env

1. Copy `.env.example` to `.env`.
2. Set:

```bash
VITE_FORMS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

### 2) Create Google Apps Script webhook

1. Open [Google Apps Script](https://script.google.com/), create a project.
2. Copy code from `docs/google-apps-script/Code.gs`.
3. In **Project Settings > Script properties**, add:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
   - `SHEET_ID`
   - `RATE_LIMIT_WINDOW_SEC` (optional, default `60`)
   - `RATE_LIMIT_MAX_PER_IP` (optional, default `3`)
4. Deploy as **Web App**:
   - Execute as: `Me`
   - Who has access: `Anyone`
5. Copy the `/exec` URL into `VITE_FORMS_WEBHOOK_URL`.

### 3) Prepare Google Sheets

Use one spreadsheet (`SHEET_ID`). The script will auto-create tabs and headers:
- `contact`
- `memento_mori`
- `interview_guest`
- `logs`

### 4) Verify

1. Run frontend (`npm run dev`).
2. Submit each form once.
3. Confirm:
   - new rows in corresponding sheet tabs,
   - Telegram notification arrives,
   - hidden honeypot field blocks bot-like submissions.
