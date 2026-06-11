# LocalForge Website

Official website for LocalForge - a powerful desktop application for managing local development environments.

## 📁 Structure

```
website/
├── index.html          # Home page
├── docs.html           # Documentation page
├── download.html       # Download page
├── css/
│   └── style.css      # Custom styles
├── js/
│   └── main.js        # JavaScript functionality
├── images/            # Image assets
└── assets/            # Icons, logos, and other assets
```

## 🚀 Features

- **SEO Optimized**: All pages include proper meta tags, Open Graph, and Twitter Card support
- **Responsive Design**: Mobile-first design using Tailwind CSS
- **Fast Loading**: Optimized assets and lazy loading
- **Accessibility**: WCAG 2.1 compliant
- **Dark Mode**: Respects system preferences

## 🛠️ Technologies

- **HTML5**: Semantic markup
- **Tailwind CSS**: Utility-first CSS framework (via CDN)
- **Vanilla JavaScript**: No framework dependencies
- **Prism.js**: Syntax highlighting for code blocks (docs page)

## 📦 Deployment

### Netlify

1. Connect your repository to Netlify
2. Set build settings:
   - **Build command**: (leave empty)
   - **Publish directory**: `website`
3. Deploy!

Or use the Netlify CLI:

```bash
cd website
netlify deploy --prod
```

### Vercel

1. Import project to Vercel
2. Set root directory to `website`
3. Deploy!

Or use Vercel CLI:

```bash
cd website
vercel --prod
```

### Custom Deployment

Simply upload the contents of the `website` folder to any static hosting service.

## 🎨 Customization

### Update Logo

Replace the following files:
- `/assets/logo.svg` - Main logo
- `/assets/logo-white.svg` - White version for dark backgrounds
- `/assets/favicon.png` - Browser favicon

### Update Screenshots

- `/assets/hero-screenshot.png` - Main hero image
- `/assets/og-image.png` - Open Graph image (1200x630px)
- `/assets/twitter-image.png` - Twitter Card image (1200x600px)

### Update Technology Icons

Add technology icons to `/assets/tech/`:
- `php.svg`
- `laravel.svg`
- `vue.svg`
- `react.svg`
- `nodejs.svg`
- `wordpress.svg`

### Update Links

Search and replace the following placeholder URLs:
- `https://github.com/HELMAB/localforge` → Your GitHub repo
- `https://localforge.netlify.app` → Your actual domain
- Social media links in footer

### Colors

The website uses Tailwind CSS. Main colors:
- Primary: Blue (`blue-600`: #2563eb)
- Secondary: Purple (`purple-600`: #9333ea)
- Success: Green (`green-600`: #16a34a)

To customize, modify the Tailwind classes or add custom CSS in `/css/style.css`.

## 📝 Content Updates

### Home Page (`index.html`)

- Hero section text
- Features list
- Supported technologies
- Call-to-action

### Documentation (`docs.html`)

- Installation instructions
- Getting started guide
- Feature documentation
- Troubleshooting
- FAQ

### Download Page (`download.html`)

- Download links (update GitHub release URLs)
- System requirements
- Installation instructions
- Release notes

## 🔍 SEO Checklist

- [x] Title tags (unique per page)
- [x] Meta descriptions
- [x] Open Graph tags
- [x] Twitter Card tags
- [x] Semantic HTML5
- [x] Image alt attributes
- [x] Internal linking
- [x] Mobile responsive
- [x] Fast loading
- [x] HTTPS ready

## 📊 Analytics

To add analytics, insert your tracking code in the `<head>` section of each HTML file:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🔒 Security Headers

Add these headers in your hosting configuration:

```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

## 📱 Progressive Web App (Optional)

To make it a PWA:

1. Create `manifest.json`
2. Add service worker (`sw.js`)
3. Add app icons
4. Update HTML to reference manifest

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This website is part of the LocalForge project. Check the main project license.

## 🆘 Support

- Documentation: https://localforge.netlify.app/docs.html
- Issues: https://github.com/HELMAB/localforge/issues
- Email: mabhelitc@gmail.com
