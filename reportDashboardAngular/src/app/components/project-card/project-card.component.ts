import { Component, Input, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css']
})
export class ProjectCardComponent implements OnInit {

  @Input() projectName = ''

  constructor(private router: Router) { }

  navigateTo(projectName:any) {
    this.router.navigate(['/'+projectName]).then( ()=> {}).catch( (e)=> {console.log(e)})
  }

  ngOnInit(): void {
  }

}
