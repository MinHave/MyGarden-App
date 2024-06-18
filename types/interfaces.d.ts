export interface ISimplePlant {
  id: string;
  name: string;
}
export interface ISimpleGarden {
  id: string;
  name: string;
  gardenName: string;
}

export interface ICreatePlant {
  name: string;
  description: string;
  specie: string;
  gardenId: string;
}

export interface IAccount {
  id: string;
  name: string;
  username: string;
  password: string;
  phoneNumber: string;
  email: string;
}

export interface IPlantDetails extends ISimplePlant, ICreatePlant {}

export interface IGardenDetails extends ISimpleGarden {
  gardenOwner: string;
}

export type OptionItem = {
  key: any;
  value: any;
};
