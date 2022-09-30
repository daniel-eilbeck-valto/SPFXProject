import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ICrudwithreactProps {
  description: string;
  context: WebPartContext;
  siteURL: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
}

//webpart context so that I can http request
//siteURL so I dont have to rewrite in request