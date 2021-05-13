import { h } from '@stencil/core';

export default () => (
<svg id="square-8" width="116" height="116" viewBox="0 0 116 116" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_f)">
<g filter="url(#filter1_iii)">
<rect x="2" y="2" width="112" height="112" rx="32" fill="#FF928B"/>
</g>
<g style={{mixBlendMode:'overlay'}} opacity="0.8" filter="url(#filter2_f)">
<rect x="7.10571" y="7.10571" width="101.789" height="101.789" rx="29" stroke="url(#paint0_linear)" stroke-width="2"/>
</g>
</g>
<defs>
<filter id="filter0_f" x="0" y="0" width="116" height="116" filterUnits="userSpaceOnUse" color-interpolation-filters="s-rGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="1" result="effect1_foregroundBlur"/>
</filter>
<filter id="filter1_iii" x="-4" y="-4" width="124" height="124" filterUnits="userSpaceOnUse" color-interpolation-filters="s-rGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="-6" dy="-6"/>
<feGaussianBlur stdDeviation="6"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.779167 0 0 0 0 0.217458 0 0 0 0 0.185052 0 0 0 1 0"/>
<feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="6" dy="6"/>
<feGaussianBlur stdDeviation="6"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.775455 0 0 0 0 0.7625 0 0 0 0.8 0"/>
<feBlend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset/>
<feGaussianBlur stdDeviation="3"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0"/>
<feBlend mode="normal" in2="effect2_innerShadow" result="effect3_innerShadow"/>
</filter>
<filter id="filter2_f" x="5.10571" y="5.10571" width="105.789" height="105.789" filterUnits="userSpaceOnUse" color-interpolation-filters="s-rGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur"/>
</filter>
<linearGradient id="paint0_linear" x1="58" y1="6.10571" x2="58" y2="109.894" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
</defs>
</svg>
);