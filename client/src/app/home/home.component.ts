import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  go(path: string) {
    if (path === 'E') {
      this.router.navigate(['transmisor']);
    } else {
      this.router.navigate(['receptor']);
    }
  }
}
