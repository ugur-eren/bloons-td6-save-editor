import {Buffer} from 'buffer/';

export type StrictByteLength = 1 | 2 | 4 | 8;

export type Bytes = string | Uint8Array | Buffer;

export type Json = string | number | boolean | null | Json[] | {[key: string]: Json};

export type ParsedFile = {
  data: Buffer;
  saveCount: number;
  version: Buffer;
  guid: Buffer;
  unknown1: Buffer;
  pwIdx: Buffer;
  salt: Buffer;
};

export type DecryptedFile = {
  content: Json;
  saveCount: number;
  version: string;
  guid: string;
  unknown1: string;
  pwIdx: string;
  salt: string;
};
