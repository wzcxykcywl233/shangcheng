const fs = require('fs');
const zlib = require('zlib');
const crypto = require('crypto');
const { Transform, pipeline } = require('stream');

// 1. 创建自定义转换流 - 文本大小写转换
class CaseTransform extends Transform {
    constructor(options = {}) {
        super(options);
        this.caseType = options.caseType || 'upper'; // upper 或 lower
    }

    _transform(chunk, encoding, callback) {
        try {
            const data = chunk.toString();
            const result = this.caseType === 'upper'
                ? data.toUpperCase()
                : data.toLowerCase();

            this.push(result);
            callback();
        } catch (err) {
            callback(err);
        }
    }
}

// 2. 进度报告流
class ProgressStream extends Transform {
    constructor(fileSize, options) {
        super(options);
        this.fileSize = fileSize;
        this.processed = 0;
        this.startTime = Date.now();
    }

    _transform(chunk, encoding, callback) {
        this.processed += chunk.length;
        const percent = Math.floor((this.processed / this.fileSize) * 100);
        const elapsed = (Date.now() - this.startTime) / 1000;
        const speed = (this.processed / (1024 * 1024) / elapsed).toFixed(2);

        process.stdout.write(`\r进度: ${percent}% | 处理: ${(this.processed / 1024 / 1024).toFixed(2)}MB | 速度: ${speed}MB/s`);

        callback(null, chunk);
    }
}

// 主处理函数
async function processFile(inputFile) {
    const extIndex = inputFile.lastIndexOf('.');
    const baseName = extIndex === -1 ? inputFile : inputFile.slice(0, extIndex);
    const outputFile = `${baseName}_processed.txt`;
    const compressedFile = `${baseName}.gz`;
    const encryptedFile = `${baseName}.enc`;

    const stats = fs.statSync(inputFile);
    const fileSize = stats.size;

    try {
        // 处理链1: 文件处理管道
        await new Promise((resolve, reject) => {
            pipeline(
                fs.createReadStream(inputFile),
                new ProgressStream(fileSize),
                new CaseTransform({ caseType: 'upper' }),
                fs.createWriteStream(outputFile),
                (err) => err ? reject(err) : resolve()
            );
        });
        console.log(`\n文件处理完成: ${outputFile}`);

        // 处理链2: 压缩管道
        await new Promise((resolve, reject) => {
            pipeline(
                fs.createReadStream(outputFile),
                zlib.createGzip(),
                fs.createWriteStream(compressedFile),
                (err) => err ? reject(err) : resolve()
            );
        });
        console.log(`文件压缩完成: ${compressedFile} (${(fs.statSync(compressedFile).size / 1024).toFixed(2)}KB)`);

        // 加密密钥和初始化向量
        const key = crypto.randomBytes(32);
        const iv = crypto.randomBytes(16);

        // 处理链3: 加密管道
        await new Promise((resolve, reject) => {
            pipeline(
                fs.createReadStream(outputFile),
                crypto.createCipheriv('aes-256-cbc', key, iv),
                fs.createWriteStream(encryptedFile),
                (err) => err ? reject(err) : resolve()
            );
        });
        console.log(`文件加密完成: ${encryptedFile}`);

        // 处理链4: 解密+解压管道
        await new Promise((resolve, reject) => {
            pipeline(
                fs.createReadStream(encryptedFile),
                crypto.createDecipheriv('aes-256-cbc', key, iv),
                zlib.createGunzip(),
                new CaseTransform({ caseType: 'lower' }),
                fs.createWriteStream(`${baseName}_decrypted.txt`),
                (err) => err ? reject(err) : resolve()
            );
        });
        console.log("文件解密解压完成");

    } catch (err) {
        console.error('\n处理出错:', err.message);
    }
}

// 执行示例
if (process.argv.length < 3) {
    console.log('用法: node streamDemo.js <文件名>');
    process.exit(1);
}

const inputFile = process.argv[2];
processFile(inputFile);