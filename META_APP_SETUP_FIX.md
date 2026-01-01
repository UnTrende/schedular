# Fix: "Can't load URL" / Domain Error in Facebook App

The error "The domain of this URL isn't included in the app's domains" means you need to add your Vercel URL to the main App Settings.

### Step-by-Step Fix

1.  Go to [Meta for Developers](https://developers.facebook.com/).
2.  Select your App (**Social Scheduler**).
3.  In the left sidebar, click **App Settings** -> **Basic**.
4.  **Field 1: App Domains**
    *   Find the field labeled **App Domains**.
    *   Enter your domain **without** `https://` or paths.
    *   Type: `schedular-ten.vercel.app`
    *   Press Enter.
5.  **Field 2: Privacy Policy URL** (Required to save)
    *   You can use your homepage for now: `https://schedular-ten.vercel.app/`
6.  **Field 3: Terms of Service URL** (Required to save)
    *   Use your homepage: `https://schedular-ten.vercel.app/`
7.  **Scroll to the bottom** and click **+ Add Platform**.
    *   Select **Website**.
    *   In the **Site URL** field, enter the full URL: `https://schedular-ten.vercel.app/`
    *   Click **Save Changes**.

### Verification
1.  Go back to **Facebook Login** -> **Settings** in the sidebar.
2.  Ensure **Valid OAuth Redirect URIs** still contains:
    *   `https://schedular-ten.vercel.app/api/oauth/callback`
3.  Save Changes again if needed.

Now try clicking "Connect" in your app again. It should work!
