declare namespace App {
  interface City {
    name: string;
    region: string;
    location: {
      lat: number;
      lng: number;
    };
    data: number;
  }
}
