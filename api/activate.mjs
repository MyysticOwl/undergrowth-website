
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

// Import features from shared configuration (single source of truth)
import featuresConfig from '../shared/features.json' with { type: 'json' };

// Extract features by tier from the shared config
const FEATURES = Object.fromEntries(
    Object.entries(featuresConfig.tiers).map(([tier, config]) => [tier, config.features])
);


export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Workaround: Vercel might parse body or not depending on content-type
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    console.log('Activation Request Body:', JSON.stringify(body)); // DEBUG: Log payload
    const { email, license_key, machine_id } = body || {};

    if (!email || !license_key) {
        console.error('Missing required fields:', { email: !!email, license_key: !!license_key });
        return res.status(400).json({ error: 'Email and License Key are required' });
    }

    try {
        // --- LemonSqueezy Validation ---
        // Verify license key and get details
        const LS_API_KEY = process.env.LEMONSQUEEZY_API_KEY;
        // Allows testing without a key if specifically allowed (e.g. dev mode), but standard flow requires it.
        // For strictness, we might fallback to checking if it's set.

        let validatedLicense = null;
        let edition = 'community'; // Default fallback
        let variant_name = 'Community License';
        let expiryDateStr = null;
        let customerEmail = null;

        if (license_key.startsWith('ls_')) { // Heuristic checks if it looks like a LemonSqueezy key (often arbitrary though)
            // Actually, let's just always try to validate if it's not a special dev key
            // Or better: try to validate, and if it fails (and we are in prod), reject.
        }

        // We assume production always requires validation.
        // Mocking can be done via dependency injection or environment in tests.

        if (LS_API_KEY) {
            const response = await fetch('https://api.lemonsqueezy.com/v1/licenses/activate', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    license_key: license_key,
                    instance_name: machine_id || 'undergrowth-cli'
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                // If 4xx, it means invalid key usually
                console.error('LemonSqueezy Error:', response.status, errorText);
                return res.status(400).json({ error: 'Invalid or incorrect license key.' });
            }

            const data = await response.json();

            if (!data.activated && !data.valid) { // 'activated' is true if successful activation, 'valid' might be used purely for checking
                return res.status(403).json({ error: 'License key is not active or invalid.' });
            }

            validatedLicense = data;
            customerEmail = data.meta?.customer_email || data.user_email;
            variant_name = data.meta?.variant_name || 'Standard License';

            // Check expiry
            if (data.license_key?.status === 'expired') {
                return res.status(403).json({ error: 'License key has expired.' });
            }

            expiryDateStr = data.license_key?.expires_at; // ISO string

            // Email Check
            if (customerEmail && customerEmail.toLowerCase() !== email.toLowerCase()) {
                return res.status(403).json({ error: 'Email provided does not match the license owner.' });
            }

            // Map Variant to Edition
            const nameLower = variant_name.toLowerCase();
            if (nameLower.includes('team')) edition = 'team';
            else if (nameLower.includes('pro')) edition = 'pro';
            else if (nameLower.includes('starter')) edition = 'starter';
            else edition = 'community';

        } else {
            // Fallback for development/testing if no API key present (or valid dev keys)
            console.warn('LEMONSQUEEZY_API_KEY not set. Skipping validation (DEV MODE).');
            if (license_key === 'test_key') {
                edition = 'pro';
            } else {
                return res.status(500).json({ error: 'Server misconfiguration: Validation unavailable.' });
            }
        }

        // Dates
        const issued = new Date().toISOString().split('T')[0];
        // Use LemonSqueezy expiry if available, otherwise default logic
        let expires = null;
        if (expiryDateStr) {
            expires = expiryDateStr.split('T')[0];
        } else {
            const expiresDate = new Date();
            expiresDate.setFullYear(expiresDate.getFullYear() + (edition === 'community' ? 10 : 1));
            expires = expiresDate.toISOString().split('T')[0];
        }

        const header = {
            version: 1,
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
