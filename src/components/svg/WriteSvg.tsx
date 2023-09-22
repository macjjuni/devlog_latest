import { ISvg } from '@/types/svg'

const WriteSvg = ({ width = 50, height = 50, color = '#000000' }: ISvg) => {
  return (
    <svg width={`${width}px`} height={`${height}px`} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill={color}>
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
      <g id="SVGRepo_iconCarrier">
        <path d="M33,48H4a4,4,0,0,1-4-4V20L13,9H33a4,4,0,0,1,4,4V44A4,4,0,0,1,33,48Z" fill="#e7e9e9" />
        <path
          d="M47.2,7.32L40.66,0.78a2.81,2.81,0,0,0-3.89,0l-18,18a2,2,0,0,0,0,2.8l7.62,7.63a2,2,0,0,0,1.4.58h0a2,2,0,0,0,1.4-.58l18-18A2.76,2.76,0,0,0,47.2,7.32Z"
          fill="#f9d74a"
        />
        <rect x="36.12" y="2.31" width="4.25" height="14.84" transform="translate(4.32 29.89) rotate(-44.98)" fill="#ec5044" />
        <path d="M29.26,26.4l-7.67-7.68a2,2,0,0,0-3.35,1.06l-1.64,9.32a2,2,0,0,0,2.29,2.29l9.32-1.65A2,2,0,0,0,29.26,26.4Z" fill="#edcabb" />
        <path
          d="M20.56,30.14l-2.71-2.72a0.57,0.57,0,0,0-.58-0.14,0.58,0.58,0,0,0-.4.45l-0.31,1.75a1.68,1.68,0,0,0,1.65,2l0.29,0,1.75-.31A0.58,0.58,0,0,0,20.56,30.14Z"
          fill="#4d4d4d"
        />
        <path d="M0,20H11a2,2,0,0,0,2-2V9Z" fill="#a1a3a4" />
      </g>
    </svg>
  )
}

export default WriteSvg
