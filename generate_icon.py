#!/usr/bin/env python3
from PIL import Image
import os

def generate_icons_from_logo(logo_path, output_dir):
    """Generate icon files in multiple sizes from a logo PNG"""
    
    # Load the logo
    try:
        logo = Image.open(logo_path)
        print(f"Loaded logo from {logo_path}")
        print(f"Original size: {logo.size}")
    except Exception as e:
        print(f"Error loading logo: {e}")
        return
    
    # Convert to RGBA if needed
    if logo.mode != 'RGBA':
        logo = logo.convert('RGBA')
    
    # Sizes to generate
    sizes = [512, 256, 128, 64, 32, 16]
    
    # Generate main icon.png (512x512)
    icon_512 = logo.resize((512, 512), Image.Resampling.LANCZOS)
    icon_512.save(os.path.join(output_dir, 'icon.png'))
    print(f"✓ Generated icon.png (512x512)")
    
    # Generate icon.ico with multiple sizes
    icons = [logo.resize((size, size), Image.Resampling.LANCZOS) for size in sizes]
    icons[0].save(
        os.path.join(output_dir, 'icon.ico'),
        format='ICO',
        sizes=[(s, s) for s in sizes]
    )
    print(f"✓ Generated icon.ico (multi-size)")
    
    # Generate individual sizes for Electron builder
    for size in [512, 256, 128]:
        icon = logo.resize((size, size), Image.Resampling.LANCZOS)
        icon.save(os.path.join(output_dir, f'icon_{size}x{size}.png'))
        print(f"✓ Generated icon_{size}x{size}.png")
    
    return icon_512

def generate_website_assets(logo_path, website_dir):
    """Generate website logo and favicon from logo PNG"""
    
    # Load the logo
    try:
        logo = Image.open(logo_path)
    except Exception as e:
        print(f"Error loading logo for website: {e}")
        return
    
    # Convert to RGBA if needed
    if logo.mode != 'RGBA':
        logo = logo.convert('RGBA')
    
    # Generate website logo (512x512)
    website_logo = logo.resize((512, 512), Image.Resampling.LANCZOS)
    website_logo.save(os.path.join(website_dir, 'logo.png'))
    print(f"✓ Generated website logo.png (512x512)")
    
    # Generate website favicon (512x512)
    favicon = logo.resize((512, 512), Image.Resampling.LANCZOS)
    favicon.save(os.path.join(website_dir, 'favicon.png'))
    print(f"✓ Generated website favicon.png (512x512)")

# Paths
logo_path = 'logo/logo.png'
icons_output_dir = 'src/renderer/src/assets/icons'
website_output_dir = 'website/assets'

# Create output directories if they don't exist
os.makedirs(icons_output_dir, exist_ok=True)
os.makedirs(website_output_dir, exist_ok=True)

print("Generating icons from logo...")
print("=" * 50)

# Generate app icons
generate_icons_from_logo(logo_path, icons_output_dir)

print("\n" + "=" * 50)
print("Generating website assets...")
print("=" * 50)

# Generate website assets
generate_website_assets(logo_path, website_output_dir)

print("\nGeneration complete!")
print(f"\nApp icons created in {icons_output_dir}:")
print("- icon.png")
print("- icon.ico")
print("- icon_512x512.png")
print("- icon_256x256.png")
print("- icon_128x128.png")
print(f"\nWebsite assets created in {website_output_dir}:")
print("- logo.png")
print("- favicon.png")
