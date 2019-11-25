import { EventEmitter } from 'events'

class StickyJs {
  constructor (config) {
    this.event = new EventEmitter()
    this.config = config
    this.initModules(this.modules)
  }

  get modules () {
    return this.config.modules
  }

  initModules (modules) {
    Object.keys(modules).map(async module => {
      await this.loadModule(module)
    })
  }

  async loadModule (module) {
    try {
      const moduleConfig = this.modules[module]
      const m = await require(`./modules/${module}.js`).default
      m.init(moduleConfig, this)
    } catch (e) {
      console.error(`Could not load module: ${module}. Reason:`, e)
    }
  }
}

export default StickyJs
