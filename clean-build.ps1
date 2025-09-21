# Clean build directory
if (Test-Path "build") {
    Remove-Item -Recurse -Force "build"
    Write-Host "Build directory removed"
}

# Clean .react-router directory
if (Test-Path ".react-router") {
    Remove-Item -Recurse -Force ".react-router"
    Write-Host ".react-router directory removed"
}

# Initialize Git repository
if (-not (Test-Path ".git")) {
    git init
    Write-Host "Git repository initialized"
} else {
    Write-Host "Git repository already exists"
}

# Add all files to staging
git add .

# Check if there are files to commit
$stagedFiles = git diff --cached --name-only
if ($stagedFiles) {
    # Create initial commit
    git commit -m "Initial commit: Fix Node.js version and top-level await issues

- Add Node.js engine requirement (>=20.0.0) to package.json
- Update Netlify configuration to use Node 20
- Add Vite build target 'esnext' for modern JavaScript features
- Create .nvmrc file for Node version consistency
- Update .gitignore to exclude build artifacts and dependencies"
    
    Write-Host "Initial commit created successfully"
} else {
    Write-Host "No files to commit"
}

Write-Host "Git setup complete!"
