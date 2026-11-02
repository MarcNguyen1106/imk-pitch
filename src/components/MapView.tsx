// Natural Earth map (world-atlas 50m + admin-1 states) with a code-driven camera.
import React, {useMemo} from 'react';
import {geoMercator, geoPath} from 'd3-geo';
import {feature} from 'topojson-client';
import type {Feature, FeatureCollection, Geometry} from 'geojson';
import world from 'world-atlas/countries-50m.json';
import auStates from '../../public/data/au-states.json';
import {C} from '../theme';

export const PROJ = geoMercator().scale(500).translate([0, 0]).center([0, 0]);
export const project = (lonlat: [number, number]) => PROJ(lonlat) as [number, number];

const pathGen = geoPath(PROJ);

// Countries that touch the SE Asia - Oceania window only.
const countries = (() => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const fc = feature(world as any, (world as any).objects.countries) as unknown as FeatureCollection<Geometry>;
	return fc.features.filter((f: Feature<Geometry>) => {
		const [[x0, y0], [x1, y1]] = pathGen.bounds(f);
		const [ax, ay] = project([60, 45]);
		const [bx, by] = project([200, -60]);
		return x1 > ax && x0 < bx && y1 > ay && y0 < by;
	});
})();

const states = (auStates as unknown as FeatureCollection<Geometry, {code: string; name: string}>).features;

export interface Camera {
	focus: [number, number]; // projected coords at the anchor
	anchor: [number, number]; // screen position of the focus
	zoom: number;
}

export const MapView: React.FC<{cam: Camera; highlight?: number; children?: React.ReactNode}> = ({cam, highlight = 0, children}) => {
	const paths = useMemo(() => countries.map((f) => ({id: String(f.id), d: pathGen(f) ?? ''})), []);
	const stateP = useMemo(() => states.map((f) => ({code: f.properties.code, d: pathGen(f) ?? ''})), []);
	const t = `translate(${cam.anchor[0]} ${cam.anchor[1]}) scale(${cam.zoom}) translate(${-cam.focus[0]} ${-cam.focus[1]})`;
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
			<defs>
				<radialGradient id="sea" cx="0.55" cy="0.5" r="0.8">
					<stop offset="0%" stopColor="#1d4559" />
					<stop offset="100%" stopColor="#0c1f29" />
				</radialGradient>
				<pattern id="grid" width={40} height={40} patternUnits="userSpaceOnUse">
					<path d="M40 0 H0 V40" fill="none" stroke="#ffffff" strokeOpacity={0.035} />
				</pattern>
			</defs>
			<rect width={1920} height={1080} fill="url(#sea)" />
			<rect width={1920} height={1080} fill="url(#grid)" />
			<g transform={t}>
				{paths.map((p) => (
					<path key={p.id} d={p.d} fill={p.id === '036' ? '#3a2a22' : '#2b1f19'} stroke={C.steel} strokeOpacity={0.55} strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
				))}
				{stateP.map((s) => {
					const hi = s.code === 'NSW' || s.code === 'VIC';
					return (
						<path
							key={s.code}
							d={s.d}
							fill={hi ? C.gold : 'none'}
							fillOpacity={hi ? 0.35 * highlight : 0}
							stroke={hi ? C.gold : C.steel}
							strokeOpacity={hi ? 0.3 + 0.7 * highlight : 0.35}
							strokeWidth={hi ? 2 : 1}
							vectorEffect="non-scaling-stroke"
						/>
					);
				})}
				{children}
			</g>
		</svg>
	);
};

// Interpolate cameras smoothly (log-space zoom).
export const lerpCam = (a: Camera, b: Camera, t: number): Camera => {
	const z = Math.exp(Math.log(a.zoom) + (Math.log(b.zoom) - Math.log(a.zoom)) * t);
	// keep the motion stable by interpolating the screen position of b.focus
	const l = (u: number, v: number) => u + (v - u) * t;
	return {focus: [l(a.focus[0], b.focus[0]), l(a.focus[1], b.focus[1])], anchor: [l(a.anchor[0], b.anchor[0]), l(a.anchor[1], b.anchor[1])], zoom: z};
};
