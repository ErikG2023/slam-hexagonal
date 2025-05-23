// extract-code.js
const fs = require('fs').promises;
const path = require('path');

// Configuración de archivos y carpetas a ignorar
const ignorePatterns = [
    'node_modules',
    'dist',
    '.git',
    'coverage',
    'test',
    '.env',
    'package-lock.json',
    'README.md',
    '.eslintrc.js',
    '.prettierrc',
    'nest-cli.json',
    'tsconfig.json',
    'tsconfig.build.json',
    'tsconfig.build',
    'extract-code.js',
    'project-code.txt',
    'extract-module-code.js',
    'extract-module-code.js',
    'project-structure.js'

];

// Extensiones de archivo a incluir
const includeExtensions = ['.ts', '.js'];

async function extractCode(startPath) {
    let output = '';
    output += `Código extraído el ${new Date().toLocaleString()}\n\n`;

    async function processDirectory(dirPath) {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);
            const relativePath = path.relative(startPath, fullPath);

            // Verificar si debemos ignorar este archivo/carpeta
            if (ignorePatterns.some(pattern => 
                fullPath.includes(pattern) || entry.name.startsWith('.'))) {
                continue;
            }

            if (entry.isDirectory()) {
                await processDirectory(fullPath);
            } else {
                const ext = path.extname(entry.name);
                if (includeExtensions.includes(ext)) {
                    output += `\n// ==========================================\n`;
                    output += `// File: ${relativePath}\n`;
                    output += `// ==========================================\n\n`;
                    const content = await fs.readFile(fullPath, 'utf8');
                    output += content + '\n';
                }
            }
        }
    }

    try {
        await processDirectory(startPath);
        await fs.writeFile('project-code.txt', output);
        console.log('Código extraído exitosamente a project-code.txt');
    } catch (error) {
        console.error('Error al extraer código:', error);
    }
}

// Ejecutar para el directorio actual
extractCode(process.cwd());