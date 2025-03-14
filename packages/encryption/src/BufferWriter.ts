import {Buffer} from 'buffer';

import {arrayify, reverseEndian} from './utils';
import {Bytes, StrictByteLength} from './types';

/**
 * We don't need any more methods since it's just to read a total of 76 bytes buffer.
 */
export class BufferWriter {
  public buffer: Buffer;
  public offset: number;

  constructor(buffer: Buffer, offset = 0) {
    this.buffer = buffer;
    this.offset = offset;
  }

  public skip(bytes: number) {
    this.offset += bytes;

    if (this.offset > this.buffer.length) {
      const expand = Buffer.alloc(this.offset - this.buffer.length);
      this.buffer = Buffer.concat([this.buffer, expand]);
    }
  }

  public writeBE(bytes: Bytes) {
    const data = arrayify(bytes);

    this.buffer = Buffer.concat([this.buffer, data]);
    this.offset += data.length;
  }

  public writeLE(bytes: Bytes) {
    const data = arrayify(bytes);

    this.buffer = Buffer.concat([this.buffer, reverseEndian(data)]);
    this.offset += data.length;
  }

  public writeUIntBE(value: number | bigint, bytes: StrictByteLength = 4) {
    const writeMethod = (
      {
        1: 'writeUInt8',
        2: 'writeUInt16BE',
        4: 'writeUInt32BE',
        8: 'writeBigUInt64BE',
      } as const
    )[bytes];

    if (typeof value === 'bigint') {
      if (bytes !== 8) {
        throw new Error('Invalid byte length for big integer');
      }

      const data = Buffer.alloc(bytes);
      data[writeMethod](value as any, 0);
      this.buffer = Buffer.concat([this.buffer, data]);
      this.offset += bytes;
    } else {
      if (bytes === 8) {
        throw new Error('Invalid byte length for integer');
      }

      const data = Buffer.alloc(bytes);
      data[writeMethod](value as any, 0);
      this.buffer = Buffer.concat([this.buffer, data]);
      this.offset += bytes;
    }
  }

  public writeUIntLE(value: number | bigint, bytes: StrictByteLength = 4) {
    const writeMethod = (
      {
        1: 'writeUInt8',
        2: 'writeUInt16LE',
        4: 'writeUInt32LE',
        8: 'writeBigUInt64LE',
      } as const
    )[bytes];

    if (typeof value === 'bigint') {
      if (bytes !== 8) {
        throw new Error('Invalid byte length for big integer');
      }

      const data = Buffer.alloc(bytes);
      data[writeMethod](value as any, 0);
      this.buffer = Buffer.concat([this.buffer, data]);
      this.offset += bytes;
    } else {
      if (bytes === 8) {
        throw new Error('Invalid byte length for integer');
      }

      const data = Buffer.alloc(bytes);
      data[writeMethod](value as any, 0);
      this.buffer = Buffer.concat([this.buffer, data]);
      this.offset += bytes;
    }
  }
}
