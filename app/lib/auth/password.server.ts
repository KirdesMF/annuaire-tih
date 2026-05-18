import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export const passwordHelpers = {
  hash: async (password: string) => {
    const salt = randomBytes(16).toString("hex");
    const hash = scryptSync(password, salt, 64).toString("hex");
    return `${salt}:${hash}`;
  },
  verify: async ({ hash, password }: { hash: string; password: string }) => {
    const [salt, key] = hash.split(":");

    if (!salt || !key) return false;

    const hashedBuffer = scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(key, "hex");

    if (hashedBuffer.length !== keyBuffer.length) return false;

    return timingSafeEqual(hashedBuffer, keyBuffer);
  },
};
