import {CONSTANT_MAP} from '../data/constants.js';
/** Inputs wavelength in nm and work function in eV, returns energies and thresholds. */
export function photoelectric({wavelengthNm,workFunctionEv}){
 const lambda=Number(wavelengthNm),phi=Number(workFunctionEv);
 if(!Number.isFinite(lambda)||lambda<=0||!Number.isFinite(phi)||phi<0)throw Error('Introduce una longitud de onda positiva y una función de trabajo no negativa.');
 const h=CONSTANT_MAP.h.value,c=CONSTANT_MAP.c.value,e=CONSTANT_MAP.e_charge.value;
 const photonJ=h*c/(lambda*1e-9),photonEv=photonJ/e,kineticEv=photonEv-phi;
 const cutoffNm=phi===0?Infinity:(h*c/(phi*e))*1e9;
 return {emission:kineticEv>=-1e-12,photonEv,photonJ,kineticEv:Math.max(0,kineticEv),kineticJ:Math.max(0,kineticEv)*e,stoppingV:Math.max(0,kineticEv),thresholdNm:cutoffNm,thresholdHz:phi*e/h,frequencyHz:c/(lambda*1e-9)};
}
