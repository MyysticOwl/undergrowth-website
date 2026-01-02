
import { sha256 } from '@noble/hashes/sha2.js';
import { sha512 } from '@noble/hashes/sha2.js';
import { chacha20poly1305 } from '@noble/ciphers/chacha.js';
import * as ed from '@noble/ed25519';

// Configure ed25519 to use sha512 (required for @noble/ed25519)
ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));
ed.etc.sha512Async = async (...m) => sha512(ed.etc.concatBytes(...m));

// --- Configuration ---
const KEY_DERIVATION_SECRET = "undergrowth_license_key_v1_change_me_in_production";
const FIXED_NONCE_STR = "ug_lic_nonce";

const FEATURES = {
    community: ['local_auth', 'plugin_sandbox'],
    pro: ['local_auth', 'plugin_sandbox', 'unlimited_workflows', 'unlimited_history'],
    team: ['local_auth', 'plugin_sandbox', 'unlimited_workflows', 'unlimited_history', 'team_sharing', 'sso'],
    enterprise: ['local_auth', 'plugin_sandbox', 'unlimited_workflows', 'unlimited_history', 'team_sharing', 'sso', 'audit_logs', 'compliance_tools']
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Workaround: Vercel might parse body or not depending on content-type
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { email, license_key, machine_id } = body || {};

    if (!email || !license_key) {
        return res.status(400).json({ error: 'Email and License Key are required' });
    }

    try {
        // Determine Edition (Mock for now)
        const edition = 'pro';
        const variant_name = 'Pro License';

        // Dates
        const issued = new Date().toISOString().split('T')[0];
        const expiresDate = new Date();
        expiresDate.setFullYear(expiresDate.getFullYear() + 3);
        const expires = expiresDate.toISOString().split('T')[0];

        const header = {
            version: 2,
            edition,
            email,
            issued,
            expires,
            license_key,
            instance_id: machine_id || undefined,
            last_validated: new Date().toISOString(),
            variant_name
        };

        const payload = {
            features: FEATURES[edition] || FEATURES.community,
            entitlements: [],
            metadata: { source: 'web_activation' }
        };

        // Encrypt
        const encoder = new TextEncoder();
        const secretBytes = encoder.encode(KEY_DERIVATION_SECRET);
        const key = sha256(secretBytes);

        const nonce = new Uint8Array(12);
        const nonceSrc = encoder.encode(FIXED_NONCE_STR);
        nonce.set(nonceSrc.slice(0, 12));

        const payloadJson = JSON.stringify(payload);
        const payloadBytes = encoder.encode(payloadJson);

        const cipher = chacha20poly1305(key, nonce);
        const encryptedBytes = cipher.encrypt(payloadBytes);
        const encryptedBase64 = Buffer.from(encryptedBytes).toString('base64');

        // Sign
        const headerJson = JSON.stringify(header);
        const messagePreImage = encoder.encode(headerJson + encryptedBase64);
        const messageHash = sha256(messagePreImage);

        const privateKeyHex = process.env.PRIVATE_KEY_HEX;
        if (!privateKeyHex) {
            throw new Error("Server misconfiguration: Missing PRIVATE_KEY_HEX");
        }

        // Convert hex string to Uint8Array (required by @noble/ed25519 v3+)
        const hexToBytes = (hex) => {
            const bytes = new Uint8Array(hex.length / 2);
            for (let i = 0; i < bytes.length; i++) {
                bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
            }
            return bytes;
        };
        const privateKeyBytes = hexToBytes(privateKeyHex);

        const signatureBytes = await ed.sign(messageHash, privateKeyBytes);
        const signatureBase64 = Buffer.from(signatureBytes).toString('base64');

        const licenseFile = {
            header,
            payload: encryptedBase64,
            signature: signatureBase64
        };

        const finalJson = JSON.stringify(licenseFile, null, 2);

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="license_${edition}.undergrowth"`);
        res.status(200).send(finalJson);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
