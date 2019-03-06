export class Promotion {
  constructor(
    public id: string,
    public name: string,
    public image: string,
    public label: string,
    public featured: boolean,
    public price: string,
    public description: string
  ) {}
}
