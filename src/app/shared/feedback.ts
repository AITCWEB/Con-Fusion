export class Feedback {
  constructor(
    public firstname: string,
    public lastname: string,
    public telnum: number,
    public email: string,
    public agree: boolean,
    public contacttype: string,
    public message: string,
  ) {}
}

export const ContactType = ['None', 'Tel', 'Email']
