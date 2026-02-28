/// <reference types="vite/client" />

interface ImportMetaEnv {
  // API Configuration
  readonly VITE_URI_BASE: string;
  readonly VITE_URI_SOCKET: string;
  readonly VITE_URI_SUPPORT: string;
  readonly VITE_URI_TIMEOUT: string;
  readonly VITE_API_URL: string;
  readonly VITE_CORE_URL: string;

  // ReCAPTCHA
  readonly VITE_RECAPTCHA_SITE_KEY: string;

  // File Upload
  readonly VITE_MAX_SIZE_FILE_BYTES: string;

  // Map
  readonly VITE_MAP_TILER: string;

  // SSO Configuration
  readonly VITE_SSO_TOKEN: string;
  readonly VITE_SSO_KEY: string;
  readonly VITE_SECRET_KEY_REQUEST: string;

  // Azure AD Configuration
  readonly VITE_AZURE_CLIENT_ID: string;
  readonly VITE_AZURE_TENANT_ID: string;
  readonly VITE_AZURE_REDIRECT_URI: string;
  readonly VITE_AZURE_POST_LOGOUT_REDIRECT_URI: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
