const fs = require('fs');
const path = require('path');
const pdfjsLib = require('pdfjs-dist');

// Configurar o worker
pdfjsLib.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker.js');

async function extractPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdf = await pdfjsLib.getDocument({ data: dataBuffer }).promise;

    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      text += pageText + '\n';
    }

    return {
      numPages: pdf.numPages,
      text: text
    };
  } catch (error) {
    console.error(`Erro ao processar ${filePath}:`, error.message);
    return null;
  }
}

async function main() {
  const basePath = 'C:\\Users\\araga\\OneDrive\\Documentos\\auto conhecimento\\Jornada do Auto conhecimento';

  const files = [
    '30 neurociencia do habito.pdf',
    '31 as leis do hábito.pdf'
  ];

  for (const file of files) {
    const filePath = path.join(basePath, file);
    console.log(`\n${'='.repeat(80)}`);
    console.log(`PROCESSANDO: ${file}`);
    console.log(`${'='.repeat(80)}\n`);

    const result = await extractPDF(filePath);
    if (result) {
      console.log(`Total de páginas: ${result.numPages}`);
      console.log(`Primeiros 3000 caracteres do texto:\n`);
      console.log(result.text.substring(0, 3000));

      // Salvar em arquivo para análise posterior
      const outputFile = `${file.replace('.pdf', '_extracted.txt')}`;
      fs.writeFileSync(outputFile, result.text);
      console.log(`\n✓ Texto completo salvo em: ${outputFile}`);
    }
  }
}

main().catch(console.error);
