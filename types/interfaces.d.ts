export interface ISimplePlant {
  id: string;
  name: string;
}
export interface ISimpleGarden {
  id: string;
  name: string;
  gardenName: string;
}

export interface IPlantDetails extends ISimplePlant {
  description: string;
  specie: string;
}

export interface IGardenDetails extends ISimpleGarden {
  gardenOwner: string;
}

export type OptionItem = {
  key: any;
  value: any;
};
