#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import math

def create_icon(size=512):
    """Create a modern dev tools icon with gradient background and tool symbols"""
    
    # Create image with transparent background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw gradient background circle
    center = size // 2
    radius = int(size * 0.45)
    
    # Create a blue-to-purple gradient effect
    for i in range(radius, 0, -1):
        # Gradient from blue (#3B82F6) to purple (#8B5CF6)
        ratio = i / radius
        r = int(59 + (139 - 59) * (1 - ratio))
        g = int(130 + (92 - 130) * (1 - ratio))
        b = int(246 + (246 - 246) * (1 - ratio))
        alpha = 255
        
        draw.ellipse(
            [center - i, center - i, center + i, center + i],
            fill=(r, g, b, alpha)
        )
    
    # Draw wrench icon (left tool)
    wrench_color = (255, 255, 255, 255)
    wrench_width = int(size * 0.06)
    
    # Wrench handle
    wrench_x = center - int(size * 0.15)
    wrench_y = center + int(size * 0.05)
    wrench_length = int(size * 0.25)
    
    # Draw wrench shaft at angle
    angle = -45
    rad = math.radians(angle)
    end_x = wrench_x - int(wrench_length * math.cos(rad))
    end_y = wrench_y - int(wrench_length * math.sin(rad))
    
    draw.line([wrench_x, wrench_y, end_x, end_y], fill=wrench_color, width=wrench_width)
    
    # Draw wrench head (open end)
    head_size = int(size * 0.08)
    draw.arc(
        [end_x - head_size, end_y - head_size, end_x + head_size, end_y + head_size],
        start=135, end=315, fill=wrench_color, width=wrench_width
    )
    
    # Draw gear icon (right tool)
    gear_color = (255, 255, 255, 255)
    gear_center_x = center + int(size * 0.15)
    gear_center_y = center - int(size * 0.05)
    gear_radius = int(size * 0.12)
    teeth = 8
    tooth_height = int(size * 0.04)
    
    # Draw gear teeth
    for i in range(teeth):
        angle = (360 / teeth) * i
        rad1 = math.radians(angle - 360 / teeth / 4)
        rad2 = math.radians(angle + 360 / teeth / 4)
        
        # Outer points
        x1_out = gear_center_x + int((gear_radius + tooth_height) * math.cos(rad1))
        y1_out = gear_center_y + int((gear_radius + tooth_height) * math.sin(rad1))
        x2_out = gear_center_x + int((gear_radius + tooth_height) * math.cos(rad2))
        y2_out = gear_center_y + int((gear_radius + tooth_height) * math.sin(rad2))
        
        # Inner points
        x1_in = gear_center_x + int(gear_radius * math.cos(rad1))
        y1_in = gear_center_y + int(gear_radius * math.sin(rad1))
        x2_in = gear_center_x + int(gear_radius * math.cos(rad2))
        y2_in = gear_center_y + int(gear_radius * math.sin(rad2))
        
        draw.polygon([x1_in, y1_in, x1_out, y1_out, x2_out, y2_out, x2_in, y2_in], fill=gear_color)
    
    # Draw gear center circle
    draw.ellipse(
        [gear_center_x - gear_radius, gear_center_y - gear_radius,
         gear_center_x + gear_radius, gear_center_y + gear_radius],
        fill=gear_color
    )
    
    # Draw inner hole
    inner_radius = int(size * 0.04)
    draw.ellipse(
        [gear_center_x - inner_radius, gear_center_y - inner_radius,
         gear_center_x + inner_radius, gear_center_y + inner_radius],
        fill=(59, 130, 246, 255)
    )
    
    # Draw code brackets "<>" at the bottom
    bracket_color = (255, 255, 255, 230)
    bracket_size = int(size * 0.1)
    bracket_y = center + int(size * 0.25)
    bracket_width = int(size * 0.05)
    
    # Left bracket "<"
    left_x = center - int(size * 0.08)
    draw.line([left_x, bracket_y - bracket_size, left_x - bracket_size//2, bracket_y], 
              fill=bracket_color, width=bracket_width)
    draw.line([left_x - bracket_size//2, bracket_y, left_x, bracket_y + bracket_size], 
              fill=bracket_color, width=bracket_width)
    
    # Right bracket ">"
    right_x = center + int(size * 0.08)
    draw.line([right_x, bracket_y - bracket_size, right_x + bracket_size//2, bracket_y], 
              fill=bracket_color, width=bracket_width)
    draw.line([right_x + bracket_size//2, bracket_y, right_x, bracket_y + bracket_size], 
              fill=bracket_color, width=bracket_width)
    
    return img

# Generate icons in multiple sizes
sizes = [512, 256, 128, 64, 32, 16]

print("Generating icons...")

# Generate main icon
icon_512 = create_icon(512)
icon_512.save('icon.png')
print(f"✓ Generated icon.png (512x512)")

# Generate icon.ico with multiple sizes
icons = [create_icon(size) for size in sizes]
icons[0].save('icon.ico', format='ICO', sizes=[(s, s) for s in sizes])
print(f"✓ Generated icon.ico (multi-size)")

# Generate individual sizes for Electron builder
for size in [512, 256, 128]:
    icon = create_icon(size)
    icon.save(f'icon_{size}x{size}.png')
    print(f"✓ Generated icon_{size}x{size}.png")

print("\nIcon generation complete!")
print("Files created: icon.png, icon.ico, icon_512x512.png, icon_256x256.png, icon_128x128.png")
