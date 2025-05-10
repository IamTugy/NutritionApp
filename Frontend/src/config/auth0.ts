export const auth0Config = {
  domain: "dev-haim44bkrab8ssbi.us.auth0.com",
  clientId: "hsJP493eiRF8ACwWAbfFFyUSUeKCaOUw",
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: `https://dev-haim44bkrab8ssbi.us.auth0.com/api/v2/`,
    scope: 'openid profile email read:users',
  },
}; 