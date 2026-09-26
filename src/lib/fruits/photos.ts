import manifest from "./photo-manifest.json";
export interface FruitPhoto {src:string;thumb:string;alt:string;author:string;license:string;licenseUrl:string;source:string;}
/** Reviewed real photographs; attribution travels with each asset. */
export const FRUIT_PHOTOS:Record<string,FruitPhoto> = manifest;
