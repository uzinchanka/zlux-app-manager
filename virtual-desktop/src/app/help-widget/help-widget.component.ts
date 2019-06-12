
import { RoundButtonComponent } from './round-button/round-button.component';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CanvasDrawerComponent } from './canvas-drawer/canvas-drawer.component';
import { StepperService } from './service/stepper.service';

export interface Plugin {
  id: string;
  name: string;
  steppers: Stepper[];
}

export interface Stepper {
  id: string;
  name: string;
  steps: Step[];
}

export interface Step {
  index: number;
  selector: string;
  description: string;
  rect: any;
}

@Component({
  selector: 'help-widget',
  templateUrl: './help-widget.component.html',
  styleUrls: ['./help-widget.component.scss']
})
export class HelpWidgetComponent implements OnInit {

  showButtons: boolean;

  @ViewChild('izCanvasDrawer')
  izCanvasDrawer: CanvasDrawerComponent;


  plugins: Plugin[] = [{ id: '2', name: 'Plugin 1', steppers: [
    {
      id: '0',
      name: 'Stepper 1',
      steps: []
    }
  ] }];

  // HELP

  previousElement: any;
  previousElemStyle: any;

  steppers: Stepper[] = [];

  @ViewChild('helpMenu') helpMenu;
  
  // buttons
  @ViewChild('wizardButton', {read: ElementRef}) wizardButton: ElementRef<RoundButtonComponent>;
  @ViewChild('reportButton', {read: ElementRef}) reportButton: ElementRef<RoundButtonComponent>;
  @ViewChild('helpButton', {read: ElementRef}) helpButton: ElementRef<RoundButtonComponent>;

  @ViewChild('stepTooltip') stepTooltip;

  // menu
  isShownMenu: boolean;
  isShownOverlay: boolean;

  // tooltip
  tooltipOffsetTop: number = 10;
  isShownStepTooltip: boolean;
  stepDescription: string;

  // menu modes
  isPluginsMode: boolean = true;
  isInitMode: boolean = false;
  isCreationMode: boolean = false;
  isEditMode: boolean = false;

  // global modes
  isViewStepMode: boolean = false;
  isAddStepMode: boolean = false;
  isEditStepMode: boolean = false;

  currentStepper: Stepper;
  currentStepperName: string;
  lastStepperId: number = 0;

  // plugins
  currentPlugin: Plugin;

  currentStep: Step;
  isLastStep: boolean = false;
  descSrc = require('../../assets/images/help-widget/description.svg');
  closeSrc = require('../../assets/images/help-widget/close.svg');
  reportSrc = require('../../assets/images/help-widget/report.svg');

  constructor(private stepperService: StepperService) {
    this.showButtons = false;
    // this.stepperService.getSteppersForInstalledPlugins().then((steppers)=>{
    //   this.steppers = steppers;
    //   console.log('I am steppers', this.steppers);
    // });
  }

  toggleShowButtons() {
    this.showButtons = !this.showButtons;
  }

  reportClicked() {
    this.izCanvasDrawer.capture();
  }

  closeMenu() {
    this.isShownMenu = !this.isShownMenu;
  }

  hide(event) {
    event.target.classList.add('hide');
  }

  show(event) {
    event.target.classList.remove('hide');
  }

  wizardsClicked() {
    this.isViewStepMode = false;
    this.isShownMenu = !this.isShownMenu;
    this.toggleShowButtons();

    //ZoweZLUX.pluginManager.pluginsById;

  }

  // HELP

  backToPluginsClick() {
    this.isPluginsMode = true;
    this.isInitMode = false;
  }

  onPluginClick(plugin) {
    this.isPluginsMode = false;
    this.isInitMode = true;
    this.currentPlugin = plugin;
  }

  setTooltipPosition(rect) {
    this.stepTooltip.nativeElement.style.left = rect.left + 'px';
    this.stepTooltip.nativeElement.style.top = rect.top + rect.height + this.tooltipOffsetTop + 'px';
  }
  ngOnInit() {

    // this.plugins = [
      
    // ];

    var self = this;
    document.body.addEventListener("mouseover", function(e) {

      e.stopPropagation();

      if (!self.isShownOverlay || self.isEditStepMode || self.isShownStepTooltip 
          || (self.isShownStepTooltip && !self.isViewStepMode)) return;

      if (
        e.target == (<any>self.stepTooltip).nativeElement || (<any>self.stepTooltip).nativeElement.contains(e.target) ||
        (self.helpMenu && (e.target == <any>self.helpMenu.nativeElement || (<any>self.helpMenu.nativeElement).contains(e.target))) ||
        (self.wizardButton && (e.target == <any>self.wizardButton.nativeElement || (<any>self.wizardButton.nativeElement).contains(e.target))) ||
        (self.reportButton && (e.target == <any>self.reportButton.nativeElement || (<any>self.reportButton.nativeElement).contains(e.target))) ||
        (self.helpButton && (e.target == <any>self.helpButton.nativeElement || (<any>self.helpButton.nativeElement).contains(e.target)))
      ) return;

      let event = e || window.event;

      if (self.previousElement) {
        self.previousElement.classList.remove('chosen');
      }
  
      var targetElem = event.target || event.srcElement;

      (<any>targetElem).classList.add('chosen');

      self.previousElement = targetElem;

      targetElem.addEventListener("click", function(e) {

        e.stopPropagation();

        let tooltip = self.stepTooltip.nativeElement;

        if (
          e.target == tooltip || tooltip.contains(e.target) ||
          (self.helpMenu && (e.target == <any>self.helpMenu.nativeElement || (<any>self.helpMenu.nativeElement).contains(e.target))) ||
          (self.wizardButton && (e.target == <any>self.wizardButton.nativeElement || (<any>self.wizardButton.nativeElement).contains(e.target))) ||
          (self.reportButton && (e.target == <any>self.reportButton.nativeElement || (<any>self.reportButton.nativeElement).contains(e.target))) ||
          (self.helpButton && (e.target == <any>self.helpButton.nativeElement || (<any>self.helpButton.nativeElement).contains(e.target)))
        ) return;

        let rect = (<any>targetElem).getBoundingClientRect();

        self.setTooltipPosition(rect);
        // tooltip.style.left = rect.left + 'px';
        // tooltip.style.top = rect.top + rect.height + self.tooltipOffsetTop + 'px';

        // show tooltip with description
        self.isShownStepTooltip = true;

      }, { once: true });

      console.log(targetElem);

     });
  
  }

  onAddStepperClick() {

    this.currentStepper = null;
    this.currentStep = null;
    this.currentStepperName = '';
    
    this.isEditStepMode = false;
    this.isShownStepTooltip = false;
    
    this.isShownMenu = true;
    this.isInitMode = false;
    this.isCreationMode = true;

    // create Stepper instance
    this.currentStepper = {
      id: ++this.lastStepperId + '',
      name: '',
      steps: []
    };

    this.currentPlugin.steppers.push(this.currentStepper);

  }


  // creation mode methods

  onAddNewStepClick() {

    this.isShownOverlay = false;
    this.isShownMenu = false;
    this.isShownStepTooltip = false;
    this.isShownOverlay = true;
    this.isShownMenu = false;
    this.isAddStepMode = true;
    this.isEditStepMode = false;

    this.stepDescription = '';

  }

  onFinishStepper() {

    this.currentStepper.name = this.currentStepperName;

    if (this.currentStepper.steps.length) {

      if (this.isCreationMode) {
        this.steppers.push(this.currentStepper);
      } else if (this.isEditMode) {
        // get stepper from array by id

      }

      
    }

    this.isInitMode = true;
    this.isCreationMode = false;
    this.isEditMode = false;

  }

  // TOOLTIP

  cancelAddStepClick() {

    this.isShownStepTooltip = false;
    this.isShownOverlay = false;
    this.isShownMenu = true;
    this.stepDescription = '';

    // remove all 'chosen' class
    this.previousElement.classList.remove('chosen');
  }

  addStepClick() {

    if (!this.stepDescription) return;

    this.isShownOverlay = false;
    this.isShownStepTooltip = false;
    this.isShownMenu = true;

    if (this.isAddStepMode) {
      const selector = this.generateSelector(this.previousElement);
      let step: Step = {
        index: 0,
        selector: selector,
        description: this.stepDescription,
        rect: null
      }
      this.currentStep = step;
      this.currentStepper.steps.push(step);

    } else if (this.isEditStepMode) {
      this.currentStep.description = this.stepDescription;
    }

    this.stepDescription = '';
    
    // remove all 'chosen' class
    this.previousElement.classList.remove('chosen');

  }

  onViewStepClick(step) {

    this.isLastStep = false;

    this.isShownOverlay = true;
    this.isShownMenu = false;
    this.isShownStepTooltip = true;
    this.isViewStepMode = true;
    this.isEditStepMode = false;
    this.isAddStepMode = false;

    this.previousElement && this.previousElement.classList.remove('chosen');
    const currentElement = document.querySelector(step.selector);
    this.previousElement = currentElement;
    this.setTooltipPosition(currentElement.getBoundingClientRect());

    this.currentStep = step;

    const steps = this.currentStepper.steps
    for (let i = 0; i < steps.length; i++) {
      if (step.selector == steps[i].selector) {
        if (steps.length <= i + 1) {
          this.isLastStep = true;
        }
      }
    }

    // add 'chosen' class
    currentElement.classList.add('chosen');

    // get current stepDescription from step
    this.getCurrentStepDescription(step);

  }

  onEditStepClick(step) {

    this.isShownOverlay = true;
    this.isShownMenu = false;
    this.isEditStepMode = true;
    this.isAddStepMode = false;
    this.isShownStepTooltip = true;

    this.currentStep = step;

    this.previousElement && this.previousElement.classList.remove('chosen');
    const currentElement = document.querySelector(step.selector);
    this.previousElement = currentElement;

    // add 'chosen' class
    currentElement.classList.add('chosen');

    // get current stepDescription from step
    this.getCurrentStepDescription(step);    
  }

  onDeleteStepClick(step) {
    
  }


  finishGuideStepClick() {

    this.isShownOverlay = false;
    this.isShownStepTooltip = false;
    this.isShownMenu = true;

    this.isLastStep = false;

    // remove all 'chosen' class
    this.previousElement.classList.remove('chosen');

    // if (this.isEditStepMode) {

    //   let steps = this.currentStepper.steps;
    //   let currentElement = this.previousElement;

    //   // steps.forEach((item) => {
    //   //   if (this.currentStep) {}
    //   // });

    // } else if (this.isViewStepMode) {


    //   this.isShownOverlay = false;
    //   this.isShownStepTooltip = false;
    //   this.isShownMenu = true;

    //   // remove all 'chosen' class
    //   this.previousElement.classList.remove('chosen');

    // }

  }

  nextStepClick() {

    // get next step from steps
    const steps = this.currentStepper.steps;
    const step = this.currentStep;

    for (let i = 0; i < steps.length; i++) {

      if (step.selector == steps[i].selector) {
        if (steps.length <= i + 2) {
          this.isLastStep = true;
        }

        this.currentStep = steps[i + 1];
        if (this.currentStep) {
          this.previousElement && this.previousElement.classList.remove('chosen');
          const currentElement = document.querySelector(this.currentStep.selector);
          this.previousElement = currentElement;

          // add 'chosen' class
          currentElement.classList.add('chosen');

          // get current stepDescription from step
          this.getCurrentStepDescription(this.currentStep);
          this.setTooltipPosition(currentElement.getBoundingClientRect());
        } 
      }
    }
  }

  checkLastStep() {

  }

  // STEPPER
  onViewStepperClick(stepper) {

  }

  onEditStepperClick(stepper) {

    this.currentStepper = stepper;

    this.isEditMode = true;
    this.isInitMode = false;
    
  }

  onDeleteStepperClick(stepper) {

  }

  // generate step selector
  generateSelector(elem) {

    let selectorArray = [];
    let selector = 'APP-ROOT'; 
    let currentElem = elem;

    while (currentElem.nodeName != 'APP-ROOT') { 

      // check if there are siblings with same nodeName
      // if it is -> add :nth-child(n) to selector

      let siblings = currentElem.parentNode.children;

      let index = 0;
      if (siblings.length > 1) {
        for (let j = 0; j < siblings.length; j++) {
          let element = siblings[j];
          index++;
          if (currentElem == element) {
            break;
          }
        }
      }

      const currentSelector = (index > 0) ? currentElem.nodeName + ':nth-child(' + index + ')' : currentElem.nodeName;
      selectorArray.push(currentSelector.toLowerCase());
      currentElem = currentElem.parentElement;
    }

    selectorArray = selectorArray.reverse();

    selectorArray.forEach(function (item) {
      selector += (' ' + item);
    }); 

    return selector;

  }


  // generate id 

  getStepBySelector(selector: string): Step {
    let steps = this.currentStepper.steps;
    let currentStep: Step;
    for (let i = 0; i < steps.length; i++) {
      if (steps[i].selector == selector) {
        currentStep = steps[i];
      }
    }

    return currentStep;
  }

  getCurrentStepDescription(step: Step) {
    const currentStep = this.getStepBySelector(step.selector);
    if (currentStep) {
      this.stepDescription = currentStep.description;
    }
  }
}
