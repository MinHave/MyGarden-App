export type RootStackParamList = {
  PlantsList: { gardenId: string };
  PlantDetails: { plantId: string };
  GardenDetails: { gardenId: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
