import Config from 'react-native-config'
import Gun from 'gun/gun.js' // or use the minified version 'gun/gun.min.js'
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
const gunServer = Config.GUN_SERVER || 'http://localhost:4040/gun'
const gun = new Gun(gunServer)

class GunWrapper {
  constructor () {}

  getGunRef (path) {
    return gun.get(path)
  }

  setGunData (path, data) {
    gun.get(path).put(data);
  }
}

// Singleton global of our gun wrapper. Must appear after the class definition above.
//
export var gunInstance = new GunWrapper()
