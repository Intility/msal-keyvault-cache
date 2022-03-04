<h1 align="center">
  <img src="https://avatars.githubusercontent.com/u/35199565" width="124px"/><br/>
  @intility/msal-keyvault-cache
</h1>

<p align="center">
  A cache for @azure/msal-node that uses Azure KeyVault as a store. 
</p>

<p align="center">
  <a href="https://github.com/Intility/msal-keyvault-cache/actions">
    <img alt="pipeline" src="https://github.com/Intility/msal-keyvault-cache/actions/workflows/publish.yml/badge.svg" style="max-width:100%;" />
  </a>
  <a href="https://www.npmjs.com/package/@intility/msal-keyvault-cache">
    <img alt="package version" src="https://img.shields.io/npm/v/@intility/msal-keyvault-cache?label=%40intility%2Fmsal-keyvault-cache" style="max-width:100%;" />
  </a>
</p>

## Usage

Install with

```
npm install @intility/msal-keyvault-cache
```

Then, initialize the cache and use it in your client configuration

```js
import { PublicClientApplication } from "@azure/msal-node";
import keyVaultCache from "@intility/msal-keyvault-cache";

let cachePlugin = keyVaultCache("https://YOUR_KEYVAULT_HERE.vault.azure.net/");

let publicClientConfig = {
  auth: {
    clientId: "CLIENT_ID",
    authority: "https://login.microsoftonline.com/TENANT_ID",
  },
  cache: {
    cachePlugin,
  },
};

let publicClientApplication = new PublicClientApplication(publicClientConfig);
```

By default, it will authenticate to the KeyVault by using [`DefaultAzureCredential` from '@azure/identity'](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/identity/identity/README.md#defaultazurecredential). This means you can authenticate a number of ways. In CI you can use [environment variables](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/identity/identity/README.md#defaultazurecredential), and locally you can use the Azure CLI.

### Syntax

```js
let cachePlugin = keyVaultCache(keyVaultUrl [, secretName, credential])
```

### Parameters

#### `keyVaultUrl`

A JavaScript string containing the url to your Azure KeyVault.

#### `secretName` (optional)

- Default Value: `'msal-cache'`

A JavaScript string containing the name of the secret.

#### `credential` (optional)

- Default Value: `new DefaultAzureCredential()`

A [`Credential Class`](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/identity/identity/README.md#credential-classes) used to authenticate to the Azure KeyVault.

### Return value

A `cachePlugin` that can be used in a `@azure/msal-node` Client Configuration.
