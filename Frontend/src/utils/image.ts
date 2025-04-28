export function getProfileImageUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  
  // If it's a Google profile image, proxy it through our server
  if (url.includes('googleusercontent.com')) {
    const path = url.split('googleusercontent.com')[1];
    return `/googleusercontent${path}`;
  }
  
  return url;
} 