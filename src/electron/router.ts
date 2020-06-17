/* tslint:disable */
/* eslint-disable */
// ipc //
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PlayerController } from './../core/controllers/player.controller';
import { ipcMain } from 'electron';
import * as log from 'electron-log';

export function RegisterControllers(DICallback: Function) {    
    DICallback(PlayerController);
}


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(DIContainer: any) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
        
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        ipcMain.on('playTorrent', async (event, callerId, args) => {
            console.log('ipc receive', 'playTorrent');
            const controller = DIContainer.get(PlayerController);

            try {                
                event.sender.send(
                    `playTorrent.result/${callerId}`,
                    await controller.playTorrent.apply(controller, [args as any])
                );
            } catch(err) {
                log.error(err);
                err = JSON.parse(JSON.stringify(err));
                if (err.name && err.name.includes('.')) {
                    const nameArr = err.name.split('.');
                    err.name = nameArr[nameArr.length - 1];
                }
                event.sender.send(`playTorrent.result/${callerId}`, { err });
            }
        });
        
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        ipcMain.on('getPlayerStatus', async (event, callerId, args) => {
            console.log('ipc receive', 'getPlayerStatus');
            const controller = DIContainer.get(PlayerController);

            try {                
                event.sender.send(
                    `getPlayerStatus.result/${callerId}`,
                    await controller.getPlayerStatus.apply(controller, [args as any])
                );
            } catch(err) {
                log.error(err);
                err = JSON.parse(JSON.stringify(err));
                if (err.name && err.name.includes('.')) {
                    const nameArr = err.name.split('.');
                    err.name = nameArr[nameArr.length - 1];
                }
                event.sender.send(`getPlayerStatus.result/${callerId}`, { err });
            }
        });
        
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        ipcMain.on('closePlayer', async (event, callerId, args) => {
            console.log('ipc receive', 'closePlayer');
            const controller = DIContainer.get(PlayerController);

            try {                
                event.sender.send(
                    `closePlayer.result/${callerId}`,
                    await controller.close.apply(controller, [args as any])
                );
            } catch(err) {
                log.error(err);
                err = JSON.parse(JSON.stringify(err));
                if (err.name && err.name.includes('.')) {
                    const nameArr = err.name.split('.');
                    err.name = nameArr[nameArr.length - 1];
                }
                event.sender.send(`closePlayer.result/${callerId}`, { err });
            }
        });
}
