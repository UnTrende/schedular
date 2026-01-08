# 🛠️ R2 Upload & 404 Error Troubleshooting

If you are seeing **404 Errors** ("Failed to load resource") for your images, it means the file is not accessible at the public URL.

## Cause 1: Public Access is NOT Enabled (Most Likely)
Even if you have the URL, R2 buckets are private by default.

**Fix:**
1.  Go to [Cloudflare R2 Dashboard](https://dash.cloudflare.com/?to=/:account/r2).
2.  Click on your bucket (`social-scheduler`).
3.  Click the **Settings** tab.
4.  Scroll to **Public access**.
5.  **Status** must say **"Allowed"** (Green).
6.  If it says "Blocked" or "Restricted", click **Allow Access**.

## Cause 2: CORS was missing during upload
If you tried to upload *before* applying the CORS fix I gave you earlier, the upload likely failed (Status 403), so the file was never written to the bucket.

**Fix:**
1.  Apply the CORS fix (see `R2_CORS_FIX.md` in your project).
2.  **Try uploading a NEW file.**
3.  Old files that failed to upload will never appear. You must upload them again.

## Cause 3: Wrong Public Domain
Check your `.env.local` file.
Ensure `R2_PUBLIC_DOMAIN` matches exactly what is shown in your R2 Bucket Settings under "Public Bucket URL".

## How to Verify
1.  Go to the **Objects** tab in your R2 Bucket.
2.  Navigate into `uploads/`.
3.  Do you see the files there?
    *   **No?** The upload failed (Check Cause 2).
    *   **Yes?** Click on a file, copy its URL, and try to open it in a new tab.
        *   If it opens: Your app configuration is wrong.
        *   If it says "404" or "Access Denied": Public Access is off (Check Cause 1).
