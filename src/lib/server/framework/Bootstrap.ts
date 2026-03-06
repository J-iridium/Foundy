import { bus }             from './services/bus/BusService';
import { WebService }      from '../../Shared/web/WebService';

export async function bootstrap(): Promise<void> {
  bus.register(new WebService(),      { runtime: 'always' })

  await bus.boot();
}