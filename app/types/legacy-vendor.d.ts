declare module "lodash" {
  export function cloneDeep<T>(value: T): T;
  export function isEqual(value: unknown, other: unknown): boolean;
}

declare module "earcut" {
  type FlattenedPolygon = {
    vertices: number[];
    holes: number[];
    dimensions: number;
  };

  interface Earcut {
    (vertices: number[], holes?: number[] | null, dimensions?: number): number[];
    flatten(data: number[][][]): FlattenedPolygon;
  }

  const earcut: Earcut;
  export default earcut;
}

declare module "wicket/wicket" {
  class Wkt {
    read(value: string): void;
    write(): string;
  }

  const Wicket: { Wkt: typeof Wkt };
  export default Wicket;
}
