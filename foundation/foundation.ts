export interface Bootable {
  boot(): Promise<void>;
  shutdown(): Promise<void>;
}
