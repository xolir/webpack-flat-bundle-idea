const path = require('path');

// Add caching mechanism

const constants = {
  extractTextSignature: 'extract-text-webpack-plugin-output-filename'
}

class PreventEmitPlugin {
  constructor(filePatterns) {
    this.filePatterns = filePatterns;
    this.cachedNames = [];
  }

  apply(compiler) {
    compiler.plugin('compilation', (compilation) => {
      compilation.plugin('chunk-asset', (chunk, fileName) => {
        if (this.cachedNames.includes(fileName)) {
          delete compilation.assets[fileName]
        }
        else if (
          fileName !== constants.extractTextSignature &&
          this.checkFilePatternMatch(chunk.entryModule.rawRequest)
        ) {
          delete compilation.assets[fileName]
          this.addToCache(fileName);
        }
      });
    });
  }

  addToCache(fileName) {
    this.cachedNames.push(fileName);
  }

  checkFilePatternMatch(fileRequest) {
    return Object.values(this.filePatterns).find(pattern => pattern === fileRequest || false)
  }
}

module.exports = PreventEmitPlugin;
