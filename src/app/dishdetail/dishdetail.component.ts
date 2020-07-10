import { Component, OnInit,Input ,ViewChild,Inject} from '@angular/core';
import {Dish} from '../shared/dish'
import { DishService } from '../services/dish.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { Comment } from '../shared/comment';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
  dish: Dish;
  dishIds:string[];
  prev:string;
  next:string;
  commentForm:FormGroup;
  review:Comment;
  d:Date;
  value:number;
  disableBtn:boolean;
  errMsg:string;

  @ViewChild('fform') commentFormDirective;
  

  formErrors={
    'author':'',
    'comment':''
  };
  // l in minlength should be small here
  validationMessages={
    'author':{
      'required':'Name is required',
      'minlength':'Name must be atleast two charcters long'
    },
    'comment':{
      'required':'Your Comment is required'
    }
  };

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb:FormBuilder,
    @Inject('BaseURL') private BaseURL) {
       this.createForm();
     }

  ngOnInit() {
    this.dishservice.getDishIds().
      subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
    .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); },
    errmess=>this.errMsg=<any>errmess);
   }
  createForm(){
      this.commentForm=this.fb.group({
        author:['',[Validators.required,Validators.minLength(2)]],
        rating:5,
        comment:['',[Validators.required]]
      });
  this.commentForm.valueChanges.
     subscribe(data=>this.onValueChanged(data));
  this.disableBtn=false;
  this.commentForm.valueChanges.
      subscribe((changedObj:any)=>{
        this.disableBtn = this.commentForm.valid;
      });

  this.onValueChanged();
    }
    onValueChanged(data?: any) {
      if (!this.commentForm) { return; }
      const form = this.commentForm;
      for (const field in this.formErrors) {
        if (this.formErrors.hasOwnProperty(field)) {
          // clear previous error message (if any)
          this.formErrors[field] = '';
          const control = form.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = this.validationMessages[field];
            
            for (const key in control.errors) {
              // console.log(key);
              // console.log(messages);
              if (control.errors.hasOwnProperty(key)) {
                this.formErrors[field] += messages[key] + ' ';
                // console.log(messages[key]);
              }
            }
          }
        }
      }
    }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }
  onSubmit() {
    this.review = this.commentForm.value;
    this.d = new Date();
    this.review.date=this.d.toISOString();
    console.log(this.review);
    this.dish.comments.push(this.review);
    // this.slider.value=5;
    this.value=5;
    this.commentForm.reset({
      author:'',
      rating:5,
      comment:''
    });
    this.commentFormDirective.resetForm();
  }

}
