# PowerShell Script to Upload Project to GitHub using REST API
# (No Git installation required!)

$ErrorActionPreference = "Stop"

# 1. Gather configuration details
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  GitHub REST API Upload Helper" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$username = "Abhishek299Singh"
Write-Host "Configured Username: $username" -ForegroundColor Yellow
$repoName = Read-Host "Enter target Repository Name (e.g., quantum-calc)"
$token = Read-Host "Enter GitHub Personal Access Token (PAT) (masked)" -AsSecureString

# Convert SecureString token to plain text
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($token)
$plainToken = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Set headers for API calls
$headers = @{
    "Authorization" = "token $plainToken"
    "Accept"        = "application/vnd.github.v3+json"
    "User-Agent"    = "PowerShell-Upload-Script"
}

# 2. Check if repository already exists or needs to be created
$repoUrl = "https://api.github.com/repos/$username/$repoName"
$createRepo = $false

try {
    Write-Host "Checking if repository '$repoName' exists..." -ForegroundColor Gray
    $repoCheck = Invoke-RestMethod -Uri $repoUrl -Headers $headers -Method Get
    Write-Host "Repository exists! Proceeding to upload files..." -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 404) {
        $createRepo = $true
    } else {
        Write-Error "Error checking repository: $_"
    }
}

if ($createRepo) {
    try {
        Write-Host "Repository not found. Creating a new public repository '$repoName'..." -ForegroundColor Yellow
        $body = @{
            name = $repoName
            description = "Quantum Calc - Modern Responsive Glassmorphic Calculator"
            private = $false
        } | ConvertTo-Json
        
        $newRepo = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Headers $headers -Method Post -Body $body -ContentType "application/json"
        Write-Host "Repository successfully created: $($newRepo.html_url)" -ForegroundColor Green
    } catch {
        Write-Error "Failed to create repository: $_"
    }
}

# 3. List files to upload (excluding the upload script itself)
$files = Get-ChildItem -Path . -File -Recurse | Where-Object { 
    $_.Name -ne "upload_to_github.ps1" 
}

# 4. Upload files one-by-one
foreach ($file in $files) {
    # Resolve relative path for github url
    $relativePath = Resolve-Path $file.FullName -Relative
    $relativePath = $relativePath.Replace(".\", "").Replace("\", "/")
    
    Write-Host "Uploading $relativePath..." -ForegroundColor Gray
    
    # Read file content and encode as Base64
    $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
    $base64Content = [Convert]::ToBase64String($bytes)
    
    # Create request body
    $body = @{
        message = "Upload $relativePath via PowerShell helper"
        content = $base64Content
    }
    
    # Check if file already exists in repo (requires sha for updating)
    $fileUrl = "https://api.github.com/repos/$username/$repoName/contents/$relativePath"
    try {
        $existingFile = Invoke-RestMethod -Uri $fileUrl -Headers $headers -Method Get
        $body.sha = $existingFile.sha
    } catch {
        # File doesn't exist yet, we can create it directly
    }
    
    $jsonBody = $body | ConvertTo-Json
    
    try {
        $uploadResult = Invoke-RestMethod -Uri $fileUrl -Headers $headers -Method Put -Body $jsonBody -ContentType "application/json"
        Write-Host "✓ Successfully uploaded $relativePath" -ForegroundColor Green
    } catch {
        Write-Host "✗ Failed to upload $relativePath. Error: $_" -ForegroundColor Red
    }
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Upload complete! Check your repository at:" -ForegroundColor Green
Write-Host "https://github.com/ $username/$repoName" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan
