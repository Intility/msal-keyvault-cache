const { DefaultAzureCredential } = require('@azure/identity')
const { SecretClient } = require('@azure/keyvault-secrets')

/**
 * Cache Plugin configuration
 */

const noSecretValueError = 'No Secret Value'
const secretNotFound = 'SecretNotFound'

module.exports = function keyVaultCache(
  keyVaultUrl,
  secretName = 'msal-cache',
  credential = new DefaultAzureCredential()
) {
  const client = new SecretClient(keyVaultUrl, credential)

  const beforeCacheAccess = async cacheContext => {
    try {
      let secret = await client.getSecret(secretName)

      if (secret.value) {
        cacheContext.tokenCache.deserialize(secret.value)
      } else {
        throw new Error(noSecretValueError)
      }
    } catch (e) {
      if (e?.message === noSecretValueError || e?.code === secretNotFound) {
        await client.setSecret(secretName, cacheContext.tokenCache.serialize())
      } else {
        throw e
      }
    }
  }
  const afterCacheAccess = async cacheContext => {
    if (cacheContext.cacheHasChanged) {
      await client.setSecret(secretName, cacheContext.tokenCache.serialize())
    }
  }

  return {
    beforeCacheAccess,
    afterCacheAccess
  }
}
