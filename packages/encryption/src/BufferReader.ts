import {Buffer} from 'buffer';

import {arrayify, reverseEndian} from './utils';
import {StrictByteLength} from './types';

/**
 * We don't need any more methods since it's just to read a total of 76 bytes buffer.
 */
export class BufferReader {
  public buffer: Buffer;
  public offset: number;

  constructor(buffer: string | Uint8Array | Buffer) {
    this.buffer = Buffer.from(arrayify(buffer));
    this.offset = 0;
  }

  public readBE(bytes: number) {
    const value = this.buffer.slice(this.offset, this.offset + bytes);
    this.offset += bytes;

    return value;
  }

  public readLE(bytes: number) {
    const value = this.buffer.slice(this.offset, this.offset + bytes);
    this.offset += bytes;

    return reverseEndian(value);
  }

  public readUIntBE<TBigInt extends boolean = true>(
    bytes: StrictByteLength = 4,
    bigInt: TBigInt = true as TBigInt,
  ): TBigInt extends true ? bigint : number {
    const data = `0x${this.readBE(bytes).toString('hex')}`;

    if (bigInt) return BigInt(data) as any;
    return parseInt(data, 16) as any;
  }

  public readUIntLE<TBigInt extends boolean = true>(
    bytes: StrictByteLength = 4,
    bigInt: TBigInt = true as TBigInt,
  ): TBigInt extends true ? bigint : number {
    const data = this.readLE(bytes).toString('hex');

    if (bigInt) return BigInt(`0x${data}`) as any;
    return parseInt(data, 16) as any;
  }

  public flush() {
    this.buffer = this.buffer.slice(this.offset);

    return this.buffer;
  }
}
