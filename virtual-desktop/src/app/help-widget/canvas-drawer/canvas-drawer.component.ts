import {
  Component,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import * as html2canvas from 'html2canvas';
import {fromEvent, Observable, Subscription} from 'rxjs';
import {pairwise, switchMap, takeUntil, tap} from 'rxjs/operators';
import {TextAreaComponent} from '../text-area/text-area.component';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'iz-canvas-drawer',
  templateUrl: './canvas-drawer.component.html',
  styleUrls: ['./canvas-drawer.component.scss']
})
export class CanvasDrawerComponent {

  showReporter: boolean;
  markCounter: number;
  iframe: HTMLIFrameElement;
  tool: string;

  private isScreenshotLoading = false;

  private canvas: HTMLCanvasElement;
  private cx: CanvasRenderingContext2D;

  private $currentTool: Subscription;

  componentRef: any;
  @ViewChild('canvasContainer', {read: ViewContainerRef}) entry: ViewContainerRef;

  constructor(
    private resolver: ComponentFactoryResolver,
    private http: HttpClient,
  ) {
    this.destroyDrawer();
  }

  createComponent(position) {
    for (let i = 0; i < this.entry.length; i++) {
      const viewRef = this.entry.get(i);
      // @ts-ignore
      if (!viewRef._view.nodes[1].instance.text) {
        viewRef.destroy();
      }
    }

    const factory = this.resolver.resolveComponentFactory(TextAreaComponent);
    this.componentRef = this.entry.createComponent(factory);
    this.componentRef.instance.position = position;
    this.componentRef.instance.focus();
  }

  destroyComponent() {
    this.componentRef.destroy();
  }
  
  destroyDrawer() {
    this.showReporter = false;
    this.markCounter = 0;
    this.resetTool();
  }

  getIFrameCanvas() {
    this.iframe = document.querySelector('iframe');

    if (!this.iframe) {
      return Promise.resolve(null);
    }

    const iframeDocument = this.iframe.contentDocument || this.iframe.contentWindow.document;
    return html2canvas(iframeDocument.documentElement);
  }

  capture() {
    this.showReporter = true;
    this.isScreenshotLoading = true;

    Promise.all([
      html2canvas(document.documentElement, {
        allowTaint: true,
        ignoreElements: (el) => {
          return el.classList.contains('iz-help-container');
        }
      }),
      this.getIFrameCanvas(),
    ])
      .then(([canvas, iframeCanvas]) => {
        const reportCanvas = document.createElement('canvas');
        const pixelRatio = window.devicePixelRatio || 1;
        let {width, height} = canvas;
        width = width / pixelRatio;
        height = height / pixelRatio;
        reportCanvas.width = width * 0.8;
        reportCanvas.height = height * 0.8;
        this.cx = reportCanvas.getContext('2d');
        this.cx.drawImage(canvas, 0, 0, width * 0.8, height * 0.8);
        if (iframeCanvas) {
          const {width: iframeWidth, height: iframeHeight} = iframeCanvas;
          const {x, y}: DOMRect = this.iframe.getBoundingClientRect() as DOMRect;
          this.cx.drawImage(iframeCanvas, x * 0.8, y * 0.8, iframeWidth * 0.8, iframeHeight * 0.8);
        }
        this.isScreenshotLoading = false;
        console.log(document.querySelector('#izCanvas'));
        document.querySelector('#izCanvas').appendChild(reportCanvas);
        this.canvas = reportCanvas;
      });
  }

  stepperTool() {
    this.resetTool();
    this.tool = 'stepper';
    this.$currentTool = fromEvent(this.canvas, 'click').subscribe((e: any) => {
      const x = e.clientX - e.target.offsetLeft;
      const y = e.clientY - e.target.offsetTop;
      this.cx.beginPath();
      this.cx.arc(x, y, 25, 0, 2 * Math.PI);
      this.cx.fillStyle = '#FF0000';
      this.cx.fill();

      this.cx.font = '20px Arial';
      this.cx.fillStyle = '#FFFFFF';
      this.cx.fillText(++this.markCounter + '', x - 6, y + 7.5);
    });
  }

  penTool() {
    this.resetTool();
    this.tool = 'pen';
    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#ff0000';
    this.captureLineEvents();
  }

  markerTool() {
    this.resetTool();
    this.tool = 'marker';
    this.cx.lineWidth = 15;
    this.cx.lineCap = 'butt';
    this.cx.strokeStyle = 'rgba(255,0,0,0.4)';
    this.captureLineEvents();
  }

  textTool() {
    this.resetTool();
    this.tool = 'text';
    console.log('onTextTool click');
    this.captureTextCreationEvent();
  }

  private captureLineEvents() {
    this.$currentTool = fromEvent(this.canvas, 'mousedown')
      .pipe(
        switchMap((e) => {
          return fromEvent(this.canvas, 'mousemove')
            .pipe(
              takeUntil(fromEvent(this.canvas, 'mouseup')),
              takeUntil(fromEvent(this.canvas, 'mouseleave')),
              pairwise()
            );
        })
      )
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = this.canvas.getBoundingClientRect();

        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };

        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };

        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  private captureTextCreationEvent() {
    this.$currentTool = fromEvent(this.canvas, 'click')
      .subscribe((res: MouseEvent) => {
        const position = {
          x: `${res.clientX}px`,
          y: `${res.clientY}px`
        };

        this.createComponent(position);
        res.stopPropagation();
      });
  }

  private drawOnCanvas(prevPos: { x: number, y: number }, currentPos: { x: number, y: number }) {
    this.cx.beginPath();
    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y); // from
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
    }
  }

  private resetTool() {
    this.$currentTool && this.$currentTool.unsubscribe();
    this.tool = '';
  }

  private sendIssueReport() {
    const report = new IssueReport();
    html2canvas(document.querySelector('.canvas-sandbox'))
      .then(canvas => {
        report.base64Img = canvas.toDataURL('image/png');
        report.cc = 'dbarysevich@rocketsoftware.com, mtratseuski@rocketsoftware.com, uzinchanka@rocketsoftware.com';
        report.to = 'dskachkou@rocketsoftware.com';
        report.text = 'Yeah, it is issue reporting. You can find image in the attachments';
        report.subject = 'IntroZ issue reporting';

        this.http.post('http://localhost:3000/issueReport', report)
          .subscribe(
            () => console.log('Report was sent'),
            error => console.log('Error!!!', error)
          );
      });
  }
}

class IssueReport {
  id: string;
  to: string;
  cc: string;
  text: string;
  subject: string;
  base64Img: any;
}
