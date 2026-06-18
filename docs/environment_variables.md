# Environment Variables

The GRAVOEDGE web application reads configuration from environment
variables. Missing critical values are validated at startup by
`web_app.config_validator.assert_valid_config`; the application
will fail to start in production if any required variable is missing.

## Required in production

| Variable             | Purpose                                                    |
|----------------------|------------------------------------------------------------|
| `DB_USER`            | PostgreSQL username                                        |
| `DB_PASSWORD`        | PostgreSQL password                                        |
| `DB_HOST`            | PostgreSQL host                                            |
| `DB_NAME`            | PostgreSQL database name                                   |
| `SESSION_SECRET_KEY` | Secret used to sign session cookies (min 32 chars)         |
| `SENTRY_DSN`         | Sentry DSN for error tracking                              |

## Optional

| Variable                  | Purpose                                                     |
|---------------------------|-------------------------------------------------------------|
| `CORS_ORIGINS`            | Comma-separated allowed frontend origins                    |
| `DB_PORT`                 | PostgreSQL port (default `5432`)                            |
| `ENV_VERSION`             | `PROD` enables production-only behaviour                    |
| `STELLAR_HORIZON_URL`     | Stellar Horizon endpoint                                    |
| `STELLAR_SOROBAN_RPC_URL` | Soroban RPC endpoint                                        |

## Generating a session secret

```sh
python -c "import os; print(os.urandom(32).hex())"
```

## Behaviour in development

In development (`ENV_VERSION != "PROD"`) the application does not
require any of the variables above. Missing optional variables
(e.g. `SENTRY_DSN`) only produce a warning in the logs.

If `CORS_ORIGINS` is unset, the API allows requests from
`http://localhost:3000` for local development. Set it explicitly in
production, for example:

```sh
CORS_ORIGINS="https://gravoedge.xyz,https://app.gravoedge.xyz"
```
