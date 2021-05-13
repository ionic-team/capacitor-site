import { h } from '@stencil/core';

export default () => (
<svg id="square-5" width="66" height="66" viewBox="0 0 66 66" fill="none" xmlns="http://www.w3.org/2000/svg">
<g opacity="0.4" filter="url(#filter0_f)">
<g filter="url(#filter1_iii)">
<rect x="6" y="6" width="54" height="54" rx="14" fill="url(#paint0_linear)"/>
</g>
</g>
<defs>
<filter id="filter0_f" x="0" y="0" width="66" height="66" filterUnits="userSpaceOnUse" color-interpolation-filters="s-rGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="3" result="effect1_foregroundBlur"/>
</filter>
<filter id="filter1_iii" x="2" y="2" width="62" height="62" filterUnits="userSpaceOnUse" color-interpolation-filters="s-rGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="-4" dy="-4"/>
<feGaussianBlur stdDeviation="5"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.7625 0 0 0 0 0.494716 0 0 0 0 0.142969 0 0 0 0.8 0"/>
<feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="4" dy="4"/>
<feGaussianBlur stdDeviation="4"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.96453 0 0 0 0 0.654167 0 0 0 0.8 0"/>
<feBlend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset/>
<feGaussianBlur stdDeviation="3"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0"/>
<feBlend mode="normal" in2="effect2_innerShadow" result="effect3_innerShadow"/>
</filter>
<linearGradient id="paint0_linear" x1="9.06818" y1="6" x2="63.0682" y2="60" gradientUnits="userSpaceOnUse">
<stop stop-color="#FFDD86"/>
<stop offset="1" stop-color="#F3B949"/>
</linearGradient>
</defs>
</svg>
);