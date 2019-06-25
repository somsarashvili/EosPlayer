import { EosIPC } from './eos.ipc.enum';

export type EosIPCHandler = { [t in EosIPC]: Function };
