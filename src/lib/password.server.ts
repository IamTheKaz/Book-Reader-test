import { scrypt } from "@noble/hashes/scrypt.js";
import { bytesToHex, hexToBytes, randomBytes } from "@noble/hashes/utils.js";

const SCRYPT_OPTS = { N: 2 ** 15, r: 8, p: 1, dkLen: 32 };

/** Hash a password with a fresh random salt (scrypt, hex-encoded). */
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = bytesToHex(randomBytes(16));
  const hash = bytesToHex(scrypt(password, hexToBytes(salt), SCRYPT_OPTS));
  return { hash, salt };
}

/** Constant-time-ish comparison of a candidate against the stored hash. */
export function verifyPassword(password: string, salt: string, expected: string): boolean {
  const actual = bytesToHex(scrypt(password, hexToBytes(salt), SCRYPT_OPTS));
  return actual === expected;
}
