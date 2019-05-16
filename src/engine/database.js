import Config from 'react-native-config'
import Gun from 'gun/gun.js' // or use the minified version 'gun/gun.min.js'

// TODO:  what is this? (Google it)
Gun.on('opt', function (ctx) {
  if (ctx.once) {
    return
  }
  ctx.on('out', function (msg) {
    var to = this.to
    // Adds headers for put
    msg.headers = {
      token: Config.GUN_TOKEN
    }
    to.next(msg) // pass to next middleware
  })
})

// TODO: abstraction methods that isolate us from gun and allow switch to other DBs
class GunWrapper {
  constructor () {
    const gunServer = Config.GUN_SERVER || 'http://localhost:4040/gun'
    this.gun = new Gun(gunServer)
  }

  instance() {
    return this.gun
  }
}

// Singleton global of our gun wrapper. Must appear after the class definition above.
//
export var db = new GunWrapper()


// Disabling this for now. Webcrypto shim is problematic when run on device.
// Using PBJs shim solution instead.
//
// // Strange import way to get SEA (TODO: clean this up--lifted/adapted from: https://gun.eco/docs/SEA#quickstart)
// require('gun/sea')
// export var SEA = Gun.SEA
