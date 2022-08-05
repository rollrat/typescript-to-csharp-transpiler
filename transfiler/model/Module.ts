export class CSModule {
  usings: string[] = [];

  // Push External Module like
  // System.Threading
  addExternalModule(modName: string) {
    this.usings.push(modName);
  }
}
