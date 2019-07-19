import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  projectForm: FormGroup;

  ngOnInit(): void {
    this.projectForm = new FormGroup({
      // control names are passed as strings to prevent potential name mangling during minification
      'projectName': new FormControl(null, Validators.required),
      'email': new FormControl(null, Validators.required),
      'status': new FormControl(null)
    });
  }

  onSubmit() {
    console.log(this.projectForm.value);
  }
}
