// Utility functions for generating placeholder images
export function getUserAvatar(userId: number): string {
  // Using DiceBear API for consistent user avatars
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;
}

export function getPostCoverImage(postId: number, title?: string): string {
  // Using Unsplash for beautiful, topic-relevant cover images
  const techTopics = [
    'programming,code', 'technology,computer', 'software,development', 
    'web,design', 'mobile,app', 'data,analytics', 'artificial,intelligence',
    'cybersecurity', 'cloud,computing', 'blockchain', 'startup,business'
  ];
  
  // More sophisticated topic selection based on post ID and title
  let topic = techTopics[postId % techTopics.length];
  
  // If title is provided, try to match it to a more relevant topic
  if (title) {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('design') || titleLower.includes('ui')) topic = 'web,design';
    else if (titleLower.includes('mobile') || titleLower.includes('app')) topic = 'mobile,app';
    else if (titleLower.includes('data') || titleLower.includes('analytics')) topic = 'data,analytics';
    else if (titleLower.includes('security')) topic = 'cybersecurity';
    else if (titleLower.includes('business') || titleLower.includes('startup')) topic = 'startup,business';
  }
  
  return `https://source.unsplash.com/1200x600/?${topic}&sig=${postId}`;
}

export function getPostThumbnail(postId: number, title?: string): string {
  // Smaller version for post cards - same logic as cover but smaller size
  const techTopics = [
    'programming,code', 'technology,computer', 'software,development', 
    'web,design', 'mobile,app', 'data,analytics', 'artificial,intelligence',
    'cybersecurity', 'cloud,computing', 'blockchain', 'startup,business'
  ];
  
  let topic = techTopics[postId % techTopics.length];
  
  if (title) {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('design') || titleLower.includes('ui')) topic = 'web,design';
    else if (titleLower.includes('mobile') || titleLower.includes('app')) topic = 'mobile,app';
    else if (titleLower.includes('data') || titleLower.includes('analytics')) topic = 'data,analytics';
    else if (titleLower.includes('security')) topic = 'cybersecurity';
    else if (titleLower.includes('business') || titleLower.includes('startup')) topic = 'startup,business';
  }
  
  return `https://source.unsplash.com/600x300/?${topic}&sig=${postId}`;
}

// Alternative: Generate SVG-based cover images for consistent branding
export function getPostCoverSVG(postId: number, title: string): string {
  const colors = [
    '#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', 
    '#ef4444', '#ec4899', '#84cc16', '#f97316', '#3b82f6'
  ];
  const bgColor = colors[postId % colors.length];
  const titleEncoded = encodeURIComponent(title.substring(0, 50));
  
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="1200" height="600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad${postId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${bgColor}88;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad${postId})"/>
      <text x="60" y="300" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="start">
        ${titleEncoded}
      </text>
      <circle cx="1050" cy="150" r="80" fill="white" opacity="0.1"/>
      <circle cx="950" cy="450" r="60" fill="white" opacity="0.1"/>
    </svg>
  `)}`
}

