# Security Policy

We take the security of Open CMMS seriously. This document outlines how to report vulnerabilities and what to expect from the maintainer team.

## Supported Versions

Security fixes are provided for the latest stable release and the `main` branch. Older releases may receive fixes at the maintainers' discretion.

## Reporting a Vulnerability

- **Email**: Send a detailed report to [security@opencmms.dev](mailto:security@opencmms.dev).
- **Encryption**: If you require encryption, request our PGP key via email and we will respond within two business days.
- **Do not open public issues** describing the vulnerability.

Please include the following in your report:

1. Description of the vulnerability and potential impact.
2. Steps to reproduce, proof-of-concept, or exploit code if available.
3. Any mitigations you are aware of.
4. Your contact information for follow-up questions.

## Response Process

1. We will acknowledge receipt within **48 hours** and begin investigation.
2. The maintainers will work with you on a fix and coordinate release timing.
3. Once a fix is available, we will publish a security release and credit reporters (unless anonymity is requested).

## Security Best Practices

- Keep your Supabase keys secret and rotate them regularly.
- Restrict access to the Supabase service role key; do not ship it in client environments.
- Configure RLS policies for every table that stores tenant or user data.
- Use HTTPS in production and enforce secure cookies.

Thank you for helping keep Open CMMS and its users safe.
