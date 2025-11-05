// Simple script to create placeholder PWA icons
// Run with: node create-placeholders.js

import fs from 'fs';
import path from 'path';

// Icon sizes needed for PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create a simple HTML file that can be used to generate icons
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>VidNest Icon Generator</title>
    <style>
        body { margin: 0; padding: 20px; background: #f0f0f0; }
        .icon-container { display: flex; flex-wrap: wrap; gap: 20px; }
        .icon { 
            background: #3B82F6; 
            border-radius: 16px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            color: white; 
            font-weight: bold;
            font-family: Arial, sans-serif;
        }
        .icon-72 { width: 72px; height: 72px; font-size: 24px; }
        .icon-96 { width: 96px; height: 96px; font-size: 32px; }
        .icon-128 { width: 128px; height: 128px; font-size: 42px; }
        .icon-144 { width: 144px; height: 144px; font-size: 48px; }
        .icon-152 { width: 152px; height: 152px; font-size: 50px; }
        .icon-192 { width: 192px; height: 192px; font-size: 64px; }
        .icon-384 { width: 384px; height: 384px; font-size: 128px; }
        .icon-512 { width: 512px; height: 512px; font-size: 170px; }
    </style>
</head>
<body>
    <h1>VidNest PWA Icons</h1>
    <p>Right-click each icon and "Save image as" to create the PNG files:</p>
    <div class="icon-container">
        <canvas id="icon-72" class="icon icon-72" width="72" height="72">VN</canvas>
        <canvas id="icon-96" class="icon icon-96" width="96" height="96">VN</canvas>
        <canvas id="icon-128" class="icon icon-128" width="128" height="128">VN</canvas>
        <canvas id="icon-144" class="icon icon-144" width="144" height="144">VN</canvas>
        <canvas id="icon-152" class="icon icon-152" width="152" height="152">VN</canvas>
        <canvas id="icon-192" class="icon icon-192" width="192" height="192">VN</canvas>
        <canvas id="icon-384" class="icon icon-384" width="384" height="384">VN</canvas>
        <canvas id="icon-512" class="icon icon-512" width="512" height="512">VN</canvas>
    </div>
    
    <script>
        // Draw the icons on canvas elements
        const canvases = document.querySelectorAll('canvas');
        canvases.forEach(canvas => {
            const ctx = canvas.getContext('2d');
            const size = canvas.width;
            
            // Draw background
            ctx.fillStyle = '#3B82F6';
            ctx.fillRect(0, 0, size, size);
            
            // Draw rounded corners
            ctx.globalCompositeOperation = 'destination-in';
            ctx.beginPath();
            ctx.roundRect(0, 0, size, size, size * 0.1);
            ctx.fill();
            ctx.globalCompositeOperation = 'source-over';
            
            // Draw text
            ctx.fillStyle = 'white';
            ctx.font = \`bold \${size * 0.3}px Arial\`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('VN', size/2, size/2);
        });
    </script>
</body>
</html>
`;

// Write the HTML file
fs.writeFileSync('icon-generator.html', htmlContent);

console.log('Created icon-generator.html');
console.log('Open this file in a browser and right-click each icon to save as PNG files.');
console.log('Save them with the correct names: icon-72x72.png, icon-96x96.png, etc.');
