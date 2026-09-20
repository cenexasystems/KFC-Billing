const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputLogo = path.join(__dirname, '..', 'public', 'logo.png');
const publicDir = path.join(__dirname, '..', 'public');

async function generateIcons() {
  console.log('Generating PWA icons from:', inputLogo);

  // 1. icon-192.png (purpose: any)
  await sharp(inputLogo)
    .resize(192, 192, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));
  console.log('Created icon-192.png');

  // 2. icon-512.png (purpose: any)
  await sharp(inputLogo)
    .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));
  console.log('Created icon-512.png');

  // 3. icon-512-maskable.png: logo scaled into central 80% safe zone on solid brand-color background
  // 80% of 512 = ~409px. We will scale the logo to 390x390 and composite in center of 512x512 solid white (#ffffff) canvas.
  const innerSize = Math.round(512 * 0.78); // 399px, well within 80% safe zone
  const innerBuffer = await sharp(inputLogo)
    .resize(innerSize, innerSize, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toBuffer();

  const offset = Math.round((512 - innerSize) / 2);

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
    .composite([{ input: innerBuffer, top: offset, left: offset }])
    .png()
    .toFile(path.join(publicDir, 'icon-512-maskable.png'));
  console.log('Created icon-512-maskable.png');

  // 4. apple-touch-icon.png (180x180, solid background, no transparency)
  const appleInnerSize = Math.round(180 * 0.9); // 162px
  const appleInnerBuffer = await sharp(inputLogo)
    .resize(appleInnerSize, appleInnerSize, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toBuffer();

  const appleOffset = Math.round((180 - appleInnerSize) / 2);

  await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
    .composite([{ input: appleInnerBuffer, top: appleOffset, left: appleOffset }])
    .flatten({ background: '#ffffff' })
    .removeAlpha()
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Created apple-touch-icon.png');

  // 5. favicon-32x32.png
  await sharp(inputLogo)
    .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));
  console.log('Created favicon-32x32.png');

  // 6. favicon.ico (can be a 32x32 PNG formatted as ICO or simple 32x32 PNG)
  // For standard browser support, copy or write favicon.ico
  const fav32 = await sharp(inputLogo)
    .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), fav32);
  console.log('Created favicon.ico');

  console.log('All icons generated successfully!');
}

generateIcons().catch(err => {
  console.error(err);
  process.exit(1);
});
