// ViewChild will enable us to get access to any of the child dom elements within my template.
import { Component, OnInit ,ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { flyInOut,expand } from '../animations/app.animation';
import {FeedbackService} from '../services/feedback.service';
import { fn } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
  animations:[flyInOut(),expand()]
})
export class ContactComponent implements OnInit {

  feedbackForm:FormGroup;
  feedback:Feedback;
  feedbackCopy:Feedback;
  contactType = ContactType;
  @ViewChild('fform') feedbackFormDirective;
  errMsg:string;
  spinnerVisibility:boolean = false;
  
  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  validationMessages = {
    'firstname': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'lastname': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
      'maxlength':     'Last Name cannot be more than 25 characters long.'
    },
    'telnum': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    }
  };

  constructor(private fb:FormBuilder, private feedbackservice:FeedbackService) {
     this.createForm();
   }

  ngOnInit(): void {
  }
  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['',[Validators.required,Validators.minLength(2),Validators.maxLength(25)]],
      lastname: ['',[Validators.required,Validators.minLength(2),Validators.maxLength(25)]],
      telnum: [0,[Validators.required,Validators.pattern]],
      email: ['',[Validators.required,Validators.email]],
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackForm.valueChanges.
     subscribe(data=>this.onValueChanged(data));
    this.onValueChanged(); //reset validation messages

  }
  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.spinnerVisibility=true;
    this.feedbackservice.submitFeedback(this.feedbackForm.value).
      subscribe(dish => {
        this.feedback = dish;this.feedbackCopy=dish;this.spinnerVisibility=false;
      },
      errmess => { this.feedback = null; this.feedbackCopy=null;this.errMsg = <any>errmess; });
    //  console.log(this.hidden);
     setTimeout(()=> this.feedback = null,5000);
      this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: 0,
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackFormDirective.resetForm();
  }

}
