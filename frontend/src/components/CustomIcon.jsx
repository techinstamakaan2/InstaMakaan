import React from 'react';


function CustomIcon({ src, svg, className = "h-8 w-8", alt = "Logo" }) {
  // Option 1: Inline SVG string
  if (svg) {
    return (
      <div 
        className={className}
        dangerouslySetInnerHTML={{ __html: svg }}
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      />
    );
  }

  // Option 2: Image/SVG file (works with both public folder and imported assets)
  if (src) {
    return (
      <div className={`${className} flex items-center justify-center flex-shrink-0`}>
        <img 
          src={src} 
          alt={alt}
          className="w-full h-full object-contain"
          style={{ 
            display: 'block'
          }}
        />
      </div>
    );
  }

  // Default fallback
  return (
    <div className={`${className} bg-primary/10 rounded flex items-center justify-center`}>
      <span className="text-primary text-xs">Logo</span>
    </div>
  );
}

export default CustomIcon;
