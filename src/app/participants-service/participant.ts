export class Participant {
  address: string;
  percentage;
  username: string;

  constructor(address: string,
              percentage,
              username: string) {

    this.address = address;
    this.percentage = percentage;
    this.username = username;
  }
}
