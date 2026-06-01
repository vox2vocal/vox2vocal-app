export function createMMKV() {
  const store = new Map<string, string | number | boolean | ArrayBuffer>()

  return {
    set: (key: string, value: string | number | boolean | ArrayBuffer) => {
      store.set(key, value)
    },
    getString: (key: string) => {
      const value = store.get(key)
      return typeof value === 'string' ? value : undefined
    },
    remove: (key: string) => store.delete(key),
  }
}
