export class Participant {
  address;
  percentage;
  username: string;

  constructor(address,
              percentage,
              username: string) {

    this.address = address;
    this.percentage = percentage;
    this.username = username;
  }
}
