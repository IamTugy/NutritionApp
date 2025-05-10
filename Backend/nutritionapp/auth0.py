import os
import httpx
from fastapi import HTTPException
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Auth0 configuration
AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
AUTH0_CLIENT_ID = os.getenv("AUTH0_CLIENT_ID")
AUTH0_CLIENT_SECRET = os.getenv("AUTH0_CLIENT_SECRET")

async def get_auth0_management_token():
    """Get Auth0 Management API token."""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"https://{AUTH0_DOMAIN}/oauth/token",
            json={
                "client_id": AUTH0_CLIENT_ID,
                "client_secret": AUTH0_CLIENT_SECRET,
                "audience": f"https://{AUTH0_DOMAIN}/api/v2/",
                "grant_type": "client_credentials"
            }
        )
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to get Auth0 management token")
        return response.json()["access_token"]

async def get_users(search_query: str | None = None, user_ids: list[str] | None = None):
    """Fetch users from Auth0 with optional search query or specific user IDs."""
    try:
        token = await get_auth0_management_token()
        
        # Build the query URL
        url = f"https://{AUTH0_DOMAIN}/api/v2/users"
        params = {}
        
        if search_query:
            params["q"] = f"email:*{search_query}*"
            params["search_engine"] = "v3"
        elif user_ids and len(user_ids) > 0:
            params["q"] = f"user_id:({' OR '.join(user_ids)})"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                url,
                params=params,
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            )
            
            if response.status_code != 200:
                print(f"Auth0 API error response: {response.text}")
                raise HTTPException(status_code=response.status_code, detail=f"Failed to fetch users from Auth0: {response.text}")
            
            return response.json()
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 