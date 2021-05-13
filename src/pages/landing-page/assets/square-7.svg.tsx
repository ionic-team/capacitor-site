import { h } from '@stencil/core';

export default () => (
<svg id="square-7" width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
<g opacity="0.8" filter="url(#filter0_f)">
<g filter="url(#filter1_iii)">
<rect x="4" y="4" width="88" height="88" rx="24" fill="url(#paint0_linear)"/>
</g>
<g style={{mixBlendMode:'overlay'}} opacity="0.5" filter="url(#filter2_f)">
<rect x="10" y="10" width="76" height="76" rx="21" stroke="url(#paint1_linear)" stroke-width="2"/>
</g>
</g>
<defs>
<filter id="filter0_f" x="0" y="0" width="96" height="96" filterUnits="userSpaceOnUse" color-interpolation-filters="s-rGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur"/>
</filter>
<filter id="filter1_iii" x="-2" y="-2" width="100" height="100" filterUnits="userSpaceOnUse" color-interpolation-filters="s-rGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="-6" dy="-6"/>
<feGaussianBlur stdDeviation="6"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.309696 0 0 0 0 0.284375 0 0 0 0 0.8125 0 0 0 1 0"/>
<feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="6" dy="6"/>
<feGaussianBlur stdDeviation="6"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.654167 0 0 0 0 0.708947 0 0 0 0 1 0 0 0 1 0"/>
<feBlend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset/>
<feGaussianBlur stdDeviation="3"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0"/>
<feBlend mode="normal" in2="effect2_innerShadow" result="effect3_innerShadow"/>
</filter>
<filter id="filter2_f" x="8" y="8" width="80" height="80" filterUnits="userSpaceOnUse" color-interpolation-filters="s-rGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur"/>
</filter>
<linearGradient id="paint0_linear" x1="9" y1="4" x2="97" y2="92" gradientUnits="userSpaceOnUse">
<stop stop-color="#8C86FF"/>
<stop offset="1" stop-color="#625AF5"/>
</linearGradient>
<linearGradient id="paint1_linear" x1="48" y1="9" x2="48" y2="87" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
</defs>
</svg>
);