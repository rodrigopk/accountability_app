/**
 * Script to generate tab bar icons from SVG to PNG
 * Creates PNG icons at 1x, 2x, and 3x resolutions
 */

const fs = require('fs');
const path = require('path');

const sharp = require('sharp');

const iconsDir = path.join(__dirname, '..', 'assets', 'icons');

async function convertSVGToPNG(svgPath, pngPath, size) {
  try {
    await sharp(svgPath).resize(size, size).png().toFile(pngPath);
    console.log(`Created ${path.basename(pngPath)} (${size}x${size})`);
  } catch (error) {
    console.error(`Error creating ${pngPath}:`, error.message);
  }
}

async function generateIcons() {
  // Ensure directory exists
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  const roundsSVG = path.join(iconsDir, 'rounds-outline.svg');
  const settingsSVG = path.join(iconsDir, 'settings-outline.svg');

  // Check if SVG files exist
  if (!fs.existsSync(roundsSVG) || !fs.existsSync(settingsSVG)) {
    console.error(
      'SVG files not found. Please ensure rounds-outline.svg and settings-outline.svg exist.',
    );
    return;
  }

  // Generate rounds icons
  await convertSVGToPNG(roundsSVG, path.join(iconsDir, 'rounds-outline.png'), 24);
  await convertSVGToPNG(roundsSVG, path.join(iconsDir, 'rounds-outline@2x.png'), 48);
  await convertSVGToPNG(roundsSVG, path.join(iconsDir, 'rounds-outline@3x.png'), 72);

  // Generate settings icons
  await convertSVGToPNG(settingsSVG, path.join(iconsDir, 'settings-outline.png'), 24);
  await convertSVGToPNG(settingsSVG, path.join(iconsDir, 'settings-outline@2x.png'), 48);
  await convertSVGToPNG(settingsSVG, path.join(iconsDir, 'settings-outline@3x.png'), 72);

  console.log('\nAll icons generated successfully!');
}

generateIcons().catch(console.error);
