export interface inOptions {
  noAuth?: boolean;
  headers?: { [key: string]: string };
  // Add other properties as needed
}

export interface credentials {
  username: string;
  password: string;
}
