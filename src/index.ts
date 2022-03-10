import { DefaultAzureCredential, TokenCredential } from '@azure/identity'
import { KeyVaultSecret, SecretClient } from '@azure/keyvault-secrets'
import { ICachePlugin } from '@azure/msal-node'

/**
 * Cache Plugin configuration
 */

const noSecretValueError = 'No Secret Value'
const secretNotFound = 'SecretNotFound'

export default function keyVaultCache(
  keyVaultUrl: string,
  secretName: string = 'msal-cache',
  credential: TokenCredential = new DefaultAzureCredential()
): ICachePlugin {
  const client: SecretClient = new SecretClient(keyVaultUrl, credential)

  return {
    beforeCacheAccess: async cacheContext => {
      try {
        let secret: KeyVaultSecret = await client.getSecret(secretName)
  
        if (secret.value) {
          cacheContext.tokenCache.deserialize(secret.value)
        } else {
          throw new Error(noSecretValueError)
        }
      } catch (e: any) {
        if (e?.message === noSecretValueError || e?.code === secretNotFound) {
          await client.setSecret(secretName, cacheContext.tokenCache.serialize())
        } else {
          throw e
        }
      }
    },
    afterCacheAccess: async cacheContext => {
      if (cacheContext.cacheHasChanged) {
        await client.setSecret(secretName, cacheContext.tokenCache.serialize())
      }
    }
  }
}
