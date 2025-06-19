const fs = require('fs');
const zlib = require('zlib');
const crypto = require('crypto');
const { Transform, pipeline } = require('stream');

// 1. �����Զ���ת���� - �ı���Сдת��
class CaseTransform extends Transform {
    constructor(options = {}) {
        super(options);
        this.caseType = options.caseType || 'upper'; // upper �� lower
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

// 2. ���ȱ�����
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

        process.stdout.write(`\r����: ${percent}% | ����: ${(this.processed / 1024 / 1024).toFixed(2)}MB | �ٶ�: ${speed}MB/s`);

        callback(null, chunk);
    }
}

// ��������
async function processFile(inputFile) {
    const extIndex = inputFile.lastIndexOf('.');
    const baseName = extIndex === -1 ? inputFile : inputFile.slice(0, extIndex);
    const outputFile = `${baseName}_processed.txt`;
    const compressedFile = `${baseName}.gz`;
    const encryptedFile = `${baseName}.enc`;

    const stats = fs.statSync(inputFile);
    const fileSize = stats.size;

    try {
        // ������1: �ļ�����ܵ�
        await new Promise((resolve, reject) => {
            pipeline(
                fs.createReadStream(inputFile),
                new ProgressStream(fileSize),
                new CaseTransform({ caseType: 'upper' }),
                fs.createWriteStream(outputFile),
                (err) => err ? reject(err) : resolve()
            );
        });
        console.log(`\n�ļ��������: ${outputFile}`);

        // ������2: ѹ���ܵ�
        await new Promise((resolve, reject) => {
            pipeline(
                fs.createReadStream(outputFile),
                zlib.createGzip(),
                fs.createWriteStream(compressedFile),
                (err) => err ? reject(err) : resolve()
            );
        });
        console.log(`�ļ�ѹ�����: ${compressedFile} (${(fs.statSync(compressedFile).size / 1024).toFixed(2)}KB)`);

        // ������Կ�ͳ�ʼ������
        const key = crypto.randomBytes(32);
        const iv = crypto.randomBytes(16);

        // ������3: ���ܹܵ�
        await new Promise((resolve, reject) => {
            pipeline(
                fs.createReadStream(outputFile),
                crypto.createCipheriv('aes-256-cbc', key, iv),
                fs.createWriteStream(encryptedFile),
                (err) => err ? reject(err) : resolve()
            );
        });
        console.log(`�ļ��������: ${encryptedFile}`);

        // ������4: ����+��ѹ�ܵ�
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
        console.log("�ļ����ܽ�ѹ���");

    } catch (err) {
        console.error('\n�������:', err.message);
    }
}

// ִ��ʾ��
if (process.argv.length < 3) {
    console.log('�÷�: node streamDemo.js <�ļ���>');
    process.exit(1);
}

const inputFile = process.argv[2];
processFile(inputFile);