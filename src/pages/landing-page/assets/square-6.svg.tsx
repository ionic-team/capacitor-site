import { h } from '@stencil/core';
import { JSXBase } from '@stencil/core/internal';

export const Square6 = (props?: JSXBase.SVGAttributes ) => (
<svg width="112" height="112" viewBox="0 0 112 112" fill="none" {...props}>
<g opacity="0.5" filter="url(#square-6-filter0_f)">
<g filter="url(#square-6-filter1_ii)">
<rect x="12" y="12" width="88" height="88" rx="24" fill="url(#square-6-paint0_linear)"/>
</g>
<g style={{mixBlendMode:'overlay'}} opacity="0.5" filter="url(#square-6-filter2_f)">
<rect x="18" y="18" width="76" height="76" rx="21" stroke="url(#square-6-paint1_linear)" stroke-width="2"/>
</g>
</g>
<defs>
<filter id="square-6-filter0_f" x="0" y="0" width="112" height="112" filterUnits="userSpaceOnUse" color-interpolation-filters="s-rGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="6" result="effect1_foregroundBlur"/>
</filter>
<filter id="square-6-filter1_ii" x="6" y="6" width="100" height="100" filterUnits="userSpaceOnUse" color-interpolation-filters="s-rGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="-6" dy="-6"/>
<feGaussianBlur stdDeviation="6"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.725 0 0 0 0 0.116 0 0 0 0.7 0"/>
<feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="6" dy="6"/>
<feGaussianBlur stdDeviation="6"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.654167 0 0 0 0 1 0 0 0 0 0.77175 0 0 0 1 0"/>
<feBlend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow"/>
</filter>
<filter id="square-6-filter2_f" x="16" y="16" width="80" height="80" filterUnits="userSpaceOnUse" color-interpolation-filters="s-rGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur"/>
</filter>
<linearGradient id="square-6-paint0_linear" x1="17" y1="12" x2="105" y2="100" gradientUnits="userSpaceOnUse">
<stop stop-color="#72EDD0"/>
<stop offset="1" stop-color="#18E485"/>
</linearGradient>
<linearGradient id="square-6-paint1_linear" x1="56" y1="17" x2="56" y2="95" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
</defs>
</svg>
);