export default class CSEmitter {
  code: string = "";

  println(snippet: string) {
    this.code += `${snippet}\n`;
  }
}
