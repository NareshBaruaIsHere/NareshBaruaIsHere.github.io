#!/bin/bash
# Thumbnail Generator Script
# Creates smaller versions of images for faster gallery loading
# Thumbnails are saved in a 'thumbs' subfolder

# Configuration
THUMB_QUALITY=60
THUMB_MAX_WIDTH=600
THUMB_MAX_HEIGHT=600

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Thumbnail Generator ===${NC}"
echo "Quality: ${THUMB_QUALITY}%"
echo "Max dimensions: ${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}"
echo ""

# Process photography folder
PHOTO_DIR="assets/img/photography"
if [ -d "$PHOTO_DIR" ]; then
    echo -e "${YELLOW}Processing: $PHOTO_DIR${NC}"
    
    # Create thumbs directory
    mkdir -p "$PHOTO_DIR/thumbs"
    
    # Process each image
    count=0
    for img in "$PHOTO_DIR"/*.{jpg,jpeg,png,JPG,JPEG,PNG} 2>/dev/null; do
        if [ -f "$img" ]; then
            filename=$(basename "$img")
            thumb_path="$PHOTO_DIR/thumbs/$filename"
            
            # Skip if thumbnail already exists and is newer than original
            if [ ! -f "$thumb_path" ] || [ "$img" -nt "$thumb_path" ]; then
                echo "  Creating thumbnail: $filename"
                
                # Using ImageMagick (magick or convert command)
                if command -v magick &> /dev/null; then
                    magick "$img" -resize "${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>" -quality $THUMB_QUALITY "$thumb_path"
                elif command -v convert &> /dev/null; then
                    convert "$img" -resize "${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>" -quality $THUMB_QUALITY "$thumb_path"
                else
                    echo "  ERROR: ImageMagick not found. Please install it first."
                    echo "  Windows: winget install ImageMagick.ImageMagick"
                    echo "  Mac: brew install imagemagick"
                    echo "  Linux: sudo apt install imagemagick"
                    exit 1
                fi
                ((count++))
            fi
        fi
    done
    echo "  Created $count thumbnails"
fi

# Process creative/art folder
ART_DIR="assets/img/creative/art"
if [ -d "$ART_DIR" ]; then
    echo -e "${YELLOW}Processing: $ART_DIR${NC}"
    
    mkdir -p "$ART_DIR/thumbs"
    
    count=0
    for img in "$ART_DIR"/*.{jpg,jpeg,png,JPG,JPEG,PNG} 2>/dev/null; do
        if [ -f "$img" ]; then
            filename=$(basename "$img")
            thumb_path="$ART_DIR/thumbs/$filename"
            
            if [ ! -f "$thumb_path" ] || [ "$img" -nt "$thumb_path" ]; then
                echo "  Creating thumbnail: $filename"
                
                if command -v magick &> /dev/null; then
                    magick "$img" -resize "${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>" -quality $THUMB_QUALITY "$thumb_path"
                elif command -v convert &> /dev/null; then
                    convert "$img" -resize "${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>" -quality $THUMB_QUALITY "$thumb_path"
                fi
                ((count++))
            fi
        fi
    done
    echo "  Created $count thumbnails"
fi

echo ""
echo -e "${GREEN}Done! Thumbnails created in 'thumbs' subfolders.${NC}"
echo "Gallery will now load thumbnails for preview and use full resolution for viewing/download."
