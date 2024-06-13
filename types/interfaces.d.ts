export interface ISimplePlant {
  id: string;
  name: string;
}
export interface ISimpleGarden {
  id: string;
  name: string;
}

export interface IPlantDetails extends ISimplePlant {
  description: string;
  specie: string;
}

export interface IGardenDetails extends ISimpleGarden {
  gardenOwner: string;
}
