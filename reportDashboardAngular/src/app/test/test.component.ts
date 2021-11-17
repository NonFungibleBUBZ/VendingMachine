import { Component, OnInit } from '@angular/core';
import {TestService} from "../services/test.service";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor(private service: TestService) { }

  ngOnInit(): void {
    this.service.getAvailableBubz().subscribe( (res) => {
      console.log(res)
    })
  }

}
