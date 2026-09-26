import manifest from './artwork-manifest.json';

export interface FruitArtwork {
 src:string;
 thumb:string;
 alt:string;
 origin:'gpt-image';
 width:number;
 height:number;
 referenceId:string;
}
/** One original Rumila image per fruit, shared by catalog, detail and 3D reference. */
export const FRUIT_ARTWORK=manifest as Record<string,FruitArtwork>;
