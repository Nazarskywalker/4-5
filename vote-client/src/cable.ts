import * as ActionCable from '@rails/actioncable';

export const cable = ActionCable.createConsumer('ws://127.0.0.1:3000/cable');
