import {Buffer} from 'buffer/';
import {PBKDF2_SALT_LENGTH, UNIX_EPOCH_START} from './constants';
import {BufferReader} from './BufferReader';
import {DecryptedFile, ParsedFile} from './types';
import {BufferWriter} from './BufferWriter';

export function loadFile(file: Uint8Array): ParsedFile {
  const reader = new BufferReader(file);

  const version = reader.readLE(8);
  const saveCount = reader.readUIntLE(4, false);
  const guid = reader.readBE(16);
  const unknown1 = reader.readBE(8);

  reader.readLE(8); // datetime

  const pwIdx = reader.readLE(8);
  const salt = reader.readBE(PBKDF2_SALT_LENGTH);

  const data = reader.flush();

  return {data, salt, version, saveCount, guid, pwIdx, unknown1};
}

export function prepareSaveFile(encryptedContent: Uint8Array, data: DecryptedFile) {
  const parsed: Omit<ParsedFile, 'data'> = {
    version: Buffer.from(data.version, 'hex'),
    saveCount: data.saveCount,
    guid: Buffer.from(data.guid, 'hex'),
    pwIdx: Buffer.from(data.pwIdx, 'hex'),
    salt: Buffer.from(data.salt, 'hex'),
    unknown1: Buffer.from(data.unknown1, 'hex'),
  };

  const datetime = UNIX_EPOCH_START + BigInt(Date.now()) * BigInt(10_000);

  const writer = new BufferWriter(Buffer.alloc(0));

  writer.writeLE(parsed.version);
  writer.writeUIntLE(parsed.saveCount + 1, 4);
  writer.writeBE(parsed.guid);
  writer.writeBE(parsed.unknown1);
  writer.writeUIntLE(datetime, 8);
  writer.writeLE(parsed.pwIdx);
  writer.writeBE(parsed.salt);
  writer.writeBE(encryptedContent);

  return writer.buffer;
}
