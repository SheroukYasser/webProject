# webProject
| Variable               | Description                                                                        | Example / Notes                                                            |
| ---------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `PORT`                 | The port number your server will run on.                                           | `5000` (default for local development)                                     |
| `DB_NAME`              | The name of your MySQL database.                                                   | `library_db`                                                               |
| `DB_USER`              | The MySQL database username.                                                       | `root`                                                                     |
| `DB_PASS`              | The password for your MySQL database user.                                         | Leave empty if no password, or `your_password`                             |
| `DB_HOST`              | The hostname of your MySQL database.                                               | `localhost` for local development, or an IP/URL if using a remote database |
| `DB_PORT`              | The port of your MySQL database.                                                   | `3306` (default MySQL port)                                                |
| `JWT_ACCESS_SECRET`    | Secret key used to sign **access tokens** for authentication.                      | Use a long random string like `somerandomsecret123!`                       |
| `JWT_REFRESH_SECRET`   | Secret key used to sign **refresh tokens**.                                        | Use a long random string different from `JWT_ACCESS_SECRET`                |
| `GOOGLE_CLIENT_ID`     | Your Google OAuth Client ID for Google login integration.                          | Provided by Google Cloud Console                                           |
| `GOOGLE_CLIENT_SECRET` | Your Google OAuth Client Secret.                                                   | Provided by Google Cloud Console                                           |
| `GOOGLE_CALLBACK_URL`  | The redirect URL after successful Google login.                                    | `http://localhost:5000/auth/google/callback` for local dev                 |
| `EMAIL_USER`           | The email address used to send emails (e.g., for notifications or password reset). | `your_email@gmail.com`                                                     |
| `EMAIL_PASS`           | The password or app-specific password for the email account.                       | For Gmail, generate an App Password if 2FA is enabled                      |
