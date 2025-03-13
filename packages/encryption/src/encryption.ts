import {cbc} from '@noble/ciphers/aes';
import {sha1} from '@noble/hashes/sha1';
import {pbkdf2Async} from '@noble/hashes/pbkdf2';
import {inflate, deflate} from 'pako';
import {Buffer} from 'buffer/';
import {fillFile, loadFile} from './file';
import {AES_IV_LENGTH, PBKDF2_ITERATIONS, PBKDF2_KEY_LENGTH, PBKDF2_SALT_LENGTH} from './constants';
import {Json} from './types';

export async function decrypt(file: Uint8Array, password: string): Promise<Json> {
  const {salt, data} = loadFile(file);

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

  return JSON.parse(
    Buffer.from(inflated)
      .toString('utf8')
      .replace(/\ufeff/g, ''),
  );
}

export async function encrypt(data: Json, password: string): Promise<Uint8Array> {
  const salt = crypto.getRandomValues(new Uint8Array(PBKDF2_SALT_LENGTH));

  const passwordBuffer = Buffer.from(password, 'utf-8');

  const derivedKey = await pbkdf2Async(sha1, passwordBuffer, salt, {
    c: PBKDF2_ITERATIONS,
    dkLen: PBKDF2_KEY_LENGTH + AES_IV_LENGTH,
  });
  const iv = derivedKey.slice(0, AES_IV_LENGTH);
  const key = derivedKey.slice(AES_IV_LENGTH);

  const rawData = Buffer.from(`\ufeff${JSON.stringify(data)}`);

  const deflated = deflate(rawData, {level: 3});

  const cipher = cbc(key, iv);
  const encryptedData = cipher.encrypt(deflated);

  const file = fillFile(encryptedData, salt);

  return file;
}
