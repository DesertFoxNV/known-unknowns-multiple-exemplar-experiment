import { Injectable } from '@angular/core';
import { StudyConditions } from './study-conditions';

@Injectable({
  providedIn: 'root'
})
export class StudyConditionService {

  createStudy() {
    const conditions = new StudyConditions();
    console.log(conditions);
  }

}
