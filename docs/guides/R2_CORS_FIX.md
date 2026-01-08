# R2 CORS Fix

To fix the "Preflight response" error, you must update the CORS policy on your Cloudflare R2 bucket.

## Method 1: Cloudflare Dashboard (Easiest)

1.  Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/).
2.  Go to **R2** on the left sidebar.
3.  Click on your bucket name (`social-scheduler`).
4.  Go to the **Settings** tab.
5.  Scroll down to **CORS Policy**.
6.  Click **Edit CORS Policy**.
7.  Copy and paste the exact JSON below:

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://schedular-ten.vercel.app"
    ],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

8.  Click **Save**.

## Method 2: Using AWS CLI (Advanced)

If you have `aws` cli configured with your R2 credentials:

```bash
aws s3api put-bucket-cors --bucket social-scheduler --cors-configuration file://cors.json --endpoint-url https://<your-account-id>.r2.cloudflarestorage.com
```

(The `cors.json` file is already created in your project folder).
