import { ChangeDetectorRef, Component, Input, OnDestroy, 
          OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';
import { Observable } from 'rxjs';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { __DateFromStorage } from '@iote/time';
import { TranslateService } from '@ngfi/multi-lang';

import { Notes } from '@app/model/finance/notes';
import { NotesStore } from "@app/state/finance/notes";

@Component({
  selector: 'kujali-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})

export class NotesComponent implements OnInit, OnDestroy {
  private _sbS = new SubSink();

  @ViewChild('myEditor') myEditor: any;

  public Editor: any = ClassicEditor;
  noteData: string;

  @Input() notesTitle?: string;
  @Input() desctext?: string;

  note$: Observable<Notes>;

  myNote: string;
  lastEdited: string;

  addNewNoteForm: FormGroup;

  editMode = false;
  customTitle: boolean;
  showToolbar: boolean;

  isLoading = true;

  lang: 'fr' | 'en' | 'nl';

  constructor(private _translateService: TranslateService,
              private _notes$$: NotesStore,
              private _cd: ChangeDetectorRef
  ) 
  {
    this.lang = this._translateService.initialise();
  }

  ngOnInit(): void {
    this.notesTitle ? (this.customTitle = true) : false;
    this.getNoteData();
  }

  getNoteData () {
    this.note$ = this._notes$$.get();
        
    this._sbS.sink = this.note$.subscribe((notes) => {
      if (notes) {
        this.myNote = notes ? notes.note : '';
        this.noteData = this.myNote;
        this.lastEdited = this.getDate(notes.createdOn);
        this._cd.detectChanges();
      }
    });
  }

  setLang(lang: 'en' | 'fr' | 'nl') {
    this._translateService.setLang(lang);
  }

  toolBarIsReady(toolbar: any) {
    if (toolbar) {
      let toolbarElement = toolbar.ui.view.toolbar.element
      toolbarElement.style.display = 'none';
    }
  }

  hideEditorToolBar() {
    if (this.myEditor && this.myEditor.editorInstance) {
      let toolbar = this.myEditor.editorInstance.ui.view.toolbar.element
      toolbar.style.display = 'none';
    }
  }

  showEditorToolBar() {
    if (this.myEditor && this.myEditor.editorInstance) {
      let toolbar = this.myEditor.editorInstance.ui.view.toolbar.element
      toolbar.style.display = 'flex';
    }
  }

  onFocusChange() {
    this.storeNote();
    this.hideEditorToolBar()
  }

  getDate(date) {
    return date ? __DateFromStorage(date).format('DD/MM/YYYY') : '';
  }

  storeNote() {
    if (this.myEditor && this.myEditor.editorInstance) {  
      this.myNote = this.myEditor.editorInstance.getData();

      let noteObj: Notes = {
        note: this.myNote,
      };

      this._notes$$.set(noteObj as Notes);
    }
  }

  ngOnDestroy() {
    this._sbS.unsubscribe();
  }
}
