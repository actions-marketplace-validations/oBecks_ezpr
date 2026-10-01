const IGNORED: RegExp[] = [
  /(^|\/)(package-lock\.json|yarn\.lock|pnpm-lock\.yaml|Cargo\.lock|poetry\.lock|Pipfile\.lock|composer\.lock|Gemfile\.lock|go\.sum|bun\.lockb?)$/,
  /(^|\/)(node_modules|vendor|dist|build|out|\.next|coverage)\//,
  /\.min\.(js|css)$/,
  /\.(map|snap)$/,
  /\.(png|jpe?g|gif|webp|ico|svg|pdf|zip|gz|tar|tgz|7z|jar|woff2?|ttf|otf|eot|mp[34]|mov|wasm|exe|dll|so|dylib|bin)$/i,
  /(^|\/)\.git\//,
];

const SECRET_FILES: RegExp[] = [
  /(^|\/)\.env(\..*)?$/,
  /\.(pem|key|p12|pfx|jks|keystore)$/i,
  /(^|\/)id_(rsa|dsa|ecdsa|ed25519)$/,
  /(^|\/)\.npmrc$/,
  /(^|\/)credentials(\.json)?$/i,
];

export type SkipReason = 'noise' | 'secret';

/** Returns why a path must not be sent to a Brain, or null if it may be. */
export function skipReason(path: string): SkipReason | null {
  if (SECRET_FILES.some((r) => r.test(path))) return 'secret';
  if (IGNORED.some((r) => r.test(path))) return 'noise';
  return null;
}
