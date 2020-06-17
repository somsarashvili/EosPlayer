import log from 'electron-log';

export async function BootCore() {
  log.transports.file.level = 'verbose';
  log.transports.console.level = 'debug';

  process.on('uncaughtException', function (error) {
    log.error('uncaughtException', error, error.stack);
  });
  
  process.on('unhandledRejection', function (error) {
    log.error('unhandledRejection', error);
  });
}