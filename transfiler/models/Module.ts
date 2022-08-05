export class CSModule {
  constructor(fileName: string) {}

  usings: string[] = [];

  // Push External Module like
  // System.Threading
  addExternalModule(modName: string) {
    this.usings.push(modName);
  }
}
