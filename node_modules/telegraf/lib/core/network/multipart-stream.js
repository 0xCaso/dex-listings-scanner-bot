"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream = require("stream");
const check_1 = require("../helpers/check");
const sandwich_stream_1 = require("sandwich-stream");
const CRNL = '\r\n';
class MultipartStream extends sandwich_stream_1.default {
    constructor(boundary) {
        super({
            head: `--${boundary}${CRNL}`,
            tail: `${CRNL}--${boundary}--`,
            separator: `${CRNL}--${boundary}${CRNL}`,
        });
    }
    addPart(part) {
        const partStream = new stream.PassThrough();
        for (const [key, header] of Object.entries(part.headers)) {
            partStream.write(`${key}:${header}${CRNL}`);
        }
        partStream.write(CRNL);
        if (MultipartStream.isStream(part.body)) {
            part.body.pipe(partStream);
        }
        else {
            partStream.end(part.body);
        }
        this.add(partStream);
    }
    static isStream(stream) {
        return (typeof stream === 'object' &&
            stream !== null &&
            (0, check_1.hasPropType)(stream, 'pipe', 'function'));
    }
}
exports.default = MultipartStream;
