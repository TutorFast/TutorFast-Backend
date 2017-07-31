import socket from 'socket.io';
import { server } from '../';

export default socket(server);
