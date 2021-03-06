import IWhenable from './iwhenable'

const noop = _ => {}

export class Whatable<T> implements IWhenable {
  _internalPromise: Promise<T>

  private internalResolve: (value: T | PromiseLike<T>) => void
  private callbacks: Array<(error: any) => any> = []

  constructor(value?: PromiseLike<T> | T) {
    this._internalPromise = new Promise(resolve => {
      this.internalResolve = resolve
    })

    if (value !== undefined) {
      this.internalResolve(value)
    }
  }

  set(value: any): void {
    this.notifyCallbacks()
    this.internalResolve(value)
    this.internalResolve = noop
    this._internalPromise = Promise.resolve(value)
  }

  _done(callback: (error: any) => any): void {
    this.callbacks.push(callback)
  }

  private notifyCallbacks(): void {
    this.callbacks.forEach(cb => cb(null))
    this.callbacks.splice(0, this.callbacks.length)
  }
}

export function What<T>(whatable: Whatable<T>): Promise<T> {
  return whatable._internalPromise
}
