export enum EosIPC {
  PLAY_TORRENT = 'playTorrent',
  GET_PLAYER_STATUS = 'getPlayerStatus',
  CLOSE_PLAYER = 'closePlayer',
}

export function EosIPCResult(event: EosIPC) {
  return `${event}.result`;
}
