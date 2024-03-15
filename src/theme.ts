import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    textColor: string;
    bgColor: string;
    accentColor: string;
  }
}

export const theme = {
  textColor: "black",
  bgColor: "white",
  accentColor: "blue"
};