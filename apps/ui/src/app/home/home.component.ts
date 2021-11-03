import { Component } from '@angular/core';
import {
  COMBINATORIALLY_ENTAILED_DICTIONARY_SAME_GT_LT_ICK, MUTUALLY_ENTAILED_DICTIONARY_SAME_GT_LT_ICK
} from '../graph/operator-dictionaries';
import { RelationType } from '../graph/relation-type';
import { RelationalEdge } from '../graph/relational-edge';
import { RelationalFrameDigraph } from '../graph/relational-frame-digraph';
import { RelationalNode } from '../graph/relational-node';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor() {


  }
}


