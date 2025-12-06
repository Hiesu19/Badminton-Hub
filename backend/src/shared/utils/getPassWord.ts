import { randomInt } from 'crypto';

export function getStrongPassword(length: number = 10): string {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*';
    const allChars = upper + lower + numbers + special;

    const password = [
        upper[randomInt(upper.length)],
        lower[randomInt(lower.length)],
        numbers[randomInt(numbers.length)],
        special[randomInt(special.length)],
    ];

    for (let i = password.length; i < length; i++) {
        password.push(allChars[randomInt(allChars.length)]);
    }

    for (let i = password.length - 1; i > 0; i--) {
        const j = randomInt(i + 1);
        [password[i], password[j]] = [password[j], password[i]];
    }

    return password.join('');
}
