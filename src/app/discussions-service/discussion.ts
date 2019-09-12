
export class Discussion {
  constructor(title: string, initiator: string, initiatorName: string) {
    this.title = title;
    this.initiator = initiator;
    this.initiatorName = initiatorName;
  }
  title: string;
  initiator: string;
  initiatorName: string;
}
