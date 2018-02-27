var events = require('events');
let eventObj;
export default class EventSingleton {
    static geteventEmitterObj() {
        if (this.eventObj) {
            return this.eventObj;
        } else {
            this.eventObj = new events.EventEmitter();
            return this.eventObj;
        }
    }
}