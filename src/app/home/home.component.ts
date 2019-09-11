import {Component, OnInit} from '@angular/core';
import {UserService} from '../user-service/user.service';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  addForm;
  // string with username of logged user
  username: string;
  // number with reputaion value of logged user
  reputation: number;
  discussionTit: string;

  constructor(private service: UserService, private formBuilder: FormBuilder) {
    this.addForm = this.formBuilder.group({
      discussionTit: ''
  });
  }

  async ngOnInit() {
    await this.service.getUsername().then(res => {
      this.username = res;
    });
    await this.service.getReputation().then(res => {
      this.reputation = res;
    });
  }

  onSubmit() {
  }
}
