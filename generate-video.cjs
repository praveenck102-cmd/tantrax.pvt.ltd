const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { execSync } = require('child_process');

const publicDir = path.join(__dirname, 'public');
const tempDir = path.join(__dirname, 'temp_video_frames');

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Common SVG styles & gradients
const commonDefs = `
  <defs>
    <!-- Background Gradient -->
    <radialGradient id="spaceBg" cx="50%" cy="45%" r="75%">
      <stop offset="0%" stop-color="#07152d" />
      <stop offset="45%" stop-color="#040b18" />
      <stop offset="85%" stop-color="#02050c" />
      <stop offset="100%" stop-color="#010307" />
    </radialGradient>

    <linearGradient id="cyberCyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0066ee" />
    </linearGradient>

    <linearGradient id="cyberEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>

    <linearGradient id="cyberOrange" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fb923c" />
      <stop offset="100%" stop-color="#ea580c" />
    </linearGradient>

    <!-- Flame Gradients -->
    <linearGradient id="fireOuterGrad" x1="20%" y1="100%" x2="70%" y2="0%">
      <stop offset="0%" stop-color="#d92400" />
      <stop offset="35%" stop-color="#ff5500" />
      <stop offset="70%" stop-color="#ff9900" />
      <stop offset="100%" stop-color="#ffcc00" />
    </linearGradient>
    <linearGradient id="fireMidGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff3300" />
      <stop offset="50%" stop-color="#ff7700" />
      <stop offset="85%" stop-color="#ffbb00" />
      <stop offset="100%" stop-color="#fff066" />
    </linearGradient>
    <linearGradient id="fireInnerGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6600" />
      <stop offset="60%" stop-color="#ffcc00" />
      <stop offset="100%" stop-color="#ffffff" />
    </linearGradient>

    <!-- T-Logo Blue Gradients -->
    <linearGradient id="tCrossbarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00e5ff" />
      <stop offset="40%" stop-color="#0088ff" />
      <stop offset="100%" stop-color="#0055dd" />
    </linearGradient>
    <linearGradient id="tCrossbarBevel" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#70f3ff" />
      <stop offset="60%" stop-color="#00aaff" />
      <stop offset="100%" stop-color="#0055cc" />
    </linearGradient>
    <linearGradient id="tStemUpperLeft" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0066ee" />
      <stop offset="100%" stop-color="#0099ff" />
    </linearGradient>
    <linearGradient id="tStemLower" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0077ff" />
      <stop offset="70%" stop-color="#0044cc" />
      <stop offset="100%" stop-color="#002b88" />
    </linearGradient>
    <linearGradient id="tStemRightBevel" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0044bb" />
      <stop offset="100%" stop-color="#002277" />
    </linearGradient>

    <!-- Chrome Text Gradient -->
    <linearGradient id="chromeText" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="40%" stop-color="#f1f5f9" />
      <stop offset="75%" stop-color="#cbd5e1" />
      <stop offset="100%" stop-color="#94a3b8" />
    </linearGradient>

    <!-- Filters -->
    <filter id="cyanGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="10" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="heavyGlow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="16" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
`;

// Helper: Starfield dots
function generateStars(count = 70) {
  let stars = '';
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * 1920);
    const y = Math.floor(Math.random() * 1080);
    const r = (Math.random() * 1.8 + 0.5).toFixed(1);
    const op = (Math.random() * 0.7 + 0.3).toFixed(2);
    stars += `<circle cx="${x}" cy="${y}" r="${r}" fill="#a5f3fc" opacity="${op}" />`;
  }
  return stars;
}

// SCENE 1: DEVELOPER IN SLEEK CYBER WORKSTATION (From video 00:00 - 00:01)
const scene1Svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  ${commonDefs}
  <rect width="1920" height="1080" fill="url(#spaceBg)" />

  <!-- Stars & Night Sky Window View -->
  <g opacity="0.85">${generateStars(80)}</g>
  
  <!-- Subtle Office Window Grid Lines -->
  <path d="M 0 350 L 1920 350 M 0 650 L 1920 650 M 400 0 L 400 1080 M 1500 0 L 1500 1080" stroke="rgba(56, 189, 248, 0.08)" stroke-width="1.5" stroke-dasharray="8 8" />

  <!-- City Skyline Silhouette at Window Bottom -->
  <path d="M 0 780 L 120 780 L 120 680 L 220 680 L 220 720 L 320 720 L 320 650 L 420 650 L 420 760 L 580 760 L 580 620 L 680 620 L 680 750 L 800 750 L 800 670 L 920 670 L 920 740 L 1920 740 L 1920 1080 L 0 1080 Z" fill="#040914" opacity="0.65" />
  
  <!-- Ambient Room Glow Behind Laptop -->
  <circle cx="960" cy="560" r="320" fill="rgba(0, 162, 255, 0.12)" filter="url(#heavyGlow)" />
  <circle cx="1150" cy="520" r="240" fill="rgba(56, 189, 248, 0.09)" filter="url(#heavyGlow)" />

  <!-- Executive Modern Desk Surface -->
  <polygon points="180,780 1740,780 1880,1080 40,1080" fill="#071120" stroke="rgba(56, 189, 248, 0.2)" stroke-width="2" />
  <line x1="220" y1="782" x2="1700" y2="782" stroke="#00e5ff" stroke-width="3.5" filter="url(#cyanGlow)" />

  <!-- Smartphone on Desk with glowing screen -->
  <rect x="520" y="830" width="90" height="150" rx="14" fill="#030712" stroke="rgba(56, 189, 248, 0.5)" stroke-width="1.5" transform="rotate(-15 520 830)" />
  <rect x="530" y="842" width="70" height="126" rx="8" fill="rgba(56, 189, 248, 0.18)" transform="rotate(-15 520 830)" />

  <!-- Minimalist Executive Chair Silhouette -->
  <path d="M 1260 480 Q 1340 460 1370 540 Q 1400 620 1390 750 Q 1380 840 1460 920 L 1400 1080 L 1180 1080 L 1230 860 Q 1230 760 1240 680 Q 1240 560 1260 480 Z" fill="#0b172a" stroke="rgba(255, 255, 255, 0.05)" stroke-width="1.5" />

  <!-- Developer Profile Silhouette -->
  <!-- Body/Suit Blazer -->
  <path d="M 1080 640 L 1260 620 L 1310 880 L 1020 880 Z" fill="#13233a" />
  <!-- Arm & Hands Typing on Laptop -->
  <path d="M 1160 650 Q 1060 680 940 760 L 910 750 Q 1020 670 1140 635 Z" fill="#1e3452" />
  <!-- Head & Hair Profile -->
  <circle cx="1180" cy="510" r="54" fill="#182c47" />
  <path d="M 1160 470 Q 1240 460 1230 520 Q 1200 540 1170 550 Q 1150 510 1160 470 Z" fill="#091424" />
  <!-- Collar & Tech Tie -->
  <polygon points="1135,570 1160,575 1148,630 1130,625" fill="#38bdf8" opacity="0.8" />

  <!-- Central High-Tech Laptop with Emitting Display Glow -->
  <!-- Screen Lid -->
  <polygon points="760,570 980,570 960,760 740,760" fill="#050d1a" stroke="#38bdf8" stroke-width="2" />
  <!-- Screen Display with Light Emission -->
  <polygon points="770,580 970,580 952,750 752,750" fill="url(#cyberCyan)" opacity="0.85" filter="url(#softGlow)" />
  <rect x="785" y="600" width="160" height="12" rx="4" fill="#ffffff" opacity="0.95" />
  <rect x="785" y="622" width="110" height="8" rx="3" fill="#ffffff" opacity="0.7" />
  <rect x="785" y="640" width="140" height="8" rx="3" fill="#ffffff" opacity="0.7" />
  <rect x="785" y="658" width="90" height="8" rx="3" fill="#ffffff" opacity="0.7" />
  <!-- Laptop Keyboard Base -->
  <polygon points="700,760 1000,760 1030,810 670,810" fill="#0f1f38" stroke="rgba(56, 189, 248, 0.5)" stroke-width="2" />
  <polygon points="730,765 970,765 990,800 710,800" fill="#081426" />

  <!-- Screen Glow Projecting Upward onto Developer -->
  <polygon points="770,580 970,580 1180,480 1120,460" fill="rgba(56, 189, 248, 0.12)" filter="url(#heavyGlow)" />

  <!-- Floating Holographic Neon Badges (from video: WEB, AI, SOFTWARE, AUTOMATION) -->
  <!-- Tag 1: WEB -->
  <g transform="translate(620, 440)">
    <rect x="0" y="0" width="130" height="46" rx="10" fill="rgba(8, 20, 42, 0.88)" stroke="#38bdf8" stroke-width="2" filter="url(#softGlow)" />
    <circle cx="22" cy="23" r="5" fill="#38bdf8" />
    <text x="74" y="29" fill="#ffffff" font-family="'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="700" text-anchor="middle" letter-spacing="1.5">WEB</text>
  </g>

  <!-- Tag 2: AI -->
  <g transform="translate(1320, 390)">
    <rect x="0" y="0" width="110" height="46" rx="10" fill="rgba(8, 20, 42, 0.88)" stroke="#34d399" stroke-width="2" filter="url(#softGlow)" />
    <circle cx="22" cy="23" r="5" fill="#34d399" />
    <text x="64" y="29" fill="#ffffff" font-family="'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="700" text-anchor="middle" letter-spacing="1.5">AI</text>
  </g>

  <!-- Tag 3: SOFTWARE -->
  <g transform="translate(420, 560)">
    <rect x="0" y="0" width="170" height="46" rx="10" fill="rgba(8, 20, 42, 0.88)" stroke="#38bdf8" stroke-width="2" filter="url(#softGlow)" />
    <circle cx="22" cy="23" r="5" fill="#38bdf8" />
    <text x="96" y="29" fill="#ffffff" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="700" text-anchor="middle" letter-spacing="1.5">SOFTWARE</text>
  </g>

  <!-- Tag 4: AUTOMATION (Right) -->
  <g transform="translate(1420, 520)">
    <rect x="0" y="0" width="190" height="46" rx="10" fill="rgba(8, 20, 42, 0.88)" stroke="#fb923c" stroke-width="2" filter="url(#softGlow)" />
    <circle cx="22" cy="23" r="5" fill="#fb923c" />
    <text x="108" y="29" fill="#ffffff" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="700" text-anchor="middle" letter-spacing="1.5">AUTOMATION</text>
  </g>

  <!-- Cyan Cybernetic Connecting Beams -->
  <path d="M 750 460 Q 860 520 860 580" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="4 4" opacity="0.6" />
  <path d="M 590 580 Q 700 620 770 660" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="4 4" opacity="0.6" />
  <path d="M 1320 410 Q 1060 480 970 580" fill="none" stroke="#34d399" stroke-width="1.8" stroke-dasharray="4 4" opacity="0.6" />
  <path d="M 1420 540 Q 1120 620 980 660" fill="none" stroke="#fb923c" stroke-width="1.8" stroke-dasharray="4 4" opacity="0.6" />
</svg>
`;

// SCENE 2: SAAS FULL-STACK LAPTOP PLATFORM (From video 00:02 - 00:03)
const scene2Svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  ${commonDefs}
  <rect width="1920" height="1080" fill="url(#spaceBg)" />

  <g opacity="0.75">${generateStars(60)}</g>

  <!-- Big Central Cyan Radiant Glow -->
  <circle cx="960" cy="540" r="460" fill="rgba(0, 140, 255, 0.16)" filter="url(#heavyGlow)" />
  <circle cx="960" cy="540" r="260" fill="rgba(56, 189, 248, 0.18)" filter="url(#heavyGlow)" />

  <!-- High-Tech Circuit Traces radiating to surrounding components -->
  <g stroke="#00e5ff" stroke-width="2.5" fill="none" filter="url(#softGlow)">
    <!-- To Top Left (WEBSITES) -->
    <path d="M 800 380 L 640 280 L 480 280" />
    <circle cx="480" cy="280" r="5" fill="#38bdf8" />

    <!-- To Top Mid-Left (WEB APPS) -->
    <path d="M 880 340 L 880 230 L 1020 230" />
    <circle cx="1020" cy="230" r="5" fill="#38bdf8" />

    <!-- To Top Right (APIs) -->
    <path d="M 1120 380 L 1280 280 L 1440 280" />
    <circle cx="1440" cy="280" r="5" fill="#38bdf8" />

    <!-- To Bottom Left (DASHBOARDS) -->
    <path d="M 780 720 L 620 840 L 460 840" />
    <circle cx="460" cy="840" r="5" fill="#34d399" />

    <!-- To Bottom Right (DATABASES) -->
    <path d="M 1140 720 L 1300 840 L 1460 840" />
    <circle cx="1460" cy="840" r="5" fill="#38bdf8" />
  </g>

  <!-- Laptop Stand / Shadow -->
  <ellipse cx="960" cy="830" rx="460" ry="40" fill="rgba(0,0,0,0.8)" filter="url(#softGlow)" />

  <!-- Center Laptop Shell -->
  <!-- Screen Frame -->
  <rect x="630" y="270" width="660" height="440" rx="20" fill="#040914" stroke="#1e3a6a" stroke-width="3" filter="url(#softGlow)" />
  <rect x="646" y="286" width="628" height="408" rx="10" fill="#061224" />

  <!-- Camera notch -->
  <circle cx="960" cy="278" r="4" fill="#38bdf8" opacity="0.8" />

  <!-- SaaS UI Inside Screen -->
  <!-- Sidebar -->
  <rect x="646" y="286" width="120" height="408" fill="#040b17" />
  <rect x="660" y="310" width="90" height="18" rx="4" fill="#0284c7" />
  <circle cx="672" cy="319" r="4" fill="#ffffff" />
  <rect x="660" y="348" width="80" height="10" rx="3" fill="#1e293b" />
  <rect x="660" y="372" width="70" height="10" rx="3" fill="#1e293b" />
  <rect x="660" y="396" width="85" height="10" rx="3" fill="#1e293b" />
  <rect x="660" y="420" width="75" height="10" rx="3" fill="#1e293b" />

  <!-- Main UI Header -->
  <rect x="766" y="286" width="508" height="50" fill="#07152b" />
  <text x="786" y="318" fill="#ffffff" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="700">TANTRAX SaaS Platform</text>
  <rect x="1140" y="302" width="110" height="20" rx="10" fill="#0284c7" opacity="0.6" />
  <text x="1195" y="316" fill="#38bdf8" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" text-anchor="middle">LIVE PRODUCTION</text>

  <!-- Metric KPI Cards inside Laptop -->
  <rect x="786" y="356" width="145" height="90" rx="8" fill="#0a1d38" stroke="#1e3a6a" stroke-width="1" />
  <text x="802" y="382" fill="#94a3b8" font-family="'Segoe UI', Roboto, sans-serif" font-size="11">Total Requests</text>
  <text x="802" y="415" fill="#38bdf8" font-family="'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="700">2.4M/s</text>

  <rect x="946" y="356" width="145" height="90" rx="8" fill="#0a1d38" stroke="#1e3a6a" stroke-width="1" />
  <text x="962" y="382" fill="#94a3b8" font-family="'Segoe UI', Roboto, sans-serif" font-size="11">System Uptime</text>
  <text x="962" y="415" fill="#34d399" font-family="'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="700">99.99%</text>

  <rect x="1106" y="356" width="145" height="90" rx="8" fill="#0a1d38" stroke="#1e3a6a" stroke-width="1" />
  <text x="1122" y="382" fill="#94a3b8" font-family="'Segoe UI', Roboto, sans-serif" font-size="11">Avg Latency</text>
  <text x="1122" y="415" fill="#fb923c" font-family="'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="700">18ms</text>

  <!-- Analytics Line Graph Chart -->
  <rect x="786" y="466" width="465" height="205" rx="8" fill="#081830" stroke="#1e3a6a" stroke-width="1" />
  <path d="M 810 630 Q 890 590 950 610 T 1060 520 T 1180 540 T 1230 490" fill="none" stroke="#00e5ff" stroke-width="3" filter="url(#cyanGlow)" />
  <path d="M 810 630 Q 890 590 950 610 T 1060 520 T 1180 540 T 1230 490 L 1230 650 L 810 650 Z" fill="rgba(0, 229, 255, 0.12)" />

  <!-- Laptop Keyboard Base -->
  <polygon points="560,710 1360,710 1440,790 480,790" fill="#0c1b33" stroke="rgba(56, 189, 248, 0.4)" stroke-width="2" />
  <polygon points="610,715 1310,715 1360,775 560,775" fill="#071324" />
  <rect x="870" y="730" width="180" height="40" rx="6" fill="#040b17" stroke="rgba(56, 189, 248, 0.3)" stroke-width="1" />

  <!-- Outer Floating High-Tech Cards (from video: WEBSITES, WEB APPS, APIs, DASHBOARDS, DATABASES) -->
  <!-- Top Left: WEBSITES -->
  <g transform="translate(300, 240)">
    <rect width="210" height="74" rx="14" fill="#07152b" stroke="#38bdf8" stroke-width="2" filter="url(#softGlow)" />
    <circle cx="36" cy="37" r="14" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" stroke-width="1.5" />
    <text x="36" y="42" fill="#38bdf8" font-size="16" text-anchor="middle">🌐</text>
    <text x="120" y="44" fill="#ffffff" font-family="'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="700">WEBSITES</text>
  </g>

  <!-- Top Mid-Right: WEB APPS -->
  <g transform="translate(940, 160)">
    <rect width="210" height="74" rx="14" fill="#07152b" stroke="#34d399" stroke-width="2" filter="url(#softGlow)" />
    <circle cx="36" cy="37" r="14" fill="rgba(52, 211, 153, 0.2)" stroke="#34d399" stroke-width="1.5" />
    <text x="36" y="42" fill="#34d399" font-size="16" text-anchor="middle">⚡</text>
    <text x="122" y="44" fill="#ffffff" font-family="'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="700">WEB APPS</text>
  </g>

  <!-- Top Right: APIs -->
  <g transform="translate(1420, 240)">
    <rect width="180" height="74" rx="14" fill="#07152b" stroke="#00e5ff" stroke-width="2" filter="url(#softGlow)" />
    <circle cx="36" cy="37" r="14" fill="rgba(0, 229, 255, 0.2)" stroke="#00e5ff" stroke-width="1.5" />
    <text x="36" y="42" fill="#00e5ff" font-size="16" text-anchor="middle">⚡</text>
    <text x="105" y="44" fill="#ffffff" font-family="'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="800">APIs</text>
  </g>

  <!-- Bottom Left: DASHBOARDS -->
  <g transform="translate(260, 800)">
    <rect width="230" height="74" rx="14" fill="#07152b" stroke="#38bdf8" stroke-width="2" filter="url(#softGlow)" />
    <circle cx="36" cy="37" r="14" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" stroke-width="1.5" />
    <text x="36" y="42" fill="#38bdf8" font-size="16" text-anchor="middle">📊</text>
    <text x="130" y="44" fill="#ffffff" font-family="'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="700">DASHBOARDS</text>
  </g>

  <!-- Bottom Right: DATABASES -->
  <g transform="translate(1420, 800)">
    <rect width="230" height="74" rx="14" fill="#07152b" stroke="#38bdf8" stroke-width="2" filter="url(#softGlow)" />
    <circle cx="36" cy="37" r="14" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" stroke-width="1.5" />
    <text x="36" y="42" fill="#38bdf8" font-size="16" text-anchor="middle">🗄️</text>
    <text x="130" y="44" fill="#ffffff" font-family="'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="700">DATABASES</text>
  </g>
</svg>
`;

// SCENE 3: THREE 3D HOLOGRAPHIC TIER CARDS (From video 00:04 - 00:05)
const scene3Svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  ${commonDefs}
  <rect width="1920" height="1080" fill="url(#spaceBg)" />

  <g opacity="0.7">${generateStars(70)}</g>

  <!-- Perspective Cyber Grid Floor -->
  <g stroke="rgba(56, 189, 248, 0.12)" stroke-width="1.2">
    <line x1="960" y1="540" x2="0" y2="1080" />
    <line x1="960" y1="540" x2="300" y2="1080" />
    <line x1="960" y1="540" x2="600" y2="1080" />
    <line x1="960" y1="540" x2="960" y2="1080" />
    <line x1="960" y1="540" x2="1320" y2="1080" />
    <line x1="960" y1="540" x2="1620" y2="1080" />
    <line x1="960" y1="540" x2="1920" y2="1080" />
    
    <line x1="200" y1="720" x2="1720" y2="720" />
    <line x1="100" y1="840" x2="1820" y2="840" />
    <line x1="0" y1="980" x2="1920" y2="980" />
  </g>

  <!-- Telemetry Numbers Floating (from video: 899.70, 02.50) -->
  <text x="320" y="240" fill="rgba(56, 189, 248, 0.45)" font-family="'Courier New', monospace" font-size="14">899.70 // CLUSTER_A</text>
  <text x="1560" y="240" fill="rgba(56, 189, 248, 0.45)" font-family="'Courier New', monospace" font-size="14">02.50 // SYNC_ACTIVE</text>
  <text x="320" y="860" fill="rgba(52, 211, 153, 0.45)" font-family="'Courier New', monospace" font-size="14">PORT: 8080 TLS_1.3</text>
  <text x="1560" y="860" fill="rgba(251, 146, 60, 0.45)" font-family="'Courier New', monospace" font-size="14">REGION: ASIA_PACIFIC</text>

  <!-- CARD 1: STARTER (Left) -->
  <g transform="translate(240, 280)">
    <rect width="420" height="520" rx="24" fill="#071328" stroke="rgba(56, 189, 248, 0.35)" stroke-width="2" filter="url(#softGlow)" />
    <!-- Top Cyber Accent -->
    <rect x="30" y="28" width="80" height="6" rx="3" fill="#38bdf8" />
    <!-- Card Icon Box -->
    <rect x="30" y="56" width="64" height="64" rx="14" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" stroke-width="1.5" />
    <text x="62" y="98" fill="#38bdf8" font-size="28" text-anchor="middle">⚙️</text>

    <!-- Title & Sub -->
    <text x="30" y="165" fill="#ffffff" font-family="'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="800" letter-spacing="1">STARTER</text>
    <text x="30" y="198" fill="#94a3b8" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="500">Digital Web Solutions</text>

    <!-- Checklist Items -->
    <g transform="translate(30, 240)">
      <circle cx="10" cy="10" r="8" fill="rgba(56, 189, 248, 0.2)" />
      <text x="10" y="14" fill="#38bdf8" font-size="11" text-anchor="middle">✓</text>
      <text x="32" y="15" fill="#cbd5e1" font-family="'Segoe UI', Roboto, sans-serif" font-size="15">Custom Landing Pages</text>

      <circle cx="10" cy="50" r="8" fill="rgba(56, 189, 248, 0.2)" />
      <text x="10" y="54" fill="#38bdf8" font-size="11" text-anchor="middle">✓</text>
      <text x="32" y="55" fill="#cbd5e1" font-family="'Segoe UI', Roboto, sans-serif" font-size="15">High-Speed Mobile Core</text>

      <circle cx="10" cy="90" r="8" fill="rgba(56, 189, 248, 0.2)" />
      <text x="10" y="94" fill="#38bdf8" font-size="11" text-anchor="middle">✓</text>
      <text x="32" y="95" fill="#cbd5e1" font-family="'Segoe UI', Roboto, sans-serif" font-size="15">SEO &amp; Cloud Deployment</text>
    </g>

    <!-- Bottom Button Pill -->
    <rect x="30" y="420" width="360" height="54" rx="27" fill="rgba(56, 189, 248, 0.12)" stroke="#38bdf8" stroke-width="1.5" />
    <text x="210" y="454" fill="#38bdf8" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="700" text-anchor="middle" letter-spacing="1">STARTER</text>
  </g>

  <!-- CARD 2: BUSINESS (Center - Prominent Glowing) -->
  <g transform="translate(740, 250)">
    <!-- Extra Heavy Glow for Centerpiece -->
    <rect width="440" height="560" rx="26" fill="#091b35" stroke="#34d399" stroke-width="3" filter="url(#cyanGlow)" />
    <!-- Top Highlight Badge -->
    <rect x="150" y="-14" width="140" height="28" rx="14" fill="#34d399" />
    <text x="220" y="5" fill="#022c22" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" text-anchor="middle" letter-spacing="1">POPULAR</text>

    <!-- Card Icon Box -->
    <rect x="34" y="60" width="70" height="70" rx="16" fill="rgba(52, 211, 153, 0.18)" stroke="#34d399" stroke-width="1.5" />
    <text x="69" y="106" fill="#34d399" font-size="32" text-anchor="middle">💻</text>

    <!-- Title & Sub -->
    <text x="34" y="175" fill="#ffffff" font-family="'Segoe UI', Roboto, sans-serif" font-size="30" font-weight="800" letter-spacing="1">BUSINESS</text>
    <text x="34" y="210" fill="#a7f3d0" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="500">Full-Stack Applications</text>

    <!-- Checklist Items -->
    <g transform="translate(34, 255)">
      <circle cx="10" cy="10" r="8" fill="rgba(52, 211, 153, 0.25)" />
      <text x="10" y="14" fill="#34d399" font-size="11" text-anchor="middle">✓</text>
      <text x="32" y="15" fill="#f1f5f9" font-family="'Segoe UI', Roboto, sans-serif" font-size="15">End-to-End Web App</text>

      <circle cx="10" cy="50" r="8" fill="rgba(52, 211, 153, 0.25)" />
      <text x="10" y="54" fill="#34d399" font-size="11" text-anchor="middle">✓</text>
      <text x="32" y="55" fill="#f1f5f9" font-family="'Segoe UI', Roboto, sans-serif" font-size="15">Postgres / Firebase DB</text>

      <circle cx="10" cy="90" r="8" fill="rgba(52, 211, 153, 0.25)" />
      <text x="10" y="94" fill="#34d399" font-size="11" text-anchor="middle">✓</text>
      <text x="32" y="95" fill="#f1f5f9" font-family="'Segoe UI', Roboto, sans-serif" font-size="15">Custom Dashboards &amp; APIs</text>
    </g>

    <!-- Bottom Button Pill (Filled) -->
    <rect x="34" y="455" width="372" height="58" rx="29" fill="#34d399" filter="url(#softGlow)" />
    <text x="220" y="491" fill="#022c22" font-family="'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="800" text-anchor="middle" letter-spacing="1">BUSINESS</text>
  </g>

  <!-- CARD 3: ENTERPRISE (Right) -->
  <g transform="translate(1260, 280)">
    <rect width="420" height="520" rx="24" fill="#071328" stroke="rgba(251, 146, 60, 0.35)" stroke-width="2" filter="url(#softGlow)" />
    <!-- Top Cyber Accent -->
    <rect x="30" y="28" width="80" height="6" rx="3" fill="#fb923c" />
    <!-- Card Icon Box -->
    <rect x="30" y="56" width="64" height="64" rx="14" fill="rgba(251, 146, 60, 0.15)" stroke="#fb923c" stroke-width="1.5" />
    <text x="62" y="98" fill="#fb923c" font-size="28" text-anchor="middle">☁️</text>

    <!-- Title & Sub -->
    <text x="30" y="165" fill="#ffffff" font-family="'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="800" letter-spacing="1">ENTERPRISE</text>
    <text x="30" y="198" fill="#94a3b8" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="500">AI • Automation • Cloud</text>

    <!-- Checklist Items -->
    <g transform="translate(30, 240)">
      <circle cx="10" cy="10" r="8" fill="rgba(251, 146, 60, 0.2)" />
      <text x="10" y="14" fill="#fb923c" font-size="11" text-anchor="middle">✓</text>
      <text x="32" y="15" fill="#cbd5e1" font-family="'Segoe UI', Roboto, sans-serif" font-size="15">Autonomous AI Workflows</text>

      <circle cx="10" cy="50" r="8" fill="rgba(251, 146, 60, 0.2)" />
      <text x="10" y="54" fill="#fb923c" font-size="11" text-anchor="middle">✓</text>
      <text x="32" y="55" fill="#cbd5e1" font-family="'Segoe UI', Roboto, sans-serif" font-size="15">Scalable Microservices</text>

      <circle cx="10" cy="90" r="8" fill="rgba(251, 146, 60, 0.2)" />
      <text x="10" y="94" fill="#fb923c" font-size="11" text-anchor="middle">✓</text>
      <text x="32" y="95" fill="#cbd5e1" font-family="'Segoe UI', Roboto, sans-serif" font-size="15">Enterprise SLA &amp; Support</text>
    </g>

    <!-- Bottom Button Pill -->
    <rect x="30" y="420" width="360" height="54" rx="27" fill="rgba(251, 146, 60, 0.12)" stroke="#fb923c" stroke-width="1.5" />
    <text x="210" y="454" fill="#fb923c" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="700" text-anchor="middle" letter-spacing="1">ENTERPRISE</text>
  </g>
</svg>
`;

// SCENE 4: HIGH-SPEED CYBER HIGHWAY DATA FLOW (From video 00:06 - 00:07)
const scene4Svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  ${commonDefs}
  <rect width="1920" height="1080" fill="url(#spaceBg)" />

  <!-- Speed Particle Lines converging to center (960, 540) -->
  <g stroke="#00e5ff" stroke-width="1.8" opacity="0.65" filter="url(#softGlow)">
    <line x1="100" y1="120" x2="880" y2="500" stroke-dasharray="16 12" />
    <line x1="300" y1="50" x2="900" y2="510" stroke-dasharray="24 18" />
    <line x1="1800" y1="120" x2="1040" y2="500" stroke-dasharray="16 12" />
    <line x1="1600" y1="50" x2="1020" y2="510" stroke-dasharray="20 14" />
    
    <line x1="100" y1="960" x2="880" y2="580" stroke-dasharray="20 10" />
    <line x1="400" y1="1020" x2="910" y2="570" stroke-dasharray="30 15" />
    <line x1="1800" y1="960" x2="1040" y2="580" stroke-dasharray="20 10" />
    <line x1="1500" y1="1020" x2="1010" y2="570" stroke-dasharray="24 16" />
  </g>

  <!-- Central Vortex Core -->
  <circle cx="960" cy="540" r="180" fill="rgba(0, 229, 255, 0.15)" filter="url(#heavyGlow)" />
  <circle cx="960" cy="540" r="60" fill="rgba(255, 255, 255, 0.4)" filter="url(#cyanGlow)" />

  <!-- The Pipeline Flow: FRONTEND -> BACKEND -> DATABASE -> API -> AUTOMATION -> AI -->
  <!-- Left Side: FRONTEND -->
  <g transform="translate(180, 480)">
    <rect width="180" height="60" rx="12" fill="#07152b" stroke="#38bdf8" stroke-width="2" filter="url(#softGlow)" />
    <text x="90" y="37" fill="#ffffff" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" text-anchor="middle" letter-spacing="1">FRONTEND</text>
  </g>

  <!-- Connector Line 1 -->
  <line x1="360" y1="510" x2="440" y2="510" stroke="#00e5ff" stroke-width="3" filter="url(#cyanGlow)" />
  <polygon points="440,510 430,504 430,516" fill="#00e5ff" />

  <!-- Node 2: BACKEND -->
  <g transform="translate(440, 480)">
    <rect width="180" height="60" rx="12" fill="#07152b" stroke="#38bdf8" stroke-width="2" filter="url(#softGlow)" />
    <text x="90" y="37" fill="#ffffff" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" text-anchor="middle" letter-spacing="1">BACKEND</text>
  </g>

  <!-- Connector Line 2 -->
  <line x1="620" y1="510" x2="700" y2="510" stroke="#00e5ff" stroke-width="3" filter="url(#cyanGlow)" />
  <polygon points="700,510 690,504 690,516" fill="#00e5ff" />

  <!-- Node 3: DATABASE -->
  <g transform="translate(700, 480)">
    <rect width="180" height="60" rx="12" fill="#07152b" stroke="#34d399" stroke-width="2" filter="url(#softGlow)" />
    <text x="90" y="37" fill="#ffffff" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" text-anchor="middle" letter-spacing="1">DATABASE</text>
  </g>

  <!-- Connector Line 3 to Center -->
  <line x1="880" y1="510" x2="940" y2="530" stroke="#00e5ff" stroke-width="3" filter="url(#cyanGlow)" />

  <!-- Center Hub: API -->
  <g transform="translate(890, 510)">
    <rect width="140" height="60" rx="30" fill="#0284c7" stroke="#38bdf8" stroke-width="2" filter="url(#heavyGlow)" />
    <text x="70" y="38" fill="#ffffff" font-family="'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="900" text-anchor="middle" letter-spacing="1.5">API</text>
  </g>

  <!-- Connector Line 4 from Center -->
  <line x1="1030" y1="540" x2="1100" y2="510" stroke="#00e5ff" stroke-width="3" filter="url(#cyanGlow)" />
  <polygon points="1100,510 1090,504 1090,516" fill="#00e5ff" />

  <!-- Node 5: AUTOMATION -->
  <g transform="translate(1100, 480)">
    <rect width="190" height="60" rx="12" fill="#07152b" stroke="#fb923c" stroke-width="2" filter="url(#softGlow)" />
    <text x="95" y="37" fill="#ffffff" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" text-anchor="middle" letter-spacing="1">AUTOMATION</text>
  </g>

  <!-- Connector Line 5 -->
  <line x1="1290" y1="510" x2="1370" y2="510" stroke="#fb923c" stroke-width="3" filter="url(#softGlow)" />
  <polygon points="1370,510 1360,504 1360,516" fill="#fb923c" />

  <!-- Node 6: AI / CLOUD (Right) -->
  <g transform="translate(1370, 480)">
    <rect width="170" height="60" rx="12" fill="#07152b" stroke="#38bdf8" stroke-width="2" filter="url(#softGlow)" />
    <text x="85" y="37" fill="#ffffff" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" text-anchor="middle" letter-spacing="1">AI / CLOUD</text>
  </g>

  <!-- Secondary Branches (from video) -->
  <g transform="translate(440, 340)">
    <rect width="180" height="50" rx="10" fill="#050d1a" stroke="rgba(56, 189, 248, 0.4)" stroke-width="1.5" />
    <text x="90" y="31" fill="#94a3b8" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" text-anchor="middle">FRONTEND</text>
    <line x1="90" y1="50" x2="90" y2="140" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4 4" />
  </g>

  <g transform="translate(1100, 620)">
    <rect width="190" height="50" rx="10" fill="#050d1a" stroke="rgba(251, 146, 60, 0.4)" stroke-width="1.5" />
    <text x="95" y="31" fill="#94a3b8" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" text-anchor="middle">AUTOMATION</text>
    <line x1="95" y1="0" x2="95" y2="-80" stroke="#fb923c" stroke-width="1.5" stroke-dasharray="4 4" />
  </g>
</svg>
`;

// SCENE 5: CINEMATIC 3D FIERY-BLUE TANTRAX EMBLEM REVEAL (From video 00:08 - 00:09)
const scene5Svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  ${commonDefs}
  <rect width="1920" height="1080" fill="url(#spaceBg)" />

  <g opacity="0.85">${generateStars(90)}</g>

  <!-- Radiant Fiery-Blue Core Glow behind Emblem -->
  <circle cx="960" cy="420" r="320" fill="rgba(0, 162, 255, 0.22)" filter="url(#heavyGlow)" />
  <circle cx="960" cy="420" r="160" fill="rgba(255, 102, 0, 0.2)" filter="url(#heavyGlow)" />

  <!-- EMBLEM GROUP (Centered) -->
  <g transform="translate(710, 140)">
    <!-- BACK FIRE TONGUES -->
    <path d="M 250 115 C 265 90 285 70 330 64 C 325 85 317 97 307 112 C 320 90 345 95 367 110 C 350 120 340 130 335 140 C 355 122 372 135 380 150 C 365 165 340 172 320 172 C 295 172 280 155 250 115 Z"
          fill="url(#fireOuterGrad)" filter="url(#softGlow)" />

    <path d="M 260 110 C 275 90 290 75 322 70 C 317 90 305 100 300 115 C 315 97 335 102 355 115 C 335 125 327 137 320 150 C 300 150 285 135 260 110 Z"
          fill="url(#fireMidGrad)" />

    <path d="M 267 105 C 280 90 292 80 312 77 C 305 95 295 105 290 115 C 305 102 320 107 335 117 C 317 127 307 135 295 140 C 282 132 272 120 267 105 Z"
          fill="url(#fireInnerGrad)" opacity="0.95" />

    <!-- 3D LETTER T - TOP CROSSBAR -->
    <!-- Top Chamfer Highlight -->
    <path d="M 130 140 L 152 110 L 367 110 L 337 140 Z" fill="url(#tCrossbarBevel)" filter="url(#softGlow)" />
    <!-- Front Face -->
    <path d="M 130 140 L 337 140 L 320 170 L 147 170 Z" fill="url(#tCrossbarGrad)" />

    <!-- Sharp 3D Wing Tips -->
    <path d="M 130 140 L 147 170 L 130 170 Z" fill="#0077dd" />
    <path d="M 337 140 L 367 110 L 350 140 Z" fill="#38bdf8" />
    <path d="M 337 140 L 350 140 L 320 170 Z" fill="#0044aa" />

    <!-- 3D LETTER T - VERTICAL STEM (Upper Segment) -->
    <path d="M 232 170 L 287 170 L 287 212 L 245 255 L 232 255 Z" fill="url(#tStemUpperLeft)" />
    <path d="M 272 170 L 287 170 L 287 212 L 272 227 Z" fill="url(#tStemRightBevel)" />

    <!-- 3D LETTER T - VERTICAL STEM (Lower Segment) -->
    <path d="M 232 285 L 287 230 L 287 280 L 232 335 Z" fill="url(#tStemLower)" filter="url(#softGlow)" />
    <path d="M 272 245 L 287 230 L 287 280 L 272 295 Z" fill="url(#tStemRightBevel)" />
  </g>

  <!-- BRAND TYPOGRAPHY: TANTRAX (Centered) -->
  <text x="960" y="580" fill="url(#chromeText)" font-family="'Segoe UI', 'Montserrat', Arial, sans-serif" font-size="82" font-weight="900" text-anchor="middle" letter-spacing="12" filter="url(#softGlow)">TANTRAX</text>

  <!-- Tagline Pill: IDEAS TO IMPACT -->
  <g transform="translate(810, 620)">
    <line x1="-80" y1="12" x2="-20" y2="12" stroke="#38bdf8" stroke-width="2" />
    <text x="150" y="18" fill="#38bdf8" font-family="'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="700" text-anchor="middle" letter-spacing="6">IDEAS TO IMPACT</text>
    <line x1="320" y1="12" x2="380" y2="12" stroke="#38bdf8" stroke-width="2" />
  </g>

  <!-- Core Pillars: BUILD. SCALE. INNOVATE. -->
  <text x="960" y="705" fill="#f8fafc" font-family="'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="800" text-anchor="middle" letter-spacing="4">BUILD. SCALE. INNOVATE.</text>

  <!-- Disciplines: WEB • SOFTWARE • AI • AUTOMATION -->
  <text x="960" y="750" fill="#94a3b8" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="600" text-anchor="middle" letter-spacing="3">WEB • SOFTWARE • AI • AUTOMATION</text>
</svg>
`;

async function main() {
  console.log('Rendering high-res SVG scene frames with sharp...');
  
  const scenes = [
    { svg: scene1Svg, name: 'scene1.png' },
    { svg: scene2Svg, name: 'scene2.png' },
    { svg: scene3Svg, name: 'scene3.png' },
    { svg: scene4Svg, name: 'scene4.png' },
    { svg: scene5Svg, name: 'scene5.png' }
  ];

  for (const sc of scenes) {
    const filePath = path.join(tempDir, sc.name);
    await sharp(Buffer.from(sc.svg))
      .resize(1920, 1080)
      .png({ quality: 95 })
      .toFile(filePath);
    console.log(`Saved ${sc.name}`);
  }

  // Also write poster frame (scene 5 / scene 1) to public/tantrax-hero-poster.jpg
  const posterPath = path.join(publicDir, 'tantrax-hero-poster.jpg');
  await sharp(Buffer.from(scene5Svg))
    .resize(1920, 1080)
    .jpeg({ quality: 85, progressive: true })
    .toFile(posterPath);
  console.log(`Saved poster to ${posterPath}`);

  // Now compile with ffmpeg into seamless MP4 video!
  // Each scene lasts ~2 seconds with a 0.5s smooth crossfade (xfade)
  // Total ~8-9s duration looping seamlessly
  const s1 = path.join(tempDir, 'scene1.png');
  const s2 = path.join(tempDir, 'scene2.png');
  const s3 = path.join(tempDir, 'scene3.png');
  const s4 = path.join(tempDir, 'scene4.png');
  const s5 = path.join(tempDir, 'scene5.png');

  const mp4Out = path.join(publicDir, 'tantrax-hero-bg.mp4');
  const webmOut = path.join(publicDir, 'tantrax-hero-bg.webm');

  console.log('Encoding with ffmpeg to tantrax-hero-bg.mp4...');

  // Use ffmpeg with xfade transitions:
  // scene1: 0-2.5s, xfade at 2.0s with scene2
  // scene2: xfade at 4.0s with scene3
  // scene3: xfade at 6.0s with scene4
  // scene4: xfade at 8.0s with scene5
  // scene5: xfade at 10.0s back to scene1 for seamless loop!
  const ffmpegCmd = `ffmpeg -y \
    -loop 1 -t 2.5 -i "${s1}" \
    -loop 1 -t 2.5 -i "${s2}" \
    -loop 1 -t 2.5 -i "${s3}" \
    -loop 1 -t 2.5 -i "${s4}" \
    -loop 1 -t 2.5 -i "${s5}" \
    -filter_complex "\
      [0:v][1:v]xfade=transition=fade:duration=0.5:offset=2.0[v01]; \
      [v01][2:v]xfade=transition=fade:duration=0.5:offset=4.0[v02]; \
      [v02][3:v]xfade=transition=fade:duration=0.5:offset=6.0[v03]; \
      [v03][4:v]xfade=transition=fade:duration=0.5:offset=8.0[vout]" \
    -map "[vout]" \
    -c:v libx264 -pix_fmt yuv420p -profile:v high -level 4.1 -movflags +faststart -r 30 -b:v 2200k \
    -an "${mp4Out}"`;

  execSync(ffmpegCmd, { stdio: 'inherit' });
  console.log(`Successfully generated ${mp4Out}`);

  // Also produce WebM version for browser compatibility and compression
  console.log('Encoding WebM version...');
  const ffmpegWebmCmd = `ffmpeg -y -i "${mp4Out}" -c:v libvpx -b:v 1500k -crf 20 -an "${webmOut}"`;
  try {
    execSync(ffmpegWebmCmd, { stdio: 'inherit' });
    console.log(`Successfully generated ${webmOut}`);
  } catch (err) {
    console.warn('WebM generation skipped or optional:', err.message);
  }

  console.log('Video generation complete!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
