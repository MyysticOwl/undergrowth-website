# Undergrowth Installer (PowerShell)
# Usage: iwr -useb https://.../install.ps1 | iex

$ErrorActionPreference = 'Stop'

# Configuration
$Repo = "MyysticOwl/undergrowth"
$InstallDir = "$HOME\.undergrowth"
$BinDir = "$InstallDir\bin"
$DataDir = "$InstallDir\data"
$LogDir = "$InstallDir\logs"

Write-Host "  _   _           _                                |_| |__  " -ForegroundColor Green
Write-Host " | | | |_ __   __| | ___ _ __ __ _ _ __ _____      _| | |_| " -ForegroundColor Green
Write-Host " | | | | '_ \ / _\` |/ _ \ '__/ _\` | '__/ _ \ \ /\ / / __| '_ \ " -ForegroundColor Green
Write-Host " | |_| | | | | (_| |  __/ | | (_| | | | (_) \ V  V /| |_| | | |" -ForegroundColor Green
Write-Host "  \___/|_| |_|\__,_|\___|_|  \__, |_|  \___/ \_/\_/  \__|_| |_|" -ForegroundColor Green
Write-Host "                             |___/                             " -ForegroundColor Green

Write-Host "`n🌱 Installing Undergrowth..." -ForegroundColor Cyan

# 1. Detect Architecture (Simplified for Windows)
# Windows on Arm exists, but we'll default to x64 for now unless explicitly checked
$Target = "x86_64-pc-windows-gnu"
Write-Host "  • Target Platform: $Target"

# 2. Prepare Directories
Write-Host "  • Creating directories in $InstallDir..."
New-Item -ItemType Directory -Force -Path $BinDir | Out-Null
New-Item -ItemType Directory -Force -Path $DataDir | Out-Null
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

# 3. Download Binary
$Url = "https://github.com/$Repo/releases/latest/download/undergrowth-$Target.zip"
$ZipFile = "$BinDir\undergrowth.zip"
$TempDir = "$InstallDir\tmp"

Write-Host "  • Downloading from $Url..."
try {
    # Clean temp dir if exists
    if (Test-Path $TempDir) { Remove-Item -Path $TempDir -Recurse -Force }
    New-Item -ItemType Directory -Force -Path $TempDir | Out-Null

    Invoke-WebRequest -Uri $Url -OutFile $ZipFile
    Expand-Archive -Path $ZipFile -DestinationPath $TempDir -Force
    Remove-Item -Path $ZipFile -Force

    # Find the single root directory inside zip
    $SubDirs = Get-ChildItem -Path $TempDir -Directory
    if ($SubDirs.Count -eq 1) {
        $Root = $SubDirs[0].FullName
        Write-Host "  • Installing to $BinDir..."
        Get-ChildItem -Path $Root | Move-Item -Destination $BinDir -Force
    } else {
        # Fallback if flat zip (unlikely with cargo-dist but possible)
        Write-Host "  • Installing flat zip to $BinDir..."
        Get-ChildItem -Path $TempDir | Move-Item -Destination $BinDir -Force
    }
    
    Remove-Item -Path $TempDir -Recurse -Force
} catch {
    Write-Error "Failed to download or extract binary: $_"
    exit 1
}

# 4. Path Check
$UserPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($UserPath -notlike "*$BinDir*") {
    Write-Host "  ℹ️  Adding $BinDir to User Path..." -ForegroundColor Cyan
    # [Environment]::SetEnvironmentVariable("Path", "$UserPath;$BinDir", "User")
    # Commented out auto-edit for safety until fully tested
    Write-Host "      Run this to add to path:"
    Write-Host "      [Environment]::SetEnvironmentVariable('Path', [Environment]::GetEnvironmentVariable('Path', 'User') + ';$BinDir', 'User')"
}

Write-Host "`n✅ Installation Complete!" -ForegroundColor Green
Write-Host "   Run 'undergrowth' to get started."
