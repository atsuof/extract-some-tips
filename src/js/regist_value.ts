export class RegistValue {
  name: string;
  value: string;
  department: string;

  constructor(name: string | string[], value: string | string[], department: string | string[]) {
    this.name = name as string;
    this.value = value as string;
    this.department = department as string;
  }
}
