# Setting up project Fiscord

---

## Overview

This is a step-by-step guide on how to set up the Project.

---

## Pre-requisites

Before setting up the project, make sure that you have the following components installed on you machine:

- git (version 2.33.0 or higher)
- npm (version 10.8.2 or higher)
- node.js (version 18.17.0 or higher)
- firebase (version 13.13.2 or higher)

---

## Step 1: Generate the project files

To create the project, follow the steps below:

1. Open IntelliJ WebStorm
2. Navigate to "New Project"
3. Select the "Next.js" template.
   1. Ensure that the "Node interpreter" meets the pre-requisite (version 18.17.0 or higher)
   2. Check the box that says "Create TypeScript project".
4. Initalize the project following the command prompt.
   1. Select "Yes" when the prompt asks about __ESLint__.
   2. Select "Yes" when the prompte asked you to use __tailwindcss__.

Now you should have all the starter files necessary for the project.

---

## Step 2: Set up firebase

To set up firebase, follow the steps below:

1. Sign in to the [Firebase website](https://firebase.google.com).
2. Go to [Firebase console](https://console.firebase.google.com).
3. Create New project.
   1. Do NOT select Google Analytics during step 2 of the website prompt.
4. Set up Authentication
   1. Use "Google" for the sign-in option.
   2. Activate the "Enable" bar.
   3. Enter a supporting email address for the project in the "project-level setting" and click "save".
5. Navigate to "Project Overview" and set up Cloud firestore.
   1. Select "Start in test mode" during step 2 of the website prompt.
6. Navigate to "Project Overview" and set up Storage.
   1. Select "Start in test mode" during step 1 of the website prompt.
---

## Step 3: Set up firebase CLI in WebStorm

To configure firebase in the project, follow the steps below:

1. Open your WebStorm project created in Step 1.
2. Open a terminal.
3. Type `npm install -g firebase-tools` in the command prompt
   - Option
4. Type `firebase login` in the command prompt and link to your account on the firebase website.
5. Type `firebase init` in the command prompt and follow the instruction
   1. Select the following features to set up in your directory:
      - Firestore: Configure security rules and indexes files for Firestore
      - Hosting: Configure files for Firebase Hosting and (optionally) set up GitHub Action deploys
      - Storage: Configure a security rules file for Cloud Storage
   2. Continue the initialization with the default settings.
      - **IMPORTANT: If the prompt asks "What do you want to use as your public directory?" Type "out" in the command prompt.**
      - NOTE: When the console prompts you "Set up automatic builds and deploys with GitHub?" select "No".
      But if you wish to set up GitHub Action within your project, select "Yes".
6.

---

## Step 4: Initialize configuration files

Before deploying the project, we must add in some configuration files. Else the project will not run.

To do so, follow the steps below:

1. Open `next.config.mjs` on your file and replace everything in it with the following:
```javascript
  /** @type {import('next').NextConfig} */
  const nextConfig = {output: 'export',};

  export default nextConfig;
  ```
2. Create a file named called `.env.local`.
3. Navigate to `config.js` file in the firebase folder. The path is `./src/app/firebase`.
4. Transfer all the data in the `firebaseConfig` block to the `.env.local` file and replace them with the format of `process.env.{keyName}`.
   - NOTE: Make sure that each variable has `NEXT_PUBLIC` in front of them, or else Next.js won't be able to read it.


---

## Step 5: Deployment

To deploy your project, follow the steps below:

1. Open a terminal.
2. Type in the command `npm run build` and execute it.
   - NOTE: Once this finishes, you should be able to see an "out" folder with content generated in the project.
3. Type in the command `firebase deploy --only hosting` and execute it.
   - NOTE: If you are deploying the site for the first time, it will take a while for the project to set up.
   After that, re-deployment will be much faster.

---

## Step 6: Link project to GitHub Repository through WebStorm

It is usually ideal to link your project to github for version control.
There are two ways to do so:

### Option 1: Using WebStorm
1. Open your WebStorm project.
2. Go to "Git".
3. Select "GitHub" and "Share project on GitHub".
4. Give your project a name and a description, it will automatically create a GitHub Repository for you.

## Option 2: Using Terminal
1. Create a GitHub repository.
2. Open your WebStorm project as well as a terminal.
3. Type in the command `git remote add origin [your repo link]` and execute it.
4. Type in the command `git push --set-upstream origin main` and execute it.

NOTE: in both cases, you can use the MIT License for Licensing.




