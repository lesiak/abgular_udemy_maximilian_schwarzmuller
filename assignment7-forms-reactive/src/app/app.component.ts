import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';

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
      'projectName': new FormControl(null, [Validators.required, this.makeForbiddenValuesValidator(['Test'])]),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'status': new FormControl(null)
    });
  }

  onSubmit() {
    console.log(this.projectForm.value);
  }

  makeForbiddenValuesValidator(disallowedValues: string[]): (control: FormControl) => (ValidationErrors | null) {
    const forbiddenValuesValidator = function (control: FormControl): ValidationErrors | null {
      if (disallowedValues.includes(control.value)) {
        return {'valueIsForbidden': true};
      } else {
        return null;
      }
    };
    return forbiddenValuesValidator;
  }
}
