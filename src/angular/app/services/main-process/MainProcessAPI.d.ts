export interface MainProcessAPI {
  defaultDownloadPath: string;
  on(channel: string, listener: (event: any, ...args: any[]) => void): this;
  once(channel: string, listener: (event: any, ...args: any[]) => void): this;
  send(channel: string, ...args: any[]): void;
  sendSync(channel: string, ...args: any[]): any;
  isFullScreen(): boolean;
  isElectron(): boolean;
  close(): void;
  relaunch(): void;
  getEnvironment(): string;
  setTitleBar(): boolean;
  getWebTorrentHealthModule();
  showOpenDialog(): Promise<string>;
}