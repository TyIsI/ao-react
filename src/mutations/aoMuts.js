import _ from 'lodash'
import crypto from 'crypto'
const uuidV1 = require('uuid/v1')

function aoMuts(aos, ev) {
    switch (ev.type) {
        case "ao-connected":
            ev.connected = false
            ev.bridgeIds = []
            aos.push(ev)
            break
    }
}

export default aoMuts