import crypto from 'crypto';
import { Resend } from 'resend';
import { sha256 } from '@noble/hashes/sha2.js';
import { sha512 } from '@noble/hashes/sha2.js';
import { chacha20poly1305 } from '@noble/ciphers/chacha.js';
import * as ed from '@noble/ed25519';

// Configure ed25519 to use sha512
ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));
ed.etc.sha512Async = async (...m) => sha512(ed.etc.concatBytes(...m));

// --- Configuration ---
const KEY_DERIVATION_SECRET = "undergrowth_license_key_v1_change_me_in_production";
const FIXED_NONCE_STR = "ug_lic_nonce";

const FEATURES = {
    community: ['local_auth', 'plugin_sandbox'],
    starter: ['local_auth', 'plugin_sandbox', 'no_badge', 'clean_export'],
    pro: ['local_auth', 'plugin_sandbox', 'unlimited_workflows', 'unlimited_history', 'unlimited_ai', 'no_badge', 'clean_export'],
    team: ['local_auth', 'plugin_sandbox', 'unlimited_workflows', 'unlimited_history', 'unlimited_ai', 'no_badge', 'clean_export', 'multi_user_auth', 'rbac', 'audit_export'],
    enterprise: ['local_auth', 'plugin_sandbox', 'unlimited_workflows', 'unlimited_history', 'unlimited_ai', 'no_badge', 'clean_export', 'multi_user_auth', 'rbac', 'audit_export', 'sso_oidc', 'volume_activation']
};

// Map LemonSqueezy variant names to editions
function mapVariantToEdition(variantName) {
    const name = (variantName || '').toLowerCase();
    if (name.includes('enterprise')) return 'enterprise';
    if (name.includes('team')) return 'team';
    if (name.includes('pro')) return 'pro';
    if (name.includes('starter')) return 'starter';
    return 'community';
}

// Get license duration based on edition
function getLicenseDurationYears(edition) {
    // All paid licenses are 1 year subscriptions
    return edition === 'community' ? 100 : 1;
}

// Verify LemonSqueezy webhook signature
function verifySignature(payload, signature, secret) {
    if (!signature || !secret) return false;
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(payload).digest('hex');
    try {
        return crypto.timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(digest)
        );
    } catch {
        return false;
    }
}

// Generate license file
async function generateLicenseFile(email, edition, variantName, licenseKey) {
    const issued = new Date().toISOString().split('T')[0];
    const expiresDate = new Date();
    expiresDate.setFullYear(expiresDate.getFullYear() + getLicenseDurationYears(edition));
    const expires = expiresDate.toISOString().split('T')[0];

    const header = {
        version: 2,
        edition,
        email,
        issued,
        expires,
        license_key: licenseKey,
        last_validated: new Date().toISOString(),
        variant_name: variantName
    };

    const payload = {
        features: FEATURES[edition] || FEATURES.community,
        entitlements: [],
        metadata: { source: 'lemonsqueezy_webhook' }
    };

    // Encrypt payload
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

    return JSON.stringify({
        header,
        payload: encryptedBase64,
        signature: signatureBase64
    }, null, 2);
}

export default async function handler(req, res) {
    // Only accept POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get raw body for signature verification
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const signature = req.headers['x-signature'];
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

    // Verify signature
    if (!verifySignature(rawBody, signature, secret)) {
        console.error('Invalid webhook signature');
        return res.status(401).json({ error: 'Invalid signature' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const eventName = body.meta?.event_name;

    // Only process order_created events
    if (eventName !== 'order_created') {
        console.log(`Ignoring event: ${eventName}`);
        return res.status(200).json({ message: 'Event ignored' });
    }

    try {
        // Extract order data
        const data = body.data;
        const attrs = data.attributes;
        const email = attrs.user_email;
        const licenseKey = attrs.first_order_item?.license_key || `LS-${data.id}`;
        const variantName = attrs.first_order_item?.variant_name || 'Unknown';

        if (!email) {
            console.error('No email in order data');
            return res.status(400).json({ error: 'No email in order' });
        }

        // Map variant to edition
        const edition = mapVariantToEdition(variantName);
        console.log(`Processing order for ${email}: ${variantName} -> ${edition}`);

        // Generate license file
        const licenseContent = await generateLicenseFile(email, edition, variantName, licenseKey);

        // Send email with license attached
        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey) {
            throw new Error("Server misconfiguration: Missing RESEND_API_KEY");
        }

        const resend = new Resend(resendApiKey);

        await resend.emails.send({
            from: 'Undergrowth <noreply@undergrowth.io>',
            to: email,
            subject: `Your Undergrowth ${edition.charAt(0).toUpperCase() + edition.slice(1)} License`,
            html: `
                <h2>Thank you for purchasing Undergrowth!</h2>
                <p>Your <strong>${variantName}</strong> license is attached to this email.</p>
                <h3>Installation Instructions</h3>
                <ol>
                    <li>Download the attached <code>license.undergrowth</code> file</li>
                    <li>Place it in one of these locations:
                        <ul>
                            <li><code>./license.undergrowth</code> (same directory as the binary)</li>
                            <li><code>./data/license.undergrowth</code></li>
                            <li>Linux: <code>~/.config/undergrowth/license.undergrowth</code></li>
                            <li>Windows: <code>%APPDATA%\\undergrowth\\license.undergrowth</code></li>
                        </ul>
                    </li>
                    <li>Restart Undergrowth</li>
                    <li>Verify with <code>undergrowth --license-info</code></li>
                </ol>
                <p>If you have any questions, reply to this email or visit <a href="https://undergrowth.io/docs">our documentation</a>.</p>
                <p>Happy automating!</p>
                <p>— The Undergrowth Team</p>
            `,
            attachments: [
                {
                    filename: 'license.undergrowth',
                    content: Buffer.from(licenseContent).toString('base64')
                }
            ]
        });

        console.log(`License emailed to ${email} for ${edition}`);
        return res.status(200).json({ success: true, email, edition });

    } catch (error) {
        console.error('Webhook error:', error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
