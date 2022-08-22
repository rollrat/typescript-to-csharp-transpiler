export default class CSEmitter {
  code: string = "";
  spaceCount: number = 0;

  lastSpaceCount: number = 0;
  spaceStr: string = "";

  private ensureSpace() {
    if (this.spaceCount === this.lastSpaceCount) return;

    this.spaceStr = " ".repeat(4 * this.spaceCount);
  }

  println(snippet: string) {
    this.ensureSpace();
    this.code += `${this.spaceStr}${snippet}\n`;
  }

  enterScope() {
    this.spaceCount += 4;
  }

  exitScope() {
    this.spaceCount -= 4;
  }
}
