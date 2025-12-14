# LocalForge Website Deployment Guide

This guide will help you deploy the LocalForge website to Netlify or Vercel.

## Prerequisites

- GitHub account
- LocalForge repository pushed to GitHub
- Netlify or Vercel account (free tier works)

## 🚀 Deploy to Netlify

### Method 1: Netlify UI

1. **Login to Netlify**: Go to [netlify.com](https://netlify.com) and sign in

2. **New Site from Git**: Click "Add new site" → "Import an existing project"

3. **Connect to Git Provider**: Choose GitHub and authorize Netlify

4. **Select Repository**: Choose your LocalForge repository

5. **Configure Build Settings**:
   - **Base directory**: `website`
   - **Build command**: (leave empty)
   - **Publish directory**: `website` or `.` (relative to base directory)

6. **Deploy**: Click "Deploy site"

7. **Custom Domain** (optional):
   - Go to "Domain settings"
   - Add your custom domain (e.g., localforge.dev)
   - Configure DNS as instructed

### Method 2: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Navigate to website folder
cd website

# Deploy
netlify deploy

# Follow prompts, then deploy to production
netlify deploy --prod
```

### Method 3: Netlify Drop

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag and drop the `website` folder
3. Site is deployed instantly!

## 🔷 Deploy to Vercel

### Method 1: Vercel UI

1. **Login to Vercel**: Go to [vercel.com](https://vercel.com) and sign in

2. **New Project**: Click "Add New..." → "Project"

3. **Import Git Repository**: Choose your LocalForge repository

4. **Configure Project**:
   - **Framework Preset**: Other
   - **Root Directory**: `website`
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)

5. **Deploy**: Click "Deploy"

6. **Custom Domain** (optional):
   - Go to project settings → "Domains"
   - Add your custom domain

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to website folder
cd website

# Deploy
vercel

# Deploy to production
vercel --prod
```

## 📝 Post-Deployment Checklist

### 1. Update URLs

Replace placeholder URLs in the code:

- GitHub repository links
- Social media links
- Email addresses
- Domain URLs

Files to update:
- `index.html`
- `docs.html`
- `download.html`

### 2. Add Assets

Upload the following to `/website/assets/`:

**Required:**
- `logo.svg` - Main logo (transparent background)
- `logo-white.svg` - White version for dark backgrounds
- `favicon.png` - 32x32px or 16x16px
- `hero-screenshot.png` - Application screenshot

**For SEO:**
- `og-image.png` - 1200x630px (Open Graph)
- `twitter-image.png` - 1200x600px (Twitter Card)

**Technology Icons** (`/assets/tech/`):
- `php.svg`
- `laravel.svg`
- `vue.svg`
- `react.svg`
- `nodejs.svg`
- `wordpress.svg`

### 3. Update Download Links

In `download.html`, update these URLs:

```html
<!-- Update with actual GitHub release URLs -->
<a href="https://github.com/YOUR_USERNAME/localforge/releases/latest/download/localforge_1.0.0_amd64.deb">
<a href="https://github.com/YOUR_USERNAME/localforge/releases/latest/download/LocalForge-1.0.0.AppImage">
```

### 4. Configure DNS (Custom Domain)

If using a custom domain:

**For Netlify:**
```
A Record: @ → 75.2.60.5
CNAME: www → your-site.netlify.app
```

**For Vercel:**
```
A Record: @ → 76.76.21.21
CNAME: www → cname.vercel-dns.com
```

### 5. Enable HTTPS

Both Netlify and Vercel automatically provision SSL certificates. Just ensure:
- Force HTTPS redirect is enabled
- Certificate is valid (may take a few minutes)

### 6. Set Up Analytics (Optional)

**Google Analytics:**
Add tracking code to all HTML files in `<head>`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

**Plausible Analytics** (privacy-friendly):
```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

### 7. Test SEO

Use these tools to test your deployment:

- [Google Search Console](https://search.google.com/search-console)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)

### 8. Submit Sitemap

Create and submit a sitemap (optional but recommended):

**sitemap.xml:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://localforge.dev/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://localforge.dev/docs.html</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://localforge.dev/download.html</loc>
    <priority>0.8</priority>
  </url>
</urlset>
```

Submit to:
- Google Search Console
- Bing Webmaster Tools

## 🔧 Troubleshooting

### Images not loading

- Check file paths are correct (case-sensitive)
- Ensure images are uploaded to correct folders
- Check network tab in browser DevTools

### CSS not applying

- Clear browser cache
- Check Tailwind CDN is loading
- Verify custom CSS file path

### 404 errors

- Check `netlify.toml` or `vercel.json` redirects
- Ensure file names match exactly (case-sensitive)

### Mobile menu not working

- Check JavaScript file is loaded
- Check browser console for errors
- Verify mobile-menu-button ID matches

## 📊 Performance Optimization

1. **Optimize Images**:
   - Use WebP format where possible
   - Compress images (TinyPNG, Squoosh)
   - Add lazy loading attributes

2. **Minify Assets** (optional):
   ```bash
   # Install minification tools
   npm install -g html-minifier clean-css-cli uglify-js
   
   # Minify
   html-minifier --input-dir . --output-dir dist --file-ext html
   ```

3. **Use CDN**:
   - Both Netlify and Vercel include global CDN
   - No additional configuration needed

4. **Enable Compression**:
   - Gzip/Brotli enabled by default on both platforms

## 🎯 Next Steps

1. Monitor site performance
2. Set up uptime monitoring (UptimeRobot, Pingdom)
3. Configure error tracking (Sentry, LogRocket)
4. Set up backup strategy
5. Plan content updates

## 🆘 Support

- Netlify Docs: https://docs.netlify.com/
- Vercel Docs: https://vercel.com/docs
- Issues: https://github.com/YOUR_USERNAME/localforge/issues

---

**Deployed successfully?** ✨ Share your site and get feedback from the community!
