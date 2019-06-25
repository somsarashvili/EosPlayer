import {EosShared} from '../../../eos.shared';

export type EosIPCFunction = (args: any) => Promise<EosShared.EosResult<any>>
