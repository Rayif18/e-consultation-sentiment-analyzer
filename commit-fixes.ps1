# Add all changes to staging
git add .

# Commit the fixes
git commit -m "Fix Netlify build issues: Node version and CommonJS imports

- Update Netlify configuration to use Node version 20 (was 18)
- Add NPM version 10 for compatibility
- Fix react-idle-timer CommonJS import issue
- Replace named export with default import + destructuring"

# Push to GitHub
git push origin main

Write-Host "Fixes committed and pushed to GitHub!"
Write-Host "Ready for Netlify redeployment!"
