const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'out');
const nextDir = path.join(outDir, '_next');
const assetsDir = path.join(outDir, 'assets');

// 1. Rename _next to assets (if _next exists and assets doesn't)
if (fs.existsSync(nextDir) && !fs.existsSync(assetsDir)) {
    fs.renameSync(nextDir, assetsDir);
    console.log('Renamed _next -> assets');
}

// 2. Recursively find all HTML, JS, CSS files and replace paths
function walkAndReplace(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            walkAndReplace(fullPath);
        } else if (/\.(html|js|css)$/.test(file)) {
            let content = fs.readFileSync(fullPath, 'utf8');
            const original = content;
            
            // Replace absolute /_next/ with relative ./assets/
            content = content.replace(/\/_next\//g, './assets/');
            // Also replace escaped versions in JSON strings
            content = content.replace(/\\\/_next\\\//g, '\\/assets\\/');
            
            // Replace absolute image paths: /img- -> ./img-
            content = content.replace(/\"\/img-/g, '"./img-');
            content = content.replace(/\\\"\/img-/g, '\\\".\/img-');
            
            // Replace absolute paths for public assets
            content = content.replace(/\"\/candidate-face\.png\"/g, '"./candidate-face.png"');
            content = content.replace(/\"\/portrait-/g, '"./portrait-');
            content = content.replace(/\"\/stats\.json\"/g, '"./stats.json"');
            content = content.replace(/\"\/webhook\.php\"/g, '"./webhook.php"');
            
            // Replace escaped versions in inline scripts/JSON
            content = content.replace(/\\\"\/candidate-face\.png\\\"/g, '\\\".\/candidate-face.png\\\"');
            content = content.replace(/\\\"\/portrait-/g, '\\\".\/portrait-');
            
            // Replace href="/candidate-face.png" (preload links)
            content = content.replace(/href="\/candidate-face\.png"/g, 'href="./candidate-face.png"');
            content = content.replace(/href="\/portrait-/g, 'href="./portrait-');
            content = content.replace(/href="\/img-/g, 'href="./img-');
            
            // Replace src="/candidate-face.png" patterns
            content = content.replace(/src="\/candidate-face\.png"/g, 'src="./candidate-face.png"');
            content = content.replace(/src="\/portrait-/g, 'src="./portrait-');
            
            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Fixed: ' + path.relative(outDir, fullPath));
            }
        }
    }
}

walkAndReplace(outDir);
console.log('All static paths fixed successfully!');
