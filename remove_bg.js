const { Jimp } = require('jimp');
const path = require('path');

// Target the specific file the user referenced
const INPUT_PATH = "C:\\Users\\Administrator\\Documents\\undergrowth-website\\static\\img\\undergrowth_logo.png";
const OUTPUT_PATH = "C:\\Users\\Administrator\\Documents\\undergrowth-website\\processed_logo.png";

async function processImage() {
    console.log(`Reading image from ${INPUT_PATH}...`);
    const image = await Jimp.read(INPUT_PATH);
    console.log('Image read successfully.');

    console.log('Processing pixels (removing white background)...');
    // Scan every pixel
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
        const red = this.bitmap.data[idx + 0];
        const green = this.bitmap.data[idx + 1];
        const blue = this.bitmap.data[idx + 2];

        // Calculate channel differences to determine saturation
        const max = Math.max(red, green, blue);
        const min = Math.min(red, green, blue);
        const diff = max - min; // Crude saturation metric

        // Condition 1: High brightness (it's a light color)
        // Condition 2: Low saturation (it's gray/white, not green)
        // The green logo will have a high 'diff' because Green component is dominant.
        // Background grays/whites will have low 'diff'.

        // Condition 1: Low saturation (diff < 35) = Neutral color (White, Gray, Dark Gray)
        // Condition 2: Not Deep Black (max > 60) = Preserve dark logo outlines

        const isNeutral = diff < 35;
        const isNotDeepBlack = max > 60;

        if (isNeutral && isNotDeepBlack) {
            // Set alpha to 0 (transparent)
            this.bitmap.data[idx + 3] = 0;
        }
    });

    console.log('Autocropping...');
    // Crop white/transparent space from edges
    image.autocrop();

    console.log(`Writing to ${OUTPUT_PATH}...`);
    image.write(OUTPUT_PATH, (err) => {
        if (err) {
            console.error("Error writing:", err);
        } else {
            console.log("Done!");
        }
    });
}

processImage().catch(console.error);
