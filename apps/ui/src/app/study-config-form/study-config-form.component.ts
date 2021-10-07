import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { flatten } from 'flat';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { StudyConfig, StudyConfigFlattened } from './study-config.interfaces';
import { StudyConfigService } from './study-config.service';

@UntilDestroy()
@Component({
  selector: 'kumee-study-config-form',
  templateUrl: './study-config-form.component.html',
  styleUrls: ['./study-config-form.component.scss']
})
export class StudyConfigFormComponent implements OnInit {
  form: FormGroup<StudyConfig>;

  constructor(
    private clipboard: Clipboard,
    private router: Router,
    private studyConfigSvc: StudyConfigService
  ) {
    this.form = this.studyConfigSvc.createForm();
  }

  copyLink() {
    this.clipboard.copy(`${environment.baseUrl}/study?${this.getQueryParamStr()}`);
  }

  getQueryParamObj(): StudyConfigFlattened {
    return flatten(this.form.value);
  }

  getQueryParamStr() {
    return Object.entries(this.getQueryParamObj()).map(([key, val]) => `${key}=${val}`).join('&');
  }

  ngOnInit(): void {
    this.form.get('idk').valueChanges.pipe(
      tap((idk) => this.form.get('balance.idk')[idk ? 'enable' : 'disable']()),
      untilDestroyed(this)
    ).subscribe();
  }

  start() {
    this.router.navigate([`./study`], { queryParams: this.getQueryParamObj() }).then();
  }

}
