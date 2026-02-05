# Thumbnail Generator Script for Windows (PowerShell)
# Creates smaller versions of images for faster gallery loading
# Thumbnails are saved in a 'thumbs' subfolder

# Configuration
$THUMB_QUALITY = 60
$THUMB_MAX_WIDTH = 600
$THUMB_MAX_HEIGHT = 600

Write-Host "=== Thumbnail Generator ===" -ForegroundColor Green
Write-Host "Quality: $THUMB_QUALITY%"
Write-Host "Max dimensions: ${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}"
Write-Host ""

# Check if ImageMagick is installed
$magickPath = Get-Command magick -ErrorAction SilentlyContinue
if (-not $magickPath) {
    Write-Host "ERROR: ImageMagick not found. Please install it first:" -ForegroundColor Red
    Write-Host "  winget install ImageMagick.ImageMagick" -ForegroundColor Yellow
    Write-Host "  Or download from: https://imagemagick.org/script/download.php#windows" -ForegroundColor Yellow
    exit 1
}

function Process-ImageFolder {
    param (
        [string]$FolderPath
    )
    
    if (-not (Test-Path $FolderPath)) {
        Write-Host "Folder not found: $FolderPath" -ForegroundColor Yellow
        return
    }
    
    Write-Host "Processing: $FolderPath" -ForegroundColor Yellow
    
    # Create thumbs directory
    $thumbsDir = Join-Path $FolderPath "thumbs"
    if (-not (Test-Path $thumbsDir)) {
        New-Item -ItemType Directory -Path $thumbsDir -Force | Out-Null
    }
    
    # Get all image files
    $images = Get-ChildItem -Path $FolderPath -Include "*.jpg", "*.jpeg", "*.png", "*.JPG", "*.JPEG", "*.PNG" -File
    
    $count = 0
    foreach ($img in $images) {
        $thumbPath = Join-Path $thumbsDir $img.Name
        
        # Check if thumbnail needs to be created/updated
        if ((-not (Test-Path $thumbPath)) -or ($img.LastWriteTime -gt (Get-Item $thumbPath -ErrorAction SilentlyContinue).LastWriteTime)) {
            Write-Host "  Creating thumbnail: $($img.Name)"
            
            # Use ImageMagick to create thumbnail
            & magick $img.FullName -resize "${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>" -quality $THUMB_QUALITY $thumbPath
            $count++
        }
    }
    
    Write-Host "  Created $count thumbnails" -ForegroundColor Cyan
}

# Process folders
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir

Process-ImageFolder (Join-Path $projectRoot "assets\img\photography")
Process-ImageFolder (Join-Path $projectRoot "assets\img\creative\art")

Write-Host ""
Write-Host "Done! Thumbnails created in 'thumbs' subfolders." -ForegroundColor Green
Write-Host "Gallery will now load thumbnails for preview and use full resolution for viewing/download."
