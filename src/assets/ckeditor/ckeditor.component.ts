import {
    Component,
    Input,
    Output,
    NgZone,
    EventEmitter,
    forwardRef,
    AfterViewInit, OnDestroy,
    ElementRef
} from '@angular/core';

import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR
} from '@angular/forms';

import { CKEditor5 } from './ckeditor';
var test123: HttpClient;
@Component({
    selector: 'ckeditor',
    template: '<ng-template></ng-template>',

    // Integration with @angular/forms.
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            useExisting: forwardRef(() => CKEditorComponent),
            multi: true,
        }
    ]
})

export class CKEditorComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
    /**
     * The reference to the DOM element created by the component.
     */
    private elementRef!: ElementRef<HTMLElement>;

    /**
     * The constructor of the editor to be used for the instance of the component.
     * It can be e.g. the `ClassicEditorBuild`, `InlineEditorBuild` or some custom editor.
     */
    @Input() public editor?: CKEditor5.EditorConstructor;

    /**
     * The configuration of the editor.
     * See https://ckeditor.com/docs/ckeditor5/latest/api/module_core_editor_editorconfig-EditorConfig.html
     * to learn more.
     */
    @Input() public config: CKEditor5.Config = {};

    /**
     * The initial data of the editor. Useful when not using the ngModel.
     * See https://angular.io/api/forms/NgModel to learn more.
     */
    @Input() public data = '';

    /**
     * Tag name of the editor component.
     *
     * The default tag is 'div'.
     */
    @Input() public tagName = 'div';

    /**
     * When set `true`, the editor becomes read-only.
     * See https://ckeditor.com/docs/ckeditor5/latest/api/module_core_editor_editor-Editor.html#member-isReadOnly
     * to learn more.
     */
    @Input() public set disabled(isDisabled: boolean) {
        this.setDisabledState(isDisabled);
    }

    public get disabled() {
        if (this.editorInstance) {
            return this.editorInstance.isReadOnly;
        }

        return this.initialIsDisabled;
    }

    /**
     * Fires when the editor is ready. It corresponds with the `editor#ready`
     * https://ckeditor.com/docs/ckeditor5/latest/api/module_core_editor_editor-Editor.html#event-ready
     * event.
     */
    @Output() public ready = new EventEmitter<CKEditor5.Editor>();

    /**
     * Fires when the content of the editor has changed. It corresponds with the `editor.model.document#change`
     * https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_document-Document.html#event-change
     * event.
     */
    @Output() public change: EventEmitter<ChangeEvent> = new EventEmitter<ChangeEvent>();

    /**
     * Fires when the editing view of the editor is blurred. It corresponds with the `editor.editing.view.document#blur`
     * https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_view_document-Document.html#event-event:blur
     * event.
     */
    @Output() public blur: EventEmitter<BlurEvent> = new EventEmitter<BlurEvent>();

    /**
     * Fires when the editing view of the editor is focused. It corresponds with the `editor.editing.view.document#focus`
     * https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_view_document-Document.html#event-event:focus
     * event.
     */
    @Output() public focus: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();

    /**
     * The instance of the editor created by this component.
     */
    public editorInstance: CKEditor5.Editor | null = null;

    /**
     * If the component is read–only before the editor instance is created, it remembers that state,
     * so the editor can become read–only once it is ready.
     */
    private initialIsDisabled = false;

    /**
     * An instance of https://angular.io/api/core/NgZone to allow the interaction with the editor
     * withing the Angular event loop.
     */
    private ngZone: NgZone;

    /**
     * A callback executed when the content of the editor changes. Part of the
     * `ControlValueAccessor` (https://angular.io/api/forms/ControlValueAccessor) interface.
     *
     * Note: Unset unless the component uses the `ngModel`.
     */
    private cvaOnChange?: (data: string) => void;

    /**
     * A callback executed when the editor has been blurred. Part of the
     * `ControlValueAccessor` (https://angular.io/api/forms/ControlValueAccessor) interface.
     *
     * Note: Unset unless the component uses the `ngModel`.
     */
    private cvaOnTouched?: () => void;

    /**
     * Reference to the source element used by the editor.
     */
    private editorElement?: HTMLElement;

    /**
     * A lock flag preventing from calling the `cvaOnChange()` during setting editor data.
     */
    private isEditorSettingData = false;

    public constructor(elementRef: ElementRef, ngZone: NgZone, private http: HttpClient) {
        this.ngZone = ngZone;
        this.elementRef = elementRef;
        test123 = this.http;
    }

    // Implementing the AfterViewInit interface.
    public ngAfterViewInit() {
        this.ngZone.runOutsideAngular(() => {
            this.createEditor();
        });
    }

    // Implementing the OnDestroy interface.
    public ngOnDestroy() {
        if (this.editorInstance) {
            this.editorInstance.destroy();
            this.editorInstance = null;
        }
    }

    // Implementing the ControlValueAccessor interface (only when binding to ngModel).
    public writeValue(value: string | null): void {
        // This method is called with the `null` value when the form resets.
        // A component's responsibility is to restore to the initial state.
        if (value === null) {
            value = '';
        }

        // If already initialized.
        if (this.editorInstance) {
            // The lock mechanism prevents from calling `cvaOnChange()` during changing
            // the editor state. See #139
            this.isEditorSettingData = true;
            this.editorInstance.setData(value);
            this.isEditorSettingData = false;
        }
        // If not, wait for it to be ready; store the data.
        else {
            this.data = value;

            // If the editor element is already available, then update its content.
            // If the ngModel is used then the editor element should be updated directly here.
            if (this.editorElement) {
                this.editorElement.innerHTML = this.data;
            }
        }
    }

    // Implementing the ControlValueAccessor interface (only when binding to ngModel).
    public registerOnChange(callback: (data: string) => void): void {
        this.cvaOnChange = callback;
    }

    // Implementing the ControlValueAccessor interface (only when binding to ngModel).
    public registerOnTouched(callback: () => void): void {
        this.cvaOnTouched = callback;
    }

    // Implementing the ControlValueAccessor interface (only when binding to ngModel).
    public setDisabledState(isDisabled: boolean): void {
        // If already initialized
        if (this.editorInstance) {
            this.editorInstance.isReadOnly = isDisabled;
        }
        // If not, wait for it to be ready; store the state.
        else {
            this.initialIsDisabled = isDisabled;
        }
    }

    /**
     * Creates the editor instance, sets initial editor data, then integrates
     * the editor with the Angular component. This method does not use the `editor.setData()`
     * because of the issue in the collaboration mode (#6).
     */
    private createEditor(): Promise<void> {
        const element = document.createElement(this.tagName);
        this.editorElement = element;

        if (this.data && this.config.initialData) {
            throw new Error('Editor data should be provided either using `config.initialData` or `data` properties.');
        }

        // Merge two possible ways of providing data into the `config.initialData` field.
        const config = {
            ...this.config,
            initialData: this.config.initialData || this.data || '', extraPlugins: [MyCustomUploadAdapterPlugin],
        };

        this.elementRef.nativeElement.appendChild(element);

        return this.editor!.create(element, config)
            .then(editor => {
                this.editorInstance = editor;

                if (this.initialIsDisabled) {
                    editor.isReadOnly = this.initialIsDisabled;
                }

                this.ngZone.run(() => {
                    this.ready.emit(editor);
                });

                this.setUpEditorEvents(editor);
            })
            .catch((err: Error) => {
                console.error(err.stack);
            });
    }

    /**
     * Integrates the editor with the component by attaching related event listeners.
     */
    private setUpEditorEvents(editor: CKEditor5.Editor): void {
        const modelDocument = editor.model.document;
        const viewDocument = editor.editing.view.document;

        modelDocument.on('change:data', (evt: CKEditor5.EventInfo<'change:data'>) => {
            this.ngZone.run(() => {
                if (this.cvaOnChange && !this.isEditorSettingData) {
                    const data = editor.getData();

                    this.cvaOnChange(data);
                }

                this.change.emit({ event: evt, editor });
            });
        });

        viewDocument.on('focus', (evt: CKEditor5.EventInfo<'focus'>) => {
            this.ngZone.run(() => {
                this.focus.emit({ event: evt, editor });
            });
        });

        viewDocument.on('blur', (evt: CKEditor5.EventInfo<'blur'>) => {
            this.ngZone.run(() => {
                if (this.cvaOnTouched) {
                    this.cvaOnTouched();
                }

                this.blur.emit({ event: evt, editor });
            });
        });
    }
}
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders } from '@angular/common/http';

class MyUploadAdapter {
    loader: any;
    xhr: any;

    constructor(loader) {
        
        // The file loader instance to use during the upload.
        this.loader = loader;
    }

    // Starts the upload process.
    upload() {
        return this.loader.file
            .then(file => new Promise((resolve, reject) => {
                this._initRequest();
                this._initListeners(resolve, reject, file);
                this._sendRequest(file);
            }));
    }

    // Aborts the upload process.
    abort() {
        if (this.xhr) {
            this.xhr.abort();
        }
    }

    // Initializes the XMLHttpRequest object using the URL passed to the constructor.
    _initRequest() {
        var customXMLHttpRequest = (function (jwtoken) {
            
            function getXMLHttpRequest(method, url, async) {
                var xmlHttpRequest = new XMLHttpRequest();
                xmlHttpRequest.open(method, url, async);
                xmlHttpRequest.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
                return xmlHttpRequest;
            }

            return getXMLHttpRequest;
        })(localStorage.getItem('token'));
        const xhr = this.xhr = customXMLHttpRequest('post', `${environment.privateUrl}/file/create/image/marketing/${localStorage.getItem("userId")}`, true);


        // Note that your request may look different. It is up to you and your editor
        // integration to choose the right communication channel. This example uses
        // a POST request with JSON as a data structure but your configuration
        // could be different.
    }

    // Initializes XMLHttpRequest listeners.
    _initListeners(resolve, reject, file) {
        
        const xhr = this.xhr;
        const loader = this.loader;
        const genericErrorText = `Couldn't upload file: ${file.name}.`;

        xhr.addEventListener('error', () => reject(genericErrorText));
        xhr.addEventListener('abort', () => reject());
        xhr.addEventListener('load', () => {
            
            if (xhr.response != undefined) {
                const response = JSON.parse(xhr.response);
                // This example assumes the XHR server's "response" object will come with
                // an "error" which has its own "message" that can be passed to reject()
                // in the upload promise.
                //
                // Your integration may handle upload errors in a different way so make sure
                // it is done properly. The reject() function must be called when the upload fails.
                if (!response || response.error) {
                    return reject(response && response.error ? response.error.message : genericErrorText);
                }
                sessionStorage.setItem("url", response.url);
                // If the upload is successful, resolve the upload promise with an object containing
                // at least the "default" URL, pointing to the image on the server.
                // This URL will be used to display the image in the content. Learn more in the
                // UploadAdapter#upload documentation.
                resolve({
                    default: response.url
                });
            }
        });

        // Upload progress when it is supported. The file loader has the #uploadTotal and #uploaded
        // properties which are used e.g. to display the upload progress bar in the editor
        // user interface.
        if (xhr.upload) {
            xhr.upload.addEventListener('progress', evt => {
                if (evt.lengthComputable) {
                    loader.uploadTotal = evt.total;
                    loader.uploaded = evt.loaded;
                }
            });
        }
    }

    // Prepares the data and sends the request.
    _sendRequest(file) {
        // Prepare the form data.
        
        //for (var key of form_data.entries()) {
        //  console.log(key[0] + ', ' + key[1]);
        //}

        var formData = new FormData();
        formData.append("file", file);
        this.xhr.send(formData);
    }
}

// ...

function MyCustomUploadAdapterPlugin(editor, http) {
    
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        
        // Configure the URL to the upload script in your back-end here!
        return new MyUploadAdapter(loader);
    };
}
export interface BlurEvent {
    event: CKEditor5.EventInfo<'blur'>;
    editor: CKEditor5.Editor;
}

export interface FocusEvent {
    event: CKEditor5.EventInfo<'focus'>;
    editor: CKEditor5.Editor;
}

export interface ChangeEvent {
    event: CKEditor5.EventInfo<'change:data'>;
    editor: CKEditor5.Editor;
}
