import { Container, interfaces } from 'inversify';
import { PlayerService } from '../services/player/player.service';
import { EventService } from '../services/event/event.service';


const EosDIContainer = new Container();

EosDIContainer.bind<PlayerService>(PlayerService).toSelf().inSingletonScope();
EosDIContainer.bind<EventService>(EventService).toSelf().inSingletonScope();

function EosDIControllerBinder<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>) {
  EosDIContainer.bind<T>(serviceIdentifier).toSelf().inTransientScope();
}

export { EosDIContainer, EosDIControllerBinder };
