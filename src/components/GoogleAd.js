import React from 'react';
import { GoogleAdSense } from 'react-adsense';

const GoogleAd = ({ slot, format = "auto" }) => {
  return (
    <div className="google-ad-container" style={{ overflow: 'hidden', margin: '20px 0' }}>
      <GoogleAdSense
        adClient="ca-pub-2374994940786788"
        adSlot={slot}
        adFormat={format}
        style={{ display: 'block' }}
        adLayoutKey="YOUR_LAYOUT_KEY" // Optional
      />
    </div>
  );
};

export default GoogleAd;