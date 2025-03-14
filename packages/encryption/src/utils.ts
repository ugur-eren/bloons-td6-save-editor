import {Buffer} from 'buffer';
import {Bytes} from './types';

export const arrayify = (data: Bytes): Buffer => {
  if (data instanceof Buffer) return data;
  if (typeof data === 'string') return Buffer.from(data, 'hex');
  return Buffer.from(data);
};

export const reverseEndian = (data: Bytes): Buffer => {
  const buffer = arrayify(data);

  return buffer.reverse();
};
