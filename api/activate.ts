
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sha256 } from '@noble/hashes/sha256';
import { chacha20poly1305 } from '@noble/ciphers/chacha';
import * as ed from '@noble/ed25519';
import axios from 'axios';

// --- Configuration ---
// In production, these should be environment variables
const LEMON_SQUEEZY_API_URL = 'https://api.lemonsqueezy.com/v1';
// This matches the engine's embedded secret
const KEY_DERIVATION_SECRET = "undergrowth_license_key_v1_change_me_in_production";
const FIXED_NONCE_STR = "ug_lic_nonce";

// Feature Defines
const FEATURES = {
    community: ['local_auth', 'plugin_sandbox'],
    pro: ['local_auth', 'plugin_sandbox', 'unlimited_workflows', 'unlimited_history'],
    team: ['local_auth', 'plugin_sandbox', 'unlimited_workflows', 'unlimited_history', 'team_sharing', 'sso'],
    enterprise: ['local_auth', 'plugin_sandbox', 'unlimited_workflows', 'unlimited_history', 'team_sharing', 'sso', 'audit_logs', 'compliance_tools']
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, license_key, machine_id } = req.body;

    if (!email || !license_key) {
        return res.status(400).json({ error: 'Email and License Key are required' });
    }

    try {
        // 1. Verify with Lemon Squeezy
        // In a real scenario, you verify the key and get the order details to determine the Edition.
        // For this demo/offline-tool context, we'll simulate the lookup or trust the inputs if we can't verify.
        // Ideally: const lsData = await verifyLemonSqueezy(license_key);

        // MOCK: Determine Edition based on some logic or hardcode for now (e.g. Pro)
        // Real implementation would look up store_id/variant_id
        const edition = 'pro';
        const variant_name = 'Pro License';

        // 2. Prepare License Data
        const issued = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        // Expires: 3 years from now
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
            instance_id: machine_id || undefined, // Optional hardware lock
            last_validated: new Date().toISOString(),
            variant_name
        };

        const payload = {
            features: FEATURES[edition] || FEATURES.community,
            entitlements: [], // Can add plugin entitlements here
            metadata: { source: 'web_activation' }
        };

        // 3. Encrypt Payload (matches Rust crypto.rs)
        // Key Derivation: SHA256(Secret)
        const secretBytes = new TextEncoder().encode(KEY_DERIVATION_SECRET);
        const key = sha256(secretBytes);

        // Nonce must be 12 bytes
        const nonce = new Uint8Array(12);
        const nonceSrc = new TextEncoder().encode(FIXED_NONCE_STR);
        nonce.set(nonceSrc.slice(0, 12));

        const payloadJson = JSON.stringify(payload);
        const payloadBytes = new TextEncoder().encode(payloadJson);

        const cipher = chacha20poly1305(key, nonce);
        const encryptedBytes = cipher.encrypt(payloadBytes);
        const encryptedBase64 = Buffer.from(encryptedBytes).toString('base64');

        // 4. Sign License
        // Message: SHA256(HeaderJSON + EncryptedPayloadBase64)
        const headerJson = JSON.stringify(header);
        const messagePreImage = new TextEncoder().encode(headerJson + encryptedBase64);
        const messageHash = sha256(messagePreImage);

        // Private Key from Env
        const privateKeyHex = process.env.PRIVATE_KEY_HEX;
        if (!privateKeyHex) {
            throw new Error("Server misconfiguration: Missing PRIVATE_KEY_HEX");
        }

        const signatureBytes = await ed.sign(messageHash, privateKeyHex);
        const signatureBase64 = Buffer.from(signatureBytes).toString('base64');

        // 5. Construct Final JSON
        const licenseFile = {
            header,
            payload: encryptedBase64,
            signature: signatureBase64
        };

        // 6. Return as downloadable file content
        const finalJson = JSON.stringify(licenseFile, null, 2);

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="license_${edition}.undergrowth"`);
        res.status(200).send(finalJson);

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
