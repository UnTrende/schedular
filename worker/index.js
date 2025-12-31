const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'social-scheduler-worker',
    version: '1.0.0',
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Publish post endpoint
app.post('/publish', async (req, res) => {
  try {
    const { platform, content, mediaUrls, accessToken, username } = req.body;

    console.log(`Publishing to ${platform} for @${username}...`);

    // Validate request
    if (!platform || !content || !accessToken) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: platform, content, accessToken',
      });
    }

    // Route to appropriate platform publisher
    let result;
    switch (platform) {
      case 'twitter':
        result = await publishToTwitter(content, mediaUrls, accessToken);
        break;
      case 'facebook':
        result = await publishToFacebook(content, mediaUrls, accessToken);
        break;
      case 'instagram':
        result = await publishToInstagram(content, mediaUrls, accessToken);
        break;
      case 'linkedin':
        result = await publishToLinkedIn(content, mediaUrls, accessToken);
        break;
      default:
        return res.status(400).json({
          success: false,
          error: `Unsupported platform: ${platform}`,
        });
    }

    if (result.success) {
      console.log(`✅ Successfully published to ${platform}`);
      res.json({
        success: true,
        platform,
        postId: result.postId,
        url: result.url,
      });
    } else {
      console.error(`❌ Failed to publish to ${platform}:`, result.error);
      res.status(500).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error('Publish error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
});

// ============================================================================
// TWITTER / X PUBLISHING
// ============================================================================
async function publishToTwitter(content, mediaUrls, accessToken) {
  try {
    // Twitter API v2 endpoint
    const url = 'https://api.twitter.com/2/tweets';
    
    const payload = {
      text: content,
    };

    // TODO: Add media upload support
    // For images/videos, you need to:
    // 1. Upload media to Twitter first (media/upload endpoint)
    // 2. Get media IDs
    // 3. Attach to tweet

    const response = await axios.post(url, payload, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return {
      success: true,
      postId: response.data.data.id,
      url: `https://twitter.com/i/web/status/${response.data.data.id}`,
    };
  } catch (error) {
    console.error('Twitter publish error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.detail || error.message,
    };
  }
}

// ============================================================================
// FACEBOOK PUBLISHING
// ============================================================================
async function publishToFacebook(content, mediaUrls, accessToken) {
  try {
    // Facebook Graph API - Post to page
    // You'll need to get the page ID and page access token
    const pageId = process.env.FACEBOOK_PAGE_ID || 'me';
    const url = `https://graph.facebook.com/v18.0/${pageId}/feed`;
    
    const payload = {
      message: content,
      access_token: accessToken,
    };

    // Add photo if provided
    if (mediaUrls && mediaUrls.length > 0) {
      payload.link = mediaUrls[0]; // For single image
      // For multiple images, use different endpoint
    }

    const response = await axios.post(url, payload);

    return {
      success: true,
      postId: response.data.id,
      url: `https://facebook.com/${response.data.id}`,
    };
  } catch (error) {
    console.error('Facebook publish error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message,
    };
  }
}

// ============================================================================
// INSTAGRAM PUBLISHING
// ============================================================================
async function publishToInstagram(content, mediaUrls, accessToken) {
  try {
    // Instagram requires media (images/videos)
    if (!mediaUrls || mediaUrls.length === 0) {
      throw new Error('Instagram requires at least one image or video');
    }

    // Instagram Graph API
    // Step 1: Create container
    const instagramAccountId = process.env.INSTAGRAM_ACCOUNT_ID;
    const containerUrl = `https://graph.facebook.com/v18.0/${instagramAccountId}/media`;
    
    const containerPayload = {
      image_url: mediaUrls[0],
      caption: content,
      access_token: accessToken,
    };

    const containerResponse = await axios.post(containerUrl, containerPayload);
    const creationId = containerResponse.data.id;

    // Step 2: Publish container
    const publishUrl = `https://graph.facebook.com/v18.0/${instagramAccountId}/media_publish`;
    const publishPayload = {
      creation_id: creationId,
      access_token: accessToken,
    };

    const publishResponse = await axios.post(publishUrl, publishPayload);

    return {
      success: true,
      postId: publishResponse.data.id,
      url: `https://instagram.com/p/${publishResponse.data.id}`,
    };
  } catch (error) {
    console.error('Instagram publish error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message,
    };
  }
}

// ============================================================================
// LINKEDIN PUBLISHING
// ============================================================================
async function publishToLinkedIn(content, mediaUrls, accessToken) {
  try {
    // LinkedIn API v2
    const url = 'https://api.linkedin.com/v2/ugcPosts';
    
    const payload = {
      author: `urn:li:person:${process.env.LINKEDIN_PERSON_ID}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content,
          },
          shareMediaCategory: 'NONE',
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    };

    // TODO: Add media support
    // LinkedIn media upload is more complex

    const response = await axios.post(url, payload, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    return {
      success: true,
      postId: response.data.id,
      url: 'https://linkedin.com/feed/', // LinkedIn doesn't return direct URL
    };
  } catch (error) {
    console.error('LinkedIn publish error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Social Scheduler Worker running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   Publish: POST http://localhost:${PORT}/publish`);
});
