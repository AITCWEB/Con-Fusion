import { Comment } from "./comment";
export class Dish {
  constructor(
    public id: string,
    public name: string,
    public image: string,
    public category: string,
    public featured: boolean,
    public label: string,
    public price: string,
    public description: string,
    public comments: Comment[]
  ) {}
}
