export enum EosIPC {
  PLAY_TORRENT = 'playTorrent'
}

export function EosIPCResult(event: EosIPC) {
  return `${event}.result`;
}
