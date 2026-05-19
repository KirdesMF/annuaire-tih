import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

async function derivePasswordKey(password: string, salt: string) {
  return (await scryptAsync(password, salt, 64)) as Buffer;
}

export const passwordHelpers = {
  hash: async (password: string) => {
    const salt = randomBytes(16).toString("hex");
    const hash = (await derivePasswordKey(password, salt)).toString("hex");
    return `${salt}:${hash}`;
  },
  verify: async ({ hash, password }: { hash: string; password: string }) => {
    const [salt, key] = hash.split(":");

    if (!salt || !key) return false;

    const hashedBuffer = await derivePasswordKey(password, salt);
    const keyBuffer = Buffer.from(key, "hex");

    if (hashedBuffer.length !== keyBuffer.length) return false;

    return timingSafeEqual(hashedBuffer, keyBuffer);
  },
};
