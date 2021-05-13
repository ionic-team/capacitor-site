import { h } from '@stencil/core';
import { JSXBase } from '@stencil/core/internal';

export const Square1 = (props?: JSXBase.SVGAttributes ) => (
<svg width="144" height="144" viewBox="0 0 144 144" fill="none" {...props}>
<g filter="url(#square-1-filter0_iii)">
<rect width="144" height="144" rx="32" fill="url(#square-1-paint0_linear)"/>
</g>
<g style={{mixBlendMode:'overlay'}} opacity="0.8" filter="url(#square-1-filter1_f)">
<rect x="4.30615" y="4.30615" width="135.388" height="135.388" rx="29" stroke="url(#square-1-paint1_linear)" stroke-width="2"/>
</g>
<g style={{mixBlendMode:'overlay'}} opacity="0.8" filter="url(#square-1-filter2_f)">
<path d="M135.527 18.8213C134.75 19.5975 132.593 16.8783 129.6 13.8855C126.607 10.8927 123.913 8.75959 124.689 7.98345C125.465 7.20731 128.52 9.00427 131.513 11.9971C134.506 14.9899 136.303 18.0452 135.527 18.8213Z" fill="url(#square-1-paint2_linear)"/>
</g>
<g style={{mixBlendMode:'overlay'}} opacity="0.8" filter="url(#square-1-filter3_f)">
<path d="M122.011 6.9456C121.825 7.55345 120.62 6.94413 119.06 6.4662C117.499 5.98826 116.173 5.8227 116.359 5.21485C116.545 4.60701 117.961 4.5017 119.522 4.97963C121.083 5.45757 122.197 6.33776 122.011 6.9456Z" fill="white"/>
</g>
<defs>
<filter id="square-1-filter0_iii" x="-6" y="-6" width="156" height="156" filterUnits="userSpaceOnUse" color-interpolation-filters="s-rGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="-6" dy="-6"/>
<feGaussianBlur stdDeviation="6"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.604167 0 0 0 0 0.196354 0 0 0 0 0.392104 0 0 0 1 0"/>
<feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="6" dy="6"/>
<feGaussianBlur stdDeviation="6"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.470833 0 0 0 0 0.947083 0 0 0 1 0"/>
<feBlend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset/>
<feGaussianBlur stdDeviation="3"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0"/>
<feBlend mode="normal" in2="effect2_innerShadow" result="effect3_innerShadow"/>
</filter>
<filter id="square-1-filter1_f" x="2.30615" y="2.30615" width="139.388" height="139.388" filterUnits="userSpaceOnUse" color-interpolation-filters="s-rGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur"/>
</filter>
<filter id="square-1-filter2_f" x="122.554" y="5.80273" width="15.1535" height="15.1526" filterUnits="userSpaceOnUse" color-interpolation-filters="s-rGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="1" result="effect1_foregroundBlur"/>
</filter>
<filter id="square-1-filter3_f" x="115.342" y="3.68018" width="7.68936" height="4.52034" filterUnits="userSpaceOnUse" color-interpolation-filters="s-rGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur"/>
</filter>
<linearGradient id="square-1-paint0_linear" x1="27.3863" y1="2.04376e-06" x2="87.4256" y2="125.872" gradientUnits="userSpaceOnUse">
<stop stop-color="#F47EB7"/>
<stop offset="1" stop-color="#E65580"/>
</linearGradient>
<linearGradient id="square-1-paint1_linear" x1="12.1656" y1="12.9054" x2="70.3793" y2="71.1191" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
<linearGradient id="square-1-paint2_linear" x1="136.286" y1="19.5427" x2="125.486" y2="8.22837" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0.2"/>
<stop offset="0.491891" stop-color="white"/>
<stop offset="1" stop-color="white" stop-opacity="0.2"/>
</linearGradient>
</defs>
</svg>
);