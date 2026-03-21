const fs = require('fs');
const path = require('path');
const { SourceMapConsumer } = require('source-map');

async function mapLine(mapPath, genLine) {
  const raw = fs.readFileSync(mapPath, 'utf8');
  const map = JSON.parse(raw);
  return await SourceMapConsumer.with(map, null, consumer => {
    for (let col = 0; col < 300; col++) {
      const pos = consumer.originalPositionFor({ line: genLine, column: col });
      if (pos && pos.source) {
        return { genLine, genColumn: col, source: pos.source, line: pos.line, column: pos.column, name: pos.name };
      }
    }
    return { genLine, found: false };
  });
}

async function main() {
  try {
    const mapPath = path.resolve(__dirname, '../dist/nimbi-cms.js.map');
    if (!fs.existsSync(mapPath)) {
      console.error('map not found at', mapPath);
      process.exit(2);
    }
    const linesToCheck = [71, 1491];
    for (const l of linesToCheck) {
      const res = await mapLine(mapPath, l);
      console.log(JSON.stringify(res, null, 2));
    }
  } catch (e) {
    console.error('error', e && e.stack || e);
    process.exit(1);
  }
}

main();
