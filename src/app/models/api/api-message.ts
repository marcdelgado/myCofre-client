export class ApiMessage<T> {
  constructor(json: Partial<T>) {
    Object.assign(this, json);

    for (const key of Object.keys(json)) {
      if (!(key in this)) {
        throw new Error(`El atributo '${key}' no existe en la clase`);
      }
    }
  }

  getJSON(): string {
    return JSON.stringify(this);
  }
}
