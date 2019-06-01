import { BiomeCategory } from "./BiomeCategory";
import { AltitudeCategory } from "./WaterCategory";

export type VisualTerrainType = BiomeCategory | AltitudeCategory.ShallowWater | AltitudeCategory.DeepWater | "SnowyMountain" | "Mountain" | "SnowyHill" | "Hills" | "Ice" | "Cave";
