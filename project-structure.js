const fs = require('fs');
const path = require('path');

// Configuración
const projectPath = path.resolve(__dirname);
const outputPath = path.resolve(__dirname, 'project-structure.txt');
const ignoreDirs = ['.git', 'node_modules', 'dist', 'coverage', '.idea', '.vscode','Slam-Nestjs'];
const ignoreFiles = ['.DS_Store', '.gitignore', '.env'];

// Función para generar la estructura en formato de árbol
function generateTree(dir, prefix = '', isLast = true) {
  let result = '';
  const dirName = path.basename(dir);
  
  // Ignorar directorios especificados
  if (ignoreDirs.includes(dirName)) {
    return result;
  }
  
  // Agregar el directorio actual al resultado
  result += `${prefix}${isLast ? '└── ' : '├── '}${dirName}\n`;
  
  // Nuevo prefijo para los elementos hijo
  const newPrefix = prefix + (isLast ? '    ' : '│   ');
  
  // Leer elementos del directorio
  try {
    const items = fs.readdirSync(dir);
    
    // Filtrar y ordenar: primero directorios, luego archivos
    const directories = [];
    const files = [];
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      if (fs.statSync(itemPath).isDirectory()) {
        if (!ignoreDirs.includes(item)) {
          directories.push(item);
        }
      } else {
        if (!ignoreFiles.includes(item)) {
          files.push(item);
        }
      }
    });
    
    // Procesar directorios
    directories.forEach((directory, index) => {
      const isLastDir = index === directories.length - 1 && files.length === 0;
      result += generateTree(path.join(dir, directory), newPrefix, isLastDir);
    });
    
    // Procesar archivos
    files.forEach((file, index) => {
      const isLastFile = index === files.length - 1;
      result += `${newPrefix}${isLastFile ? '└── ' : '├── '}${file}\n`;
    });
    
  } catch (error) {
    console.error(`Error al leer el directorio ${dir}:`, error);
  }
  
  return result;
}

// Función principal
async function generateProjectStructure() {
  console.log('Generando estructura del proyecto...');
  
  try {
    const rootDir = path.basename(projectPath);
    let outputContent = `Estructura del proyecto: ${rootDir}\n`;
    outputContent += `Generado: ${new Date().toISOString()}\n\n`;
    
    // Generar el árbol de directorios
    outputContent += generateTree(projectPath);
    
    // Escribir el contenido en el archivo de salida
    fs.writeFileSync(outputPath, outputContent);
    console.log(`Estructura del proyecto generada correctamente en: ${outputPath}`);
    
  } catch (error) {
    console.error('Error al generar la estructura del proyecto:', error);
  }
}

// Ejecutar la función principal
generateProjectStructure();