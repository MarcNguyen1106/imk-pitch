// Original line icons on a 48 px grid: 3 px strokes, rounded caps, steel with gold accents.
import React from 'react';
import {C} from '../theme';

export type IconName =
	| 'leaf' | 'chain' | 'handshake' | 'ear' | 'warning' | 'magnifier' | 'phinCup' | 'bean' | 'clipboard'
	| 'speech' | 'tag' | 'cookie' | 'pod' | 'qr' | 'pin' | 'calendar' | 'ship' | 'cart' | 'padlock'
	| 'check' | 'cross' | 'ab' | 'blindfold' | 'people' | 'flask' | 'rocket' | 'store' | 'box' | 'gift' | 'globe';

export const Icon: React.FC<{name: IconName; size?: number; color?: string; accent?: string; style?: React.CSSProperties; draw?: number}> = ({
	name,
	size = 48,
	color = C.steel,
	accent = C.gold,
	style,
	draw = 1,
}) => {
	const s = {fill: 'none', stroke: color, strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round'} as const;
	const a = {...s, stroke: accent};
	const dash = draw < 1 ? {pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - draw} : {};
	const P = (d: string, accentStroke = false) => <path d={d} {...(accentStroke ? a : s)} {...dash} />;
	let g: React.ReactNode = null;
	switch (name) {
		case 'leaf':
			g = <>{P('M10 38 C10 20 22 10 38 10 C38 26 28 38 10 38 Z')}{P('M10 38 L28 20', true)}</>;
			break;
		case 'chain':
			g = <>{P('M20 28 l-4 4 a6 6 0 0 1 -8.5 -8.5 l6 -6 a6 6 0 0 1 8.5 0')}{P('M28 20 l4 -4 a6 6 0 0 1 8.5 8.5 l-6 6 a6 6 0 0 1 -8.5 0')}{P('M19 29 L29 19', true)}</>;
			break;
		case 'handshake':
			g = <>{P('M4 20 L12 14 L20 18 L28 14 L36 14 L44 20')}{P('M12 26 L20 34 Q23 37 26 34 L36 24 L28 18 L22 22 Q19 24 17 22', true)}{P('M4 20 L12 28 M44 20 L36 28')}</>;
			break;
		case 'ear':
			g = <>{P('M16 18 a10 10 0 1 1 20 0 c0 8 -8 9 -8 16 a6 6 0 0 1 -12 0')}{P('M22 20 a4 4 0 1 1 8 0 c0 3 -3 4 -3 6', true)}</>;
			break;
		case 'warning':
			g = <>{P('M24 6 L44 40 H4 Z')}{P('M24 18 V28', true)}{P('M24 34 V34.5', true)}</>;
			break;
		case 'magnifier':
			g = <>{<circle cx={20} cy={20} r={12} {...s} />}{P('M29 29 L42 42', true)}</>;
			break;
		case 'phinCup':
			g = <>{P('M12 12 H36 M14 12 V22 H34 V12')}{P('M8 22 H40')}{P('M14 26 L17 42 H31 L34 26')}{P('M24 30 V34', true)}</>;
			break;
		case 'bean':
			g = <>{<ellipse cx={24} cy={24} rx={12} ry={17} transform="rotate(30 24 24)" {...s} />}{P('M18 12 C26 20 22 28 30 36', true)}</>;
			break;
		case 'clipboard':
			g = <>{P('M12 10 H36 V42 H12 Z')}{P('M18 6 H30 V12 H18 Z')}{P('M18 22 L21 25 L27 19', true)}{P('M18 33 H30')}</>;
			break;
		case 'speech':
			g = <>{P('M6 10 H42 V32 H22 L12 40 V32 H6 Z')}{P('M14 19 H34 M14 25 H26', true)}</>;
			break;
		case 'tag':
			g = <>{P('M6 24 L24 6 H42 V24 L24 42 Z')}{<circle cx={34} cy={14} r={3} {...a} />}</>;
			break;
		case 'cookie':
			g = <>{<circle cx={24} cy={24} r={17} {...s} />}{<circle cx={18} cy={19} r={2} {...a} />}{<circle cx={29} cy={17} r={2} {...a} />}{<circle cx={27} cy={30} r={2} {...a} />}{<circle cx={17} cy={30} r={1.5} {...a} />}</>;
			break;
		case 'pod':
			g = <>{P('M10 40 C14 24 22 12 38 8 C36 24 28 36 10 40 Z')}{P('M16 34 L32 14', true)}{<circle cx={20} cy={30} r={1.6} {...a} />}{<circle cx={25} cy={24} r={1.6} {...a} />}{<circle cx={30} cy={18} r={1.6} {...a} />}</>;
			break;
		case 'qr':
			g = <>{P('M6 6 H18 V18 H6 Z M30 6 H42 V18 H30 Z M6 30 H18 V42 H6 Z')}{P('M30 30 H34 M38 30 H42 V36 M30 36 V42 H36 M42 42 V42', true)}</>;
			break;
		case 'pin':
			g = <>{P('M24 44 C14 30 10 24 10 18 a14 14 0 0 1 28 0 c0 6 -4 12 -14 26 Z')}{<circle cx={24} cy={18} r={5} {...a} />}</>;
			break;
		case 'calendar':
			g = <>{P('M6 10 H42 V42 H6 Z M6 18 H42 M16 6 V14 M32 6 V14')}{P('M14 26 H20 M28 26 H34 M14 34 H20', true)}</>;
			break;
		case 'ship':
			g = <>{P('M6 30 H42 L36 40 H12 Z')}{P('M14 30 V20 H34 V30 M24 20 V10', true)}{P('M4 44 Q10 41 16 44 T28 44 T40 44')}</>;
			break;
		case 'cart':
			g = <>{P('M4 8 H10 L16 32 H38 L42 14 H12')}{<circle cx={18} cy={40} r={3} {...a} />}{<circle cx={35} cy={40} r={3} {...a} />}</>;
			break;
		case 'padlock':
			g = <>{P('M10 22 H38 V42 H10 Z')}{P('M16 22 V16 a8 8 0 0 1 16 0 V22')}{P('M24 30 V34', true)}</>;
			break;
		case 'check':
			g = P('M10 25 L20 35 L38 14', true);
			break;
		case 'cross':
			g = P('M13 13 L35 35 M35 13 L13 35', true);
			break;
		case 'ab':
			g = <>{P('M6 8 H42 V40 H6 Z M24 8 V40')}{P('M10 32 L15 16 L20 32 M12 26 H18', true)}{P('M29 16 V32 H35 a4 4 0 0 0 0 -8 H29 M29 16 H34 a4 4 0 0 1 0 8', true)}</>;
			break;
		case 'blindfold':
			g = <>{<circle cx={24} cy={24} r={16} {...s} />}{P('M6 20 H42 V28 H6 Z', true)}{P('M18 34 Q24 37 30 34')}</>;
			break;
		case 'people':
			g = <>{<circle cx={17} cy={16} r={6} {...s} />}{<circle cx={33} cy={18} r={5} {...a} />}{P('M6 40 a11 11 0 0 1 22 0')}{P('M26 40 a9 9 0 0 1 17 -2', true)}</>;
			break;
		case 'flask':
			g = <>{P('M18 6 H30 M20 6 V18 L8 40 H40 L28 18 V6')}{P('M13 32 H35', true)}</>;
			break;
		case 'rocket':
			g = <>{P('M24 4 C32 10 34 20 32 32 H16 C14 20 16 10 24 4 Z')}{<circle cx={24} cy={18} r={4} {...a} />}{P('M16 26 L10 34 V38 L16 34 M32 26 L38 34 V38 L32 34')}{P('M20 36 L24 44 L28 36', true)}</>;
			break;
		case 'store':
			g = <>{P('M6 18 L10 8 H38 L42 18 Z M8 18 V42 H40 V18')}{P('M20 42 V30 H28 V42', true)}</>;
			break;
		case 'box':
			g = <>{P('M6 16 L24 8 L42 16 V36 L24 44 L6 36 Z M6 16 L24 24 L42 16 M24 24 V44')}{P('M15 12 L33 20', true)}</>;
			break;
		case 'gift':
			g = <>{P('M8 18 H40 V26 H8 Z M10 26 V42 H38 V26')}{P('M24 18 V42 M24 18 C18 8 10 12 16 18 M24 18 C30 8 38 12 32 18', true)}</>;
			break;
		case 'globe':
			g = <>{<circle cx={24} cy={24} r={17} {...s} />}{P('M7 24 H41 M24 7 C16 16 16 32 24 41 C32 32 32 16 24 7', true)}</>;
			break;
	}
	return (
		<svg width={size} height={size} viewBox="0 0 48 48" style={{overflow: 'visible', ...style}}>
			{g}
		</svg>
	);
};
