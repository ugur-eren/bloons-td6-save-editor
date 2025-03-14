import {cbc} from '@noble/ciphers/aes';
import {sha1} from '@noble/hashes/sha1';
import {pbkdf2Async} from '@noble/hashes/pbkdf2';
import {inflate, deflate} from 'pako';
import {Buffer} from 'buffer/';
import {prepareSaveFile, loadFile} from './file';
import {AES_IV_LENGTH, PBKDF2_ITERATIONS, PBKDF2_KEY_LENGTH} from './constants';
import {DecryptedFile} from './types';

export async function decrypt(file: Uint8Array, password: string): Promise<DecryptedFile> {
  const {salt, data, saveCount, guid, pwIdx, version, unknown1} = loadFile(file);

  const passwordBuffer = Buffer.from(password, 'utf-8');

  const derivedKey = await pbkdf2Async(sha1, passwordBuffer, salt, {
    c: PBKDF2_ITERATIONS,
    dkLen: PBKDF2_KEY_LENGTH + AES_IV_LENGTH,
  });
  const iv = derivedKey.slice(0, AES_IV_LENGTH);
  const key = derivedKey.slice(AES_IV_LENGTH);

  const cipher = cbc(key, iv);
  const decrypted = cipher.decrypt(data);

  const inflated = inflate(decrypted);

  const content = JSON.parse(
    Buffer.from(inflated)
      .toString('utf8')
      .replace(/\ufeff/g, ''),
  );

  return {
    content,
    saveCount,
    salt: salt.toString('hex'),
    guid: guid.toString('hex'),
    pwIdx: pwIdx.toString('hex'),
    version: version.toString('hex'),
    unknown1: unknown1.toString('hex'),
  };
}

export async function encrypt(data: DecryptedFile, password: string): Promise<Uint8Array> {
  const passwordBuffer = Buffer.from(password, 'utf-8');

  const derivedKey = await pbkdf2Async(sha1, passwordBuffer, Buffer.from(data.salt, 'hex'), {
    c: PBKDF2_ITERATIONS,
    dkLen: PBKDF2_KEY_LENGTH + AES_IV_LENGTH,
  });
  const iv = derivedKey.slice(0, AES_IV_LENGTH);
  const key = derivedKey.slice(AES_IV_LENGTH);

  const content = Buffer.from(`\ufeff${JSON.stringify(data.content)}`, 'utf-8');

  const deflated = deflate(content, {level: 3});

  const cipher = cbc(key, iv);
  const encryptedContent = cipher.encrypt(deflated);

  const file = prepareSaveFile(encryptedContent, data);

  return file;
}
