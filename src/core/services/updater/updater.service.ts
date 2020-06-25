export interface IUpdaterService {
  Run(): Promise<void>;
  checkUpdates(): boolean;
}