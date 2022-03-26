export function bufferReadBigInt(buffer: Buffer, start = 0, end = buffer.length): bigint {
    const bufferAsHexString = buffer.slice(start, end).toString("hex");
    return BigInt(`0x${bufferAsHexString}`);
}
