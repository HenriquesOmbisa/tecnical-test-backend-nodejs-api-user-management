import { injectable } from "tsyringe";
import crypto from "crypto";

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;

@injectable()
export class PasswordService {
    async hash(password: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const salt = crypto.randomBytes(SALT_LENGTH).toString("hex");
            crypto.scrypt(password, salt, KEY_LENGTH, (err, key) => {
                if (err) reject(err);
                else resolve(`${salt}:${key.toString("hex")}`);
            });
        });
    }

    async verify(password: string, hash: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const [salt, key] = hash.split(":");
            crypto.scrypt(password, salt!, KEY_LENGTH, (err, derivedKey) => {
                if (err) reject(err);
                else resolve(derivedKey.toString("hex") === key);
            });
        });
    }
}
