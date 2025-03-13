import {HEADER_LENGTH, PW_LENGTH, PBKDF2_SALT_LENGTH} from './constants';

export function loadFile(file: Uint8Array) {
  const buffer = file.slice(HEADER_LENGTH + PW_LENGTH);

  const salt = buffer.slice(0, PBKDF2_SALT_LENGTH);
  const data = buffer.slice(PBKDF2_SALT_LENGTH);

  return {salt, data};
}

export function fillFile(data: Uint8Array, salt: Uint8Array) {
  const header = crypto.getRandomValues(new Uint8Array(HEADER_LENGTH));
  const pw = new Uint8Array(PW_LENGTH).fill(0);
  const buffer = new Uint8Array(header.length + PW_LENGTH + salt.length + data.length);

  let offset = 0;

  buffer.set(header, offset);
  offset += header.length;

  buffer.set(pw, offset);
  offset += PW_LENGTH;

  buffer.set(salt, offset);
  offset += salt.length;

  buffer.set(data, offset);
  offset += data.length;

  return buffer;
}
