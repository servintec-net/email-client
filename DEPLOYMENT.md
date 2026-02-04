# Deployment Guide for servintec.net

## Common Issues and Solutions

### ERR_TIMED_OUT Error

If you're getting "ERR_TIMED_OUT" or "took too long to respond", check:

1. **Files Uploaded Correctly?**
   - Verify all files from `dist/` folder are in `public_html/`
   - Check that `index.html` exists in `public_html/`
   - Verify `.htaccess` is in `public_html/` (not in a subfolder)

2. **File Permissions**
   - In cPanel File Manager, set permissions:
     - Folders: 755
     - Files: 644
     - `.htaccess`: 644

3. **Domain Configuration**
   - In cPanel, go to "Addon Domains" or "Subdomains"
   - Verify `servintec.net` is properly configured
   - Check if domain is pointing to `public_html/` or a subdirectory

4. **Apache/Server Status**
   - Check if Apache is running in cPanel
   - Look for any error logs in cPanel → Error Logs

5. **.htaccess Issues**
   - Try temporarily renaming `.htaccess` to `.htaccess.bak`
   - If site loads, the `.htaccess` has an issue
   - Check cPanel error logs for Apache errors

## Step-by-Step Deployment

1. **Build the project:**
   ```bash
   cd email-client
   npm run build
   ```

2. **Upload to cPanel:**
   - Open cPanel File Manager
   - Navigate to `public_html/`
   - Upload ALL contents of `dist/` folder
   - Upload `.htaccess` file to `public_html/`

3. **Verify file structure:**
   ```
   public_html/
   ├── .htaccess
   ├── index.html
   ├── assets/
   │   ├── index-*.js
   │   └── index-*.css
   ├── favicon.ico
   └── ... (other files)
   ```

4. **Check file permissions:**
   - Right-click each file/folder → Change Permissions
   - Files: 644
   - Folders: 755

5. **Test:**
   - Visit https://servintec.net
   - Check browser console (F12) for errors
   - Check cPanel Error Logs if issues persist

## Alternative: Simplified .htaccess

If the current `.htaccess` causes issues, try this minimal version:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [L]
</IfModule>
```

## Contact Hosting Support

If the site still doesn't load:
- Contact your hosting provider
- Ask them to check:
  - Apache is running
  - Domain DNS is properly configured
  - No firewall blocking port 80/443
  - Server error logs
