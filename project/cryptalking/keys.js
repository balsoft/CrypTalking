/**
 * RSA keys generating 
 * 
 */
export function getKeyPair() {
    // FIXME: Math.random() is not cryptographically safe

    let p = Math.ceil(Math.random() * Math.pow(10, 1 + Math.random() * 0.5) + 10),
        q = Math.ceil(Math.random() * Math.pow(10, 1 + Math.random() * 0.5) + 10),
        n = p * q;
    let phi = (p - 1) * (q - 1),
        e = Math.ceil(Math.random() * 30) + (n > 300 ? 20 : 0),
        d = Math.ceil((1 + Math.ceil(Math.random() * 6 * phi)) / e);
    return {
        privateKey: {
            d,
            n
        },
        publicKey: {
            e,
            n
        }
    }
}