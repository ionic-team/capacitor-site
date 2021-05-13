import { h } from '@stencil/core';

export default () => (
<svg id="square-3" width="112" height="112" viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_iii)">
<rect width="112" height="112" rx="24" fill="url(#paint0_linear)"/>
</g>
<g style={{mixBlendMode:'overlay'}} opacity="0.8" filter="url(#filter1_f)">
<rect x="3.57153" y="3.57153" width="104.857" height="104.857" rx="21" stroke="url(#paint1_linear)" stroke-width="2"/>
</g>
<g style={{mixBlendMode:'overlay'}} opacity="0.8" filter="url(#filter2_f)">
<path d="M12.2409 7.70602C12.9325 8.2065 11.11 10.1983 9.18012 12.8652C7.25026 15.5321 5.94391 17.8642 5.25229 17.3637C4.56067 16.8632 5.56446 14.2956 7.49431 11.6287C9.42417 8.96177 11.5493 7.20554 12.2409 7.70602Z" fill="white"/>
</g>
<defs>
<filter id="filter0_iii" x="-6" y="-6" width="124" height="124" filterUnits="userSpaceOnUse" color-interpolation-filters="s-rGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="-6" dy="-6"/>
<feGaussianBlur stdDeviation="6"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.366756 0 0 0 0 0.7 0 0 0 1 0"/>
<feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="6" dy="6"/>
<feGaussianBlur stdDeviation="6"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.516667 0 0 0 0 0.869564 0 0 0 0 1 0 0 0 0.9 0"/>
<feBlend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset/>
<feGaussianBlur stdDeviation="3"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0"/>
<feBlend mode="normal" in2="effect2_innerShadow" result="effect3_innerShadow"/>
</filter>
<filter id="filter1_f" x="1.57153" y="1.57153" width="108.857" height="108.857" filterUnits="userSpaceOnUse" color-interpolation-filters="s-rGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur"/>
</filter>
<filter id="filter2_f" x="3.03369" y="5.62085" width="11.3569" height="13.811" filterUnits="userSpaceOnUse" color-interpolation-filters="s-rGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="1" result="effect1_foregroundBlur"/>
</filter>
<linearGradient id="paint0_linear" x1="14.9333" y1="10.2667" x2="95.2" y2="97.0667" gradientUnits="userSpaceOnUse">
<stop stop-color="#76E3FF"/>
<stop offset="1" stop-color="#519CFF"/>
</linearGradient>
<linearGradient id="paint1_linear" x1="13.6819" y1="7.37309" x2="76.6427" y2="70.334" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
</defs>
</svg>
);