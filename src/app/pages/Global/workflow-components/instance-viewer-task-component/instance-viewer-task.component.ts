import {Component, Input, OnInit} from '@angular/core';
import {MdbModalRef} from "mdb-angular-ui-kit/modal";
import {ToastrService} from "ngx-toastr";
import * as Raphael from 'raphael';
import * as qtip from 'qtip2';
import {interval, Observable} from "rxjs";
import {startWith, switchMap} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { TokenStorageService } from '../../shared-service/token-storage.service';
import { EnvService } from 'src/env.service';

@Component({
  selector: 'app-instance-viewer-task',
  templateUrl: './instance-viewer-task.component.html',
  styleUrls: ['./instance-viewer-task.component.scss']
})
export class InstanceViewerTaskComponent implements OnInit {




  typeIndex: any = 0;
  modelDiv: any = jQuery('#bpmnModelSub');
  customActivityBackgroundOpacity: any = this.modelDiv.attr('data-activity-opacity');
  customActivityColors: any = this.modelDiv.attr('data-activity-color-mapping');
  customActivityToolTips: any = this.modelDiv.attr('data-activity-tooltips');
  MAIN_STROKE_COLOR: any = '#585858';
  HOVER_COLOR: any = '#666666';
  NORMAL_STROKE: any = 1;
  ACTIVITY_STROKE_COLOR: any = '#bbbbbb';
  ACTIVITY_FILL_COLOR: any = '#f9f9f9';
  CALL_ACTIVITY_STROKE: any = 2;
  TASK_STROKE: any = 1;
  ASSOCIATION_STROKE: any = 2;
  CURRENT_COLOR_SEQUENCE: any = '#ff1917';
  COMPLETED_COLOR_SEQUENCE: any = '#2794bd';
  TASK_HIGHLIGHT_STROKE: any = 2;
  TEXT_PADDING: any = 3;
  SEQUENCEFLOW_STROKE: any = 1.5;
  ARROW_WIDTH: any = 4;
  CURRENT_COLOR: any = '#a93c71';
  COMPLETED_COLOR: any = '#2db73e';

  INITIAL_CANVAS_WIDTH: any;
  INITIAL_CANVAS_HEIGHT: any;

  ENDEVENT_STROKE: any = 3;

  viewBoxWidth: any;
  viewBoxHeight: any;

  canvasWidth: any;
  canvasHeight: any;

  elementsAdded: any[] = [];
  elementsRemoved: any[] = [];



  paper: any;


  modelJSON: any[] = [];

  @Input()  wfProcessID: any[] = []

  constructor(private toastr: ToastrService, private http:HttpClient,private env: EnvService, private tokenStorage: TokenStorageService) { }

  ngOnInit() {

    this.http.patch(this.env.apiUrlkernel + 'workflow/instance/'+this.wfProcessID+'/json',{} ,{headers: new HttpHeaders().set("Authorization", this.tokenStorage.getToken()).append("application", require('package.json').name)}).subscribe((model:any[])=> {
      this.modelJSON = model;


      // jQuery('#bpmnModel').empty();
      // jQuery('#bpmnModel').contents().remove();
      const data = this.modelJSON[0];
      const elements = this.modelJSON[1];

      let offsetCustomX = 0;
      let offsetCustomY = 0;
      offsetCustomX = data.childShapes[0].bounds.upperLeft.x;
      offsetCustomY = data.childShapes[0].bounds.upperLeft.y;


      this.INITIAL_CANVAS_WIDTH = (data.childShapes[0].bounds.lowerRight.x - data.childShapes[0].bounds.upperLeft.x) + 50;
      this.INITIAL_CANVAS_HEIGHT = (data.childShapes[0].bounds.lowerRight.y - data.childShapes[0].bounds.upperLeft.y) + 50;


      this.canvasWidth = this.INITIAL_CANVAS_WIDTH;
      this.canvasHeight = this.INITIAL_CANVAS_HEIGHT;

      this.viewBoxWidth = this.INITIAL_CANVAS_WIDTH;
      this.viewBoxHeight = this.INITIAL_CANVAS_HEIGHT;

      const headerBarHeight = 0;
      let offsetY = 0;
      if (jQuery(window).height() > (this.canvasHeight + headerBarHeight)) {
        offsetY = (jQuery(window).height() - headerBarHeight - this.canvasHeight) / 2;
      }
      if (offsetY > 50) {
        offsetY = 50;
      }
      // jQuery('#bpmnModel').css('marginTop', 0);
      // jQuery('#bpmnModel').width('auto');
      // jQuery('#bpmnModel').height('auto');
      this.paper = Raphael(document.getElementById('bpmnModelSub'), 'auto', 'auto');
      this.paper.setViewBox(0, 0, this.viewBoxWidth, this.viewBoxHeight, false);
      this.paper.renderfix();

      this.createElement(data.childShapes, data);

      if (elements) {
        for (let i = 0; i < elements.length; i++) {
          const flow = elements[i];
          let index = 0;
          while (flow.waypoints[index]) {

            flow.waypoints[index].x = flow.waypoints[index].x - offsetCustomX;
            flow.waypoints[index].y = flow.waypoints[index].y - offsetCustomY;


            index++;
          }
          if (flow.type === 'sequenceFlow') {
            if (flow.active) {
              flow['completed'] = true;
            }

            this._drawFlow(flow);

          }
        }
      }
    });
  }




  /**
   * @Base typescript
   *
   * @role process the bpmn json to draw elements
   *
   * @module display.js
   */

  createElement(elements, parent) {

    elements.forEach(elem => {
      if (elem.stencil.id === 'Pool') {

        let offsetX = (elem.bounds.lowerRight.x  - elem.bounds.upperLeft.x)
        let offsetY = (elem.bounds.lowerRight.y  - elem.bounds.upperLeft.y)
        elem.bounds.upperLeft.x = 0;
        elem.bounds.upperLeft.y = 0;
        this._drawCustomPool(elem.bounds.upperLeft.x, elem.bounds.upperLeft.y, offsetX, offsetY, elem.properties.name);
      } else if (elem.stencil.id === 'Lane') {
        this._drawCustomLane(parent.bounds.upperLeft.x + elem.bounds.upperLeft.x, parent.bounds.upperLeft.y + elem.bounds.upperLeft.y, (elem.bounds.lowerRight.x - elem.bounds.upperLeft.x), (elem.bounds.lowerRight.y - elem.bounds.upperLeft.y), elem.properties.name);
        elem.bounds.upperLeft.x = parent.bounds.upperLeft.x + elem.bounds.upperLeft.x;
        elem.bounds.upperLeft.y = parent.bounds.upperLeft.y + elem.bounds.upperLeft.y;
      } else if (elem.stencil.id === 'StartNoneEvent') {

        const elemTemp = { id: elem.resourceId, name: elem.properties.name, x: parent.bounds.upperLeft.x + elem.bounds.upperLeft.x, y: parent.bounds.upperLeft.y + elem.bounds.upperLeft.y, width: (elem.bounds.lowerRight.x - elem.bounds.upperLeft.x), height: (elem.bounds.lowerRight.y - elem.bounds.upperLeft.y), type: 'StartEvent', interrupting: true, properties: []}
        if (elem.properties.active) {
          elemTemp['completed'] = true;
        }
        if (elem.properties.current) {
          elemTemp['current'] = true;

        }
        this._drawStartEvent(elemTemp);
        elem.bounds.upperLeft.x = parent.bounds.upperLeft.x + elem.bounds.upperLeft.x;
        elem.bounds.upperLeft.y = parent.bounds.upperLeft.y + elem.bounds.upperLeft.y;

      } else if (elem.stencil.id === 'EndNoneEvent') {

        const elemTemp = { id: elem.resourceId, name: elem.properties.name, x: parent.bounds.upperLeft.x + elem.bounds.upperLeft.x, y: parent.bounds.upperLeft.y + elem.bounds.upperLeft.y, width: (elem.bounds.lowerRight.x - elem.bounds.upperLeft.x), height: (elem.bounds.lowerRight.y - elem.bounds.upperLeft.y), type: 'EndEvent', interrupting: true, properties: []}
        if (elem.properties.active) {
          elemTemp['completed'] = true;
        }
        if (elem.properties.current) {
          elemTemp['current'] = true;

        }
        this._drawEndEvent(elemTemp)
        elem.bounds.upperLeft.x = parent.bounds.upperLeft.x + elem.bounds.upperLeft.x;
        elem.bounds.upperLeft.y = parent.bounds.upperLeft.y + elem.bounds.upperLeft.y;

      } else if (elem.stencil.id === 'UserTask') {
        const elemTemp = { id: elem.resourceId, name: elem.properties.name, x: parent.bounds.upperLeft.x + elem.bounds.upperLeft.x, y: parent.bounds.upperLeft.y + elem.bounds.upperLeft.y, width: (elem.bounds.lowerRight.x - elem.bounds.upperLeft.x), height: (elem.bounds.lowerRight.y - elem.bounds.upperLeft.y), type: 'UserTask', properties: [{name: 'Date Debut', type: 'list', value: []}, {name: 'Responsable', type: 'list', value: []}, {name: 'Réaliser Par', type: 'list', value: []}, {name: 'Réaliser Le', type: 'list', value: []}]}
        let index = 0;
        while (elem['properties' + index]) {
          if (elem['properties' + index].usertaskassignment !== null) {
            if (elem['properties' + index].usertaskassignment.assignment !== null) {

              //TODO DONE
              if (elem['properties' + index].usertaskassignment.assignment.Assignee) {
                if (elem['properties' + index].usertaskassignment.assignment.Assignee !== null) {
                  if(elem['properties' + index].usertaskassignment.assignment.startDate[0] && elem['properties' + index].usertaskassignment.assignment.startDate[0].value !== null && elem['properties' + index].usertaskassignment.assignment.startDate[0].value !== 'null'){
                    elem['properties' + index].usertaskassignment.assignment.Assignee.forEach(assignment => {
                      if (elemTemp['properties' + index]) {
                        elemTemp['properties' + index][1].value.push(assignment.value);
                      } else {
                        elemTemp['properties' + index] = [{name: 'Date Début', type: 'list', value: []}, {name: 'Responsable', type: 'list', value: []}, {name: 'Réalisé par', type: 'list', value: []}, {name: 'Réalisé le', type: 'list', value: []}];
                        elemTemp['properties' + index][1].value.push(assignment.value);
                      }
                    });
                  }
                }
              }

              //TODO DONE
              if (elem['properties' + index].usertaskassignment.assignment.actionaire) {
                if (elem['properties' + index].usertaskassignment.assignment.actionaire !== null) {
                  if(elem['properties' + index].usertaskassignment.assignment.endDate[0] && elem['properties' + index].usertaskassignment.assignment.endDate[0].value !== null && elem['properties' + index].usertaskassignment.assignment.endDate[0].value !== 'null'){
                    elem['properties' + index].usertaskassignment.assignment.actionaire.forEach(assignment => {
                      if (elemTemp['properties' + index]) {
                        elemTemp['properties' + index][2].value.push(assignment.value);
                      } else {
                        elemTemp['properties' + index] = [{name: 'Date Début', type: 'list', value: []}, {name: 'Responsable', type: 'list', value: []}, {name: 'Réalisé par', type: 'list', value: []}, {name: 'Réalisé le', type: 'list', value: []}];
                        elemTemp['properties'+ index][2].value.push(assignment.value);
                      }
                    });
                  }
                }
              }

              //TODO DONE
              if (elem['properties' + index].usertaskassignment.assignment.startDate) {
                if (elem['properties' + index].usertaskassignment.assignment.startDate !== null) {
                  if(elem['properties' + index].usertaskassignment.assignment.startDate[0] && elem['properties' + index].usertaskassignment.assignment.startDate[0].value !== null && elem['properties' + index].usertaskassignment.assignment.startDate[0].value !== 'null'){
                    elem['properties' + index].usertaskassignment.assignment.startDate.forEach(assignment => {
                      if (elemTemp['properties' + index]) {
                        elemTemp['properties' + index][0].value.push(assignment.value);
                      } else {
                        elemTemp['properties' + index] = [{name: 'Date Début', type: 'list', value: []}, {name: 'Responsable', type: 'list', value: []}, {name: 'Réalisé par', type: 'list', value: []}, {name: 'Réalisé le', type: 'list', value: []}];
                        elemTemp['properties'+ index][0].value.push(assignment.value);
                      }
                    });
                  }
                }
              }

              //TODO DONE
              if (elem['properties' + index].usertaskassignment.assignment.endDate) {
                if (elem['properties' + index].usertaskassignment.assignment.endDate !== null) {
                  if(elem['properties' + index].usertaskassignment.assignment.endDate[0] && elem['properties' + index].usertaskassignment.assignment.endDate[0].value !== null && elem['properties' + index].usertaskassignment.assignment.endDate[0].value !== 'null'){
                    elem['properties' + index].usertaskassignment.assignment.endDate.forEach(assignment => {
                      if (elemTemp['properties' + index]) {
                        elemTemp['properties' + index][3].value.push(assignment.value);
                      } else {
                        elemTemp['properties' + index] = [{name: 'Date Début', type: 'list', value: []}, {name: 'Responsable', type: 'list', value: []}, {name: 'Réalisé par', type: 'list', value: []}, {name: 'Réalisé le', type: 'list', value: []}];
                        elemTemp['properties'+ index][3].value.push(assignment.value);
                      }
                    });
                  }
                }
              }

            }
          }
          index++;
        }

        if (!elem['properties']['active']) {
          if (elem['properties'].usertaskassignment) {
            if (elem['properties'].usertaskassignment.assignment) {

              //TODO DONE
              if (elem['properties'].usertaskassignment.assignment.assignee) {
                if (elem['properties'].usertaskassignment.assignment.assignee !== null) {
                  if (elemTemp['properties']) {
                    elemTemp['properties'][1].value.push(elem['properties'].usertaskassignment.assignment.assignee);
                  } else {
                    elemTemp['properties'] =   [{name: 'Date Début', type: 'list', value: []}, {name: 'Responsable', type: 'list', value: []}, {name: 'Réalisé par', type: 'list', value: []}, {name: 'Réalisé le', type: 'list', value: []}];
                    elemTemp['properties'][0].value.push(elem['properties'].usertaskassignment.assignment.assignee);
                  }
                }
              }
            }
          }

        }
        if (elem.properties.active) {
          elemTemp['completed'] = true;
        }
        if (elem.properties.current) {
          elemTemp['current'] = true;

        }
        this._drawUserTask(elemTemp)
        elem.bounds.upperLeft.x = parent.bounds.upperLeft.x + elem.bounds.upperLeft.x;
        elem.bounds.upperLeft.y = parent.bounds.upperLeft.y + elem.bounds.upperLeft.y;

      } else if (elem.stencil.id === 'ServiceTask') {

        const elemTemp = { id: elem.resourceId, name: elem.properties.name, x: parent.bounds.upperLeft.x + elem.bounds.upperLeft.x, y: parent.bounds.upperLeft.y + elem.bounds.upperLeft.y, width: (elem.bounds.lowerRight.x - elem.bounds.upperLeft.x), height: (elem.bounds.lowerRight.y - elem.bounds.upperLeft.y), type: 'ServiceTask', properties: []}
        if (elem.properties.active) {
          elemTemp['completed'] = true;
        }
        if (elem.properties.current) {
          elemTemp['current'] = true;

        }
        this._drawServiceTask(elemTemp);
        elem.bounds.upperLeft.x = parent.bounds.upperLeft.x + elem.bounds.upperLeft.x;
        elem.bounds.upperLeft.y = parent.bounds.upperLeft.y + elem.bounds.upperLeft.y;

      } else if (elem.stencil.id === 'SubProcess') {
        const elemTemp = { id: elem.resourceId, name: elem.properties.name, x: parent.bounds.upperLeft.x + elem.bounds.upperLeft.x, y: parent.bounds.upperLeft.y + elem.bounds.upperLeft.y, width: (elem.bounds.lowerRight.x - elem.bounds.upperLeft.x), height: (elem.bounds.lowerRight.y - elem.bounds.upperLeft.y), type: 'ServiceTask', properties: []}
        if (elem.properties.active) {
          elemTemp['completed'] = true;
        }
        if (elem.properties.current) {
          elemTemp['current'] = true;

        }
        this._drawSubProcess(elemTemp);
        elem.bounds.upperLeft.x = parent.bounds.upperLeft.x + elem.bounds.upperLeft.x;
        elem.bounds.upperLeft.y = parent.bounds.upperLeft.y + elem.bounds.upperLeft.y;

      }else if (elem.stencil.id === 'CallActivity') {
        const elemTemp = { id: elem.resourceId, name: elem.properties.name, x: parent.bounds.upperLeft.x + elem.bounds.upperLeft.x, y: parent.bounds.upperLeft.y + elem.bounds.upperLeft.y, width: (elem.bounds.lowerRight.x - elem.bounds.upperLeft.x), height: (elem.bounds.lowerRight.y - elem.bounds.upperLeft.y), type: 'ServiceTask', properties: []}
        if (elem.properties.active) {
          elemTemp['completed'] = true;
        }
        if (elem.properties.current) {
          elemTemp['current'] = true;

        }
        this._drawCallActivity(elemTemp);
        elem.bounds.upperLeft.x = parent.bounds.upperLeft.x + elem.bounds.upperLeft.x;
        elem.bounds.upperLeft.y = parent.bounds.upperLeft.y + elem.bounds.upperLeft.y;

      }else if (elem.stencil.id === 'ExclusiveGateway') {
        const elemTemp = { id: elem.resourceId, name: elem.properties.name, x: parent.bounds.upperLeft.x + elem.bounds.upperLeft.x, y: parent.bounds.upperLeft.y + elem.bounds.upperLeft.y, width: (elem.bounds.lowerRight.x - elem.bounds.upperLeft.x), height: (elem.bounds.lowerRight.y - elem.bounds.upperLeft.y), type: 'ExclusiveGateway'}
        if (elem.properties.active) {
          elemTemp['completed'] = true;
        }
        if (elem.properties.current) {
          elemTemp['current'] = true;

        }
        this._drawExclusiveGateway(elemTemp)
        elem.bounds.upperLeft.x = parent.bounds.upperLeft.x + elem.bounds.upperLeft.x;
        elem.bounds.upperLeft.y = parent.bounds.upperLeft.y + elem.bounds.upperLeft.y;

      }

      this.createElement(elem.childShapes, elem);
    });

  }






  /**
   * @Base javascrypt & jQuery
   *
   * @role drawing all elements of process bpmn
   *
   * @module bpmn-draw.js
   */

  _bpmnGetColor(element, defaultColor) {
    let strokeColor;

    if (element.type === 'sequenceFlow') {
      if (element.current) {
        strokeColor = this.CURRENT_COLOR_SEQUENCE;
      } else if (element.completed) {
        strokeColor = this.COMPLETED_COLOR_SEQUENCE;
      } else {
        strokeColor = defaultColor;
      }
    } else {
      if (element.current) {
        strokeColor = this.CURRENT_COLOR;
      } else if (element.completed) {
        strokeColor = this.COMPLETED_COLOR;
      } else {
        strokeColor = defaultColor;
      }
    }
    return strokeColor;
  }

  _addHoverLogic(element, type, defaultColor) {
    const strokeColor = this._bpmnGetColor(element, defaultColor);
    let topBodyRect = null;
    if (type === 'rect') {
      topBodyRect = this.paper.rect(element.x, element.y, element.width, element.height);
    } else if (type === 'circle') {
      const x = element.x + (element.width / 2);
      const y = element.y + (element.height / 2);
      topBodyRect = this.paper.circle(x, y, 15);
    } else if (type === 'rhombus') {
      topBodyRect = this.paper.path('M' + element.x + ' ' + (element.y + (element.height / 2)) +
          'L' + (element.x + (element.width / 2)) + ' ' + (element.y + element.height) +
          'L' + (element.x + element.width) + ' ' + (element.y + (element.height / 2)) +
          'L' + (element.x + (element.width / 2)) + ' ' + element.y + 'z'
      );
    }

    let opacity = 0;
    let fillColor = '#ffffff';
    if (jQuery.inArray(element.id, this.elementsAdded) >= 0) {
      opacity = 0.2;
      fillColor = 'green';
    }

    if (jQuery.inArray(element.id, this.elementsRemoved) >= 0) {
      opacity = 0.2;
      fillColor = 'red';
    }

    topBodyRect.attr({
      'opacity': opacity,
      'stroke' : 'none',
      'fill' : fillColor
    });
    this._showTip(jQuery(topBodyRect.node), element);

    const ref = this;

    topBodyRect.mouseover(function() {
      ref.paper.getById(element.id).attr({'stroke': ref.HOVER_COLOR});
    });

    topBodyRect.mouseout(function() {
      ref.paper.getById(element.id).attr({'stroke': strokeColor});
    });
  }

  _addHoverLogicCustom(element, type, defaultColor) {
    const strokeColor = this._bpmnGetColor(element, defaultColor);
    let topBodyRect = null;
    if (type === 'rect') {
      topBodyRect = this.paper.rect(element.x, element.y, element.width, element.height);
    } else if (type === 'circle') {
      const x = element.x + (element.width / 2);
      const y = element.y + (element.height / 2);
      topBodyRect = this.paper.circle(x, y, 15);
    } else if (type === 'rhombus') {
      topBodyRect = this.paper.path('M' + element.x + ' ' + (element.y + (element.height / 2)) +
          'L' + (element.x + (element.width / 2)) + ' ' + (element.y + element.height) +
          'L' + (element.x + element.width) + ' ' + (element.y + (element.height / 2)) +
          'L' + (element.x + (element.width / 2)) + ' ' + element.y + 'z'
      );
    }

    let opacity = 0;
    let fillColor = '#ffffff';
    if (jQuery.inArray(element.id, this.elementsAdded) >= 0) {
      opacity = 0.2;
      fillColor = 'green';
    }

    if (jQuery.inArray(element.id, this.elementsRemoved) >= 0) {
      opacity = 0.2;
      fillColor = 'red';
    }

    topBodyRect.attr({
      'opacity': opacity,
      'stroke' : 'none',
      'fill' : fillColor
    });
    this._showTipCustom(jQuery(topBodyRect.node), element);
    const ref = this;
    topBodyRect.mouseover(function() {
      ref.paper.getById(element.id).attr({'stroke': ref.HOVER_COLOR});
    });

    topBodyRect.mouseout(function() {
      ref.paper.getById(element.id).attr({'stroke': strokeColor});
    });
  }


  _showTip(htmlNode, element) {
    // Custom tooltip
    let documentation = undefined;


    if(element.type === 'ServiceTask' || element.type === 'SubProcess'){
      if (this.customActivityToolTips) {
        if (this.customActivityToolTips[element.name]) {
          documentation = this.customActivityToolTips[element.name] + '[AUTO]';
        } else if (this.customActivityToolTips[element.id]) {
          documentation = this.customActivityToolTips[element.id] + '[AUTO]';
        } else {
          documentation = ''; // Show nothing if custom tool tips are enabled
        }
      }
    }else{
      if (this.customActivityToolTips) {
        if (this.customActivityToolTips[element.name]) {
          documentation = this.customActivityToolTips[element.name];
        } else if (this.customActivityToolTips[element.id]) {
          documentation = this.customActivityToolTips[element.id];
        } else {
          documentation = ''; // Show nothing if custom tool tips are enabled
        }
      }
    }


    // Default tooltip, no custom tool tip set
    if (documentation === undefined) {
      documentation = '';
      // if (element.name && element.name.length > 0) {
      //   documentation += '<b>Name</b>: <i>' + element.name + '</i><br/><br/>';
      // }

      if (element.properties) {
        for (let i = 0; i < element.properties.length; i++) {
          const propName = element.properties[i].name;
          if (element.properties[i].type && element.properties[i].type === 'list') {
            documentation += '<b>' + propName + '</b>:<br/>';
            for (let j = 0; j < element.properties[i].value.length; j++) {
              documentation += '<i>' + element.properties[i].value[j] + '</i><br/>';
            }
          } else {
            documentation += '<b>' + propName + '</b>: <i>' + element.properties[i].value + '</i><br/>';
          }
        }
      }
    }

    //TODO DONE
    let text = element.type + ' ';
    let Extension = '';
    if(element.type === 'UserTask'){
      text = 'Etape';
    }else if(element.type === 'sequenceFlow'){
      text = 'Decision';
    }else if(element.type === 'ServiceTask'){
      text = 'Etape';
      Extension = ' [AUTO]'
    }else if(element.type === 'ExclusiveGateway'){
      text = 'Decision ?';
    }else if(element.type === 'StartEvent'){
      text = 'Événement';
    }else if(element.type === 'EndEvent'){
      text = 'Événement';
    }else if(element.type === 'SubProcess'){
      text = 'Etape';
    }

    if (element.name && element.name.length > 0) {
      text += ': ' + element.name + Extension;
    }

    htmlNode.qtip({
      content: {
        text: documentation,
        title: {
          text: text
        }
      },
      position: {
        my: 'top left',
        at: 'bottom center',
        viewport: jQuery('#bpmnModel')
      },
      hide: {
        fixed: true, delay: 500,
        event: 'click mouseleave'
      },
      style: {
        classes: 'ui-tooltip-kisbpm-bpmn'
      }
    });
  }

  _showTipCustom(htmlNode, element) {
    // Custom tooltip
    let documentation = undefined;
    if (this.customActivityToolTips) {
      if (this.customActivityToolTips[element.name]) {
        documentation = this.customActivityToolTips[element.name];
      } else if (this.customActivityToolTips[element.id]) {
        documentation = this.customActivityToolTips[element.id];
      } else {
        documentation = ''; // Show nothing if custom tool tips are enabled
      }
    }

    // Default tooltip, no custom tool tip set
    if (documentation === undefined) {
      documentation = '';
      // if (element.name && element.name.length > 0) {
      //   documentation += '<b>Name</b>: <i>' + element.name + '</i><br/><br/>';
      // }

      if (element['properties0']) {
        if (element['properties1']) {
          let index = 0;
          while (element['properties' + index]) {
            const props = element['properties' + index];
            documentation += '<b>(index + 1)</b><br/><br/>';
            for (let i = 0; i < props.length; i++) {
              const propName = props[i].name;
              if (props[i].type && props[i].type === 'list') {
                //TODO DONE
                let showProp = false;
                for (let j = 0; j < props[i].value.length; j++) {
                  if(props[i].value[j] !== null || props[i].value[j] !== 'null'){
                    showProp = true
                  }
                }
                if(showProp) {
                  documentation += '<b>' + propName + '</b>:<br/>';
                  for (let j = 0; j < props[i].value.length; j++) {
                    documentation += '<i>' + props[i].value[j] + '</i><br/>';
                  }
                }
              } else {
                if(props[i].value !== null && props[i].value !== 'null' ){
                  documentation += '<b>' + propName + '</b>: <i>' + props[i].value + '</i><br/>';
                }
              }
              documentation += '<br/>';
            }
            documentation += '<br/><br/>';
            index++;
          }
        } else {
          let index = 0;
          while (element['properties' + index]) {
            const props = element['properties' + index];
            for (let i = 0; i < props.length; i++) {
              const propName = props[i].name;
              if (props[i].type && props[i].type === 'list') {
                //TODO DONE
                let showProp = false;
                for (let j = 0; j < props[i].value.length; j++) {
                  if(props[i].value[j] !== null || props[i].value[j] !== 'null'){
                    showProp = true
                  }
                }
                if(showProp) {
                  documentation += '<b>' + propName + '</b>:<br/>';
                  for (let j = 0; j < props[i].value.length; j++) {
                    documentation += '<i>' + props[i].value[j] + '</i><br/>';
                  }
                }
              } else {
                if(props[i].value !== null && props[i].value !== 'null' ) {
                  documentation += '<b>' + propName + '</b>: <i>' + props[i].value + '</i><br/>';
                }
              }
              documentation += '<br/>';
            }
            index++;
          }
        }
      } else {
        if (element.properties) {
          for (let i = 0; i < element.properties.length; i++) {
            const propName = element.properties[i].name;
            if (element.properties[i].type && element.properties[i].type === 'list') {
              //TODO DONE
              let showProp = false;
              for (let j = 0; j < element.properties[i].value.length; j++) {
                if(element.properties[i].value[j] !== null || element.properties[i].value[j] !== 'null'){
                  showProp = true
                }
              }
              if(showProp) {
                documentation += '<b>' + propName + '</b>:<br/>';
                for (let j = 0; j < element.properties[i].value.length; j++) {
                  documentation += '<i>' + element.properties[i].value[j] + '</i><br/>';
                }
              }
            } else {
              if(element.properties[i].value !== null && element.properties[i].value !== 'null' ) {
                documentation += '<b>' + propName + '</b>: <i>' + element.properties[i].value + '</i><br/>';
              }
            }
            documentation += '<br/>';
          }
        }
      }
    }

    //TODO DONE
    let text = element.type + ' ';
    let Extension = '';
    if(element.type === 'UserTask'){
      text = 'Etape';
    }else if(element.type === 'sequenceFlow'){
      text = 'Trajet';
    }else if(element.type === 'ServiceTask'){
      text = 'Etape';
      Extension = ' [AUTO]'
    }else if(element.type === 'ExclusiveGateway'){
      text = 'Decision ?';
    }else if(element.type === 'StartEvent'){
      text = 'Événement';
    }else if(element.type === 'EndEvent'){
      text = 'Événement';
    }

    if (element.name && element.name.length > 0) {
      text += ': ' + element.name + Extension;
    }


    // htmlNode.directive('qtip', function() {
    //   return {
    //     restrict: 'A',
    //     link: function(scope, element, attrs) {
    //       $(element).qtip({
    //         content: {
    //           text: attrs.qtipText
    //         }
    //       });
    //     }
    //   };
    // }


    htmlNode.qtip({
      content: {
        text: documentation,
        title: {
          text: text
        }
      },
      position: {
        my: 'top left',
        at: 'bottom center',
        viewport: jQuery('#bpmnModel')
      },
      hide: {
        fixed: true, delay: 500,
        event: 'click mouseleave'
      },
      style: {
        classes: 'ui-tooltip-kisbpm-bpmn'
      }
    });
  }

  _drawCustomPool(x, y, width, height, name) {
    const rect = this.paper.rect(x, y, width, height);

    rect.attr({
      'stroke-width': 1,
      'stroke': '#000000',
      'fill': 'white'
    });

    if (name) {
      const poolName = this.paper.text(x + 14, y + (height / 2), name).attr({
        'text-anchor': 'middle',
        'font-family': 'Arial',
        'font-size': '12',
        'fill': '#000000'
      });

      poolName.transform('r270');
    }
  }

  _drawCustomLane(x, y, width, height, name) {
    const rect = this.paper.rect(x, y, width, height);

    rect.attr({
      'stroke-width': 1,
      'stroke': '#000000',
      'fill': 'white'
    });

    if (name) {
      const laneName = this.paper.text(x + 10, y + (height / 2), name).attr({
        'text-anchor': 'middle',
        'font-family': 'Arial',
        'font-size': '12',
        'fill': '#000000'
      });

      laneName.transform('r270');
    }
  }

  _drawPool(pool) {
    const rect = this.paper.rect(pool.x, pool.y, pool.width, pool.height);

    rect.attr({'stroke-width': 1,
      'stroke': '#000000',
      'fill': 'white'
    });

    if (pool.name) {
      const poolName = this.paper.text(pool.x + 14, pool.y + (pool.height / 2), pool.name).attr({
        'text-anchor' : 'middle',
        'font-family' : 'Arial',
        'font-size' : '12',
        'fill' : '#000000'
      });

      poolName.transform('r270');
    }

    if (pool.lanes) {
      for (let i = 0; i < pool.lanes.length; i++) {
        const lane = pool.lanes[i];
        this._drawLane(lane);
      }
    }
  }

  _drawLane(lane) {
    const rect = this.paper.rect(lane.x, lane.y, lane.width, lane.height);

    rect.attr({'stroke-width': 1,
      'stroke': '#000000',
      'fill': 'white'
    });

    if (lane.name) {
      const laneName = this.paper.text(lane.x + 10, lane.y + (lane.height / 2), lane.name).attr({
        'text-anchor' : 'middle',
        'font-family' : 'Arial',
        'font-size' : '12',
        'fill' : '#000000'
      });

      laneName.transform('r270');
    }
  }

  _drawSubProcess(element) {
    const rect = this.paper.rect(element.x, element.y, element.width, element.height, 4);

    const strokeColor = this._bpmnGetColor(element, this.MAIN_STROKE_COLOR);

    rect.attr({'stroke-width': 1,
      'stroke': strokeColor,
      'fill': 'white'
    });
  }

  _drawTransaction(element) {
    const rect = this.paper.rect(element.x, element.y, element.width, element.height, 4);

    const strokeColor = this._bpmnGetColor(element, this.MAIN_STROKE_COLOR);

    rect.attr({'stroke-width': 1,
      'stroke': strokeColor,
      'fill': 'white'
    });

    const borderRect = this.paper.rect(element.x + 2, element.y + 2, element.width - 4, element.height - 4, 4);

    borderRect.attr({'stroke-width': 1,
      'stroke': 'black',
      'fill': 'none'
    });
  }

  _drawEventSubProcess(element) {
    const rect = this.paper.rect(element.x, element.y, element.width, element.height, 4);
    const strokeColor = this._bpmnGetColor(element, this.MAIN_STROKE_COLOR);

    rect.attr({'stroke-width': 1,
      'stroke': strokeColor,
      'stroke-dasharray': '.',
      'fill': 'white'
    });
  }

  _drawAdhocSubProcess(element) {
    const rect = this.paper.rect(element.x, element.y, element.width, element.height, 4);

    const strokeColor = this._bpmnGetColor(element, this.MAIN_STROKE_COLOR);

    rect.attr({'stroke-width': 1,
      'stroke': strokeColor,
      'fill': 'white'
    });

    this.paper.text(element.x + (element.width / 2), element.y + element.height - 8).attr({
      'text-anchor' : 'middle',
      'font-family' : 'Arial',
      'font-size' : 20,
      'text' : '~',
      'fill' : '#373e48'
    });
  }

  _drawStartEvent(element) {
    const startEvent = this._drawEvent(element, this.NORMAL_STROKE, 15);
    startEvent.click(function() {
      this._zoom(true);
    });
    this._addHoverLogic(element, 'circle', this.MAIN_STROKE_COLOR);
  }

  _drawEndEvent(element) {
    const endEvent = this._drawEvent(element, this.ENDEVENT_STROKE, 14);
    endEvent.click(function() {
      this._zoom(false);
    });
    this._addHoverLogic(element, 'circle', this.MAIN_STROKE_COLOR);
  }

  _drawEvent(element, strokeWidth, radius) {
    const x = element.x + (element.width / 2);
    const y = element.y + (element.height / 2);

    const circle = this.paper.circle(x, y, radius);

    const strokeColor = this._bpmnGetColor(element, this.MAIN_STROKE_COLOR);

    // Fill
    const eventFillColor = this._determineCustomFillColor(element, '#ffffff');

    // Opacity
    let eventOpacity = 1.0;
    if (this.customActivityBackgroundOpacity) {
      eventOpacity = this.customActivityBackgroundOpacity;
    }

    if (element.interrupting === undefined || element.interrupting) {
      circle.attr({
        'stroke-width': strokeWidth,
        'stroke': strokeColor,
        'fill': eventFillColor,
        'fill-opacity': eventOpacity
      });

    } else {
      circle.attr({
        'stroke-width': strokeWidth,
        'stroke': strokeColor,
        'stroke-dasharray': '.',
        'fill': eventFillColor,
        'fill-opacity': eventOpacity
      });
    }

    circle.id = element.id;

    this._drawEventIcon(this.paper, element);

    return circle;
  }

  _drawServiceTask(element) {
    this._drawTask(element);
    if (element.taskType === 'mail') {
      this._drawSendTaskIcon(this.paper, element.x + 4, element.y + 4);
    } else if (element.taskType === 'camel') {
      this._drawCamelTaskIcon(this.paper, element.x + 4, element.y + 4);
    } else if (element.taskType === 'mule') {
      this._drawMuleTaskIcon(this.paper, element.x + 4, element.y + 4);
    } else if (element.taskType === 'http') {
      this._drawHttpTaskIcon(this.paper, element.x + 4, element.y + 4);
    } else if (element.taskType === 'shell') {
      this._drawShellTaskIcon(this.paper, element.x + 4, element.y + 4);
    } else if (element.taskType === 'dmn') {
      this._drawDecisionTaskIcon(this.paper, element.x + 4, element.y + 4);
    } else if (element.stencilIconId) {
      this.paper.image('../service/stencilitem/' + element.stencilIconId + '/icon', element.x + 4, element.y + 4, 16, 16);
    } else {
      this._drawServiceTaskIcon(this.paper, element.x + 4, element.y + 4);
    }
    this._addHoverLogic(element, 'rect', this.ACTIVITY_STROKE_COLOR);
  }

  _drawHttpServiceTask(element) {
    this._drawTask(element);
    this._drawHttpTaskIcon(this.paper, element.x + 4, element.y + 4);
    this._addHoverLogic(element, 'rect', this.ACTIVITY_STROKE_COLOR);
  }

  _drawCallActivity(element) {
    const width = element.width - (this.CALL_ACTIVITY_STROKE / 2);
    const height = element.height - (this.CALL_ACTIVITY_STROKE / 2);

    const rect = this.paper.rect(element.x, element.y, width, height, 4);

    const strokeColor = this._bpmnGetColor(element, this.ACTIVITY_STROKE_COLOR);

    // Fill
    const callActivityFillColor = this._determineCustomFillColor(element, this.ACTIVITY_FILL_COLOR);

    // Opacity
    let callActivityOpacity = 1.0;
    if (this.customActivityBackgroundOpacity) {
      callActivityOpacity = this.customActivityBackgroundOpacity;
    }

    rect.attr({'stroke-width': this.CALL_ACTIVITY_STROKE,
      'stroke': strokeColor,
      'fill': callActivityFillColor,
      'fill-opacity': callActivityOpacity
    });

    rect.id = element.id;

    if (element.name) {
      this._drawMultilineText(element.name, element.x, element.y, element.width, element.height, 'middle', 'middle', 11);
    }
    this._addHoverLogic(element, 'rect', this.ACTIVITY_STROKE_COLOR);
  }

  _drawScriptTask(element) {
    this._drawTask(element);
    this._drawScriptTaskIcon(this.paper, element.x + 4, element.y + 4);
    this._addHoverLogic(element, 'rect', this.ACTIVITY_STROKE_COLOR);
  }

  _drawUserTask(element) {
    this._drawTask(element);
    this._drawUserTaskIcon(this.paper, element.x + 4, element.y + 4);
    this._addHoverLogicCustom(element, 'rect', this.ACTIVITY_STROKE_COLOR);


  }

  _drawBusinessRuleTask(element) {
    this._drawTask(element);
    this._drawBusinessRuleTaskIcon(this.paper, element.x + 4, element.y + 4);
    this._addHoverLogic(element, 'rect', this.ACTIVITY_STROKE_COLOR);
  }

  _drawManualTask(element) {
    this._drawTask(element);
    this._drawManualTaskIcon(this.paper, element.x + 4, element.y + 4);
    this._addHoverLogic(element, 'rect', this.ACTIVITY_STROKE_COLOR);
  }

  _drawSendTask(element) {
    this._drawTask(element);
    this._drawSendTaskIcon(this.paper, element.x + 4, element.y + 4);
    this._addHoverLogic(element, 'rect', this.ACTIVITY_STROKE_COLOR);
  }

  _drawReceiveTask(element) {
    this._drawTask(element);
    this._drawReceiveTaskIcon(this.paper, element.x, element.y);
    this._addHoverLogic(element, 'rect', this.ACTIVITY_STROKE_COLOR);
  }

  _drawTask(element) {
    const rectAttrs = {};

    // Stroke
    const strokeColor = this._bpmnGetColor(element, this.ACTIVITY_STROKE_COLOR);

    let index = 2;



    let strokeWidth;
    if (strokeColor === this.ACTIVITY_STROKE_COLOR) {
      strokeWidth = this.TASK_STROKE;
    } else {
      strokeWidth = this.TASK_HIGHLIGHT_STROKE;
    }

    const width = element.width - (strokeWidth / 2);
    const height = element.height - (strokeWidth / 2);

    const rect = this.paper.rect(element.x, element.y, width, height, 4);
    rectAttrs['stroke-width'] = strokeWidth;
    rectAttrs['stroke'] = strokeColor;

    // Fill
    const fillColor = this._determineCustomFillColor(element, this.ACTIVITY_FILL_COLOR);
    rectAttrs['fill'] = fillColor;

    // Opacity
    if (this.customActivityBackgroundOpacity) {
      rectAttrs['fill-opacity'] = this.customActivityBackgroundOpacity;
    }

    rect.attr(rectAttrs);

    rect.id = element.id;

    if (element.name) {
      this._drawMultilineText(element.name, element.x, element.y, element.width, element.height, 'middle', 'middle', 11);
    }

    if(element.current){
      // chronométre OM
      interval(500)
          .pipe(
              startWith(0),
              switchMap(() => this.refreshScheduler())
          )
          .subscribe(res => {
            if((index % 2) === 0){
              rectAttrs['stroke'] = strokeColor;
              rectAttrs['stroke-width'] = strokeWidth + 1;
            }else{
              rectAttrs['stroke'] = 'pink';
              rectAttrs['stroke-width'] = strokeWidth;
            }
            rect.attr(rectAttrs);
            index++;
          });
    }

  }

  _drawExclusiveGateway(element) {
    this._drawGateway(element);
    const quarterWidth = element.width / 4;
    const quarterHeight = element.height / 4;

    const iks = this.paper.path(
        'M' + (element.x + quarterWidth + 3) + ' ' + (element.y + quarterHeight + 3) +
        'L' + (element.x + 3 * quarterWidth - 3) + ' ' + (element.y + 3 * quarterHeight - 3) +
        'M' + (element.x + quarterWidth + 3) + ' ' + (element.y + 3 * quarterHeight - 3) +
        'L' + (element.x + 3 * quarterWidth - 3) + ' ' + (element.y + quarterHeight + 3)
    );

    const strokeColor = this._bpmnGetColor(element, this.MAIN_STROKE_COLOR);

    // Fill
    const gatewayFillColor = this._determineCustomFillColor(element, this.ACTIVITY_FILL_COLOR);

    // Opacity
    let gatewayOpacity = 1.0;
    if (this.customActivityBackgroundOpacity) {
      gatewayOpacity = this.customActivityBackgroundOpacity;
    }


    iks.attr({'stroke-width': 3, 'stroke': strokeColor, 'fill': gatewayFillColor, 'fill-opacity': gatewayOpacity});

    this._addHoverLogic(element, 'rhombus', this.MAIN_STROKE_COLOR);
  }

  refreshScheduler(){
    return new Observable(observer => {

      observer.next(1);
      observer.complete();

    });
  }

  _drawParallelGateway(element) {
    this._drawGateway(element);

    const strokeColor = this._bpmnGetColor(element, this.MAIN_STROKE_COLOR);

    const path1 = this.paper.path('M 6.75,16 L 25.75,16 M 16,6.75 L 16,25.75');

    // Fill
    const gatewayFillColor = this._determineCustomFillColor(element, this.ACTIVITY_FILL_COLOR);

    // Opacity
    let gatewayOpacity = 1.0;
    if (this.customActivityBackgroundOpacity) {
      gatewayOpacity = this.customActivityBackgroundOpacity;
    }

    path1.attr({
      'stroke-width': 3,
      'stroke': strokeColor,
      'fill': gatewayFillColor,
      'fill-opacity': gatewayOpacity
    });

    path1.transform('T' + (element.x + 4) + ',' + (element.y + 4));

    this._addHoverLogic(element, 'rhombus', this.MAIN_STROKE_COLOR);
  }

  _drawInclusiveGateway(element) {
    this._drawGateway(element);

    const strokeColor = this._bpmnGetColor(element, this.MAIN_STROKE_COLOR);

    const circle1 = this.paper.circle(element.x + (element.width / 2), element.y + (element.height / 2), 9.75);

    // Fill
    const gatewayFillColor = this._determineCustomFillColor(element, this.ACTIVITY_FILL_COLOR);

    // Opacity
    let gatewayOpacity = 1.0;
    if (this.customActivityBackgroundOpacity) {
      gatewayOpacity = this.customActivityBackgroundOpacity;
    }

    circle1.attr({
      'stroke-width': 2.5,
      'stroke': strokeColor,
      'fill': gatewayFillColor,
      'fill-opacity': gatewayOpacity
    });

    this._addHoverLogic(element, 'rhombus', this.MAIN_STROKE_COLOR);
  }

  _drawEventGateway(element) {
    this._drawGateway(element);

    const strokeColor = this._bpmnGetColor(element, this.MAIN_STROKE_COLOR);

    const circle1 = this.paper.circle(element.x + (element.width / 2), element.y + (element.height / 2), 10.4);

    // Fill
    const gatewayFillColor = this._determineCustomFillColor(element, this.ACTIVITY_FILL_COLOR);

    // Opacity
    let gatewayOpacity = 1.0;
    if (this.customActivityBackgroundOpacity) {
      gatewayOpacity = this.customActivityBackgroundOpacity;
    }

    circle1.attr({
      'stroke-width': 0.5,
      'stroke': strokeColor,
      'fill': gatewayFillColor,
      'fill-opacity': gatewayOpacity
    });

    const circle2 = this.paper.circle(element.x + (element.width / 2), element.y + (element.height / 2), 11.7);
    circle2.attr({
      'stroke-width': 0.5,
      'stroke': strokeColor,
      'fill': gatewayFillColor,
      'fill-opacity': gatewayOpacity
    });
    const path1 = this.paper.path('M 20.327514,22.344972 L 11.259248,22.344216 L 8.4577203,13.719549 L 15.794545,8.389969 L 23.130481,13.720774 L 20.327514,22.344972 z');
    path1.attr({
      'stroke-width': 1.39999998,
      'stroke': strokeColor,
      'fill': gatewayFillColor,
      'fill-opacity': gatewayOpacity,
      'stroke-linejoin': 'bevel'
    });

    path1.transform('T' + (element.x + 4) + ',' + (element.y + 4));

    this._addHoverLogic(element, 'rhombus', this.MAIN_STROKE_COLOR);
  }

  _drawGateway(element) {
    const strokeColor = this._bpmnGetColor(element, this.MAIN_STROKE_COLOR);

    const rhombus = this.paper.path('M' + element.x + ' ' + (element.y + (element.height / 2)) +
        'L' + (element.x + (element.width / 2)) + ' ' + (element.y + element.height) +
        'L' + (element.x + element.width) + ' ' + (element.y + (element.height / 2)) +
        'L' + (element.x + (element.width / 2)) + ' ' + element.y + 'z'
    );

    // Fill
    const gatewayFillColor = this._determineCustomFillColor(element, this.ACTIVITY_FILL_COLOR);

    // Opacity
    let gatewayOpacity = 1.0;
    if (this.customActivityBackgroundOpacity) {
      gatewayOpacity = this.customActivityBackgroundOpacity;
    }

    rhombus.attr('stroke-width', 2);
    rhombus.attr('stroke', strokeColor);
    rhombus.attr('fill', gatewayFillColor);
    rhombus.attr('fill-opacity', gatewayOpacity);

    rhombus.id = element.id;

    return rhombus;
  }

  _drawBoundaryEvent(element) {
    const x = element.x + (element.width / 2);
    const y = element.y + (element.height / 2);

    const circle = this.paper.circle(x, y, 15);

    const strokeColor = this._bpmnGetColor(element, this.MAIN_STROKE_COLOR);

    if (element.cancelActivity)  {
      circle.attr({
        'stroke-width': 1,
        'stroke': strokeColor,
        'fill': 'white'
      });

    } else {
      circle.attr({
        'stroke-width': 1,
        'stroke-dasharray': '.',
        'stroke': strokeColor,
        'fill': 'white'
      });
    }

    const innerCircle = this.paper.circle(x, y, 12);

    if (element.cancelActivity)  {
      innerCircle.attr({'stroke-width': 1,
        'stroke': strokeColor,
        'fill': 'none'
      });

    } else {
      innerCircle.attr({
        'stroke-width': 1,
        'stroke-dasharray': '.',
        'stroke': strokeColor,
        'fill': 'none'
      });
    }

    this._drawEventIcon(this.paper, element);
    this._addHoverLogic(element, 'circle', this.MAIN_STROKE_COLOR);

    circle.id = element.id;
    innerCircle.id = element.id + '_inner';
  }

  _drawIntermediateCatchEvent(element) {
    const x = element.x + (element.width / 2);
    const y = element.y + (element.height / 2);

    const circle = this.paper.circle(x, y, 15);

    const strokeColor = this._bpmnGetColor(element, this.MAIN_STROKE_COLOR);

    circle.attr({'stroke-width': 1,
      'stroke': strokeColor,
      'fill': 'white'
    });

    const innerCircle = this.paper.circle(x, y, 12);

    innerCircle.attr({'stroke-width': 1,
      'stroke': strokeColor,
      'fill': 'none'
    });

    this._drawEventIcon(this.paper, element);
    this._addHoverLogic(element, 'circle', this.MAIN_STROKE_COLOR);

    circle.id = element.id;
    innerCircle.id = element.id + '_inner';
  }

  _drawThrowEvent(element) {
    const x = element.x + (element.width / 2);
    const y = element.y + (element.height / 2);

    const circle = this.paper.circle(x, y, 15);

    const strokeColor = this._bpmnGetColor(element, this.MAIN_STROKE_COLOR);

    circle.attr({'stroke-width': 1,
      'stroke': strokeColor,
      'fill': 'white'
    });

    const innerCircle = this.paper.circle(x, y, 12);

    innerCircle.attr({'stroke-width': 1,
      'stroke': strokeColor,
      'fill': 'none'
    });

    this._drawEventIcon(this.paper, element);
    this._addHoverLogic(element, 'circle', this.MAIN_STROKE_COLOR);

    circle.id = element.id;
    innerCircle.id = element.id + '_inner';
  }

  _drawMultilineText(text, x, y, boxWidth, boxHeight, horizontalAnchor, verticalAnchor, fontSize) {
    if (!text || text === '') {
      return;
    }

    let textBoxX, textBoxY;
    const width = boxWidth - (2 * this.TEXT_PADDING);

    if (horizontalAnchor === 'middle') {
      textBoxX = x + (boxWidth / 2);
    } else if (horizontalAnchor === 'start') {
      textBoxX = x;
    }

    textBoxY = y + (boxHeight / 2);

    const t = this.paper.text(textBoxX + this.TEXT_PADDING, textBoxY + this.TEXT_PADDING).attr({
      'text-anchor' : horizontalAnchor,
      'font-family' : 'Arial',
      'font-size' : fontSize,
      'fill' : '#373e48'
    });

    const abc = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    t.attr({
      'text' : abc
    });
    const letterWidth = t.getBBox().width / abc.length;

    t.attr({
      'text' : text
    });
    const removedLineBreaks = text.split('\n');
    x = 0
    const s = [];
    for (let r = 0; r < removedLineBreaks.length; r++) {
      const words = removedLineBreaks[r].split(' ');
      for ( let i = 0; i < words.length; i++) {

        const l = words[i].length;
        if (x + (l * letterWidth) > width) {
          s.push('\n');
          x = 0;
        }
        x += l * letterWidth;
        s.push(words[i] + ' ');
      }
      s.push('\n');
      x = 0;
    }
    t.attr({
      'text' : s.join('')
    });

    if (verticalAnchor && verticalAnchor === 'top') {
      t.attr({'y': y + (t.getBBox().height / 2)});
    }
  }

  _drawTextAnnotation(element) {
    const path1 = this.paper.path('M20,1 L1,1 L1,50 L20,50');
    path1.attr({
      'stroke': '#585858',
      'fill': 'none'
    });

    const annotation = this.paper.set();
    annotation.push(path1);

    annotation.transform('T' + element.x + ',' + element.y);

    if (element.text) {
      this._drawMultilineText(element.text, element.x + 2, element.y, element.width, element.height, 'start', 'middle', 11);
    }
  }

  _drawFlow(flow) {



    var ANCHOR_TYPE= {
      main: "main",
      middle: "middle",
      first: "first",
      last: "last"
    };

    function Anchor(uuid, type, x, y) {
      this.uuid = uuid;
      this.x = x;
      this.y = y;
      this.type = (type === ANCHOR_TYPE.middle) ? ANCHOR_TYPE.middle : ANCHOR_TYPE.main;
      return;
    };

    Anchor.prototype = {
      uuid: null,
      x: 0,
      y: 0,
      type: ANCHOR_TYPE.main,
      isFirst: false,
      isLast: false,
      ndex: 0,
      typeIndex: 0
    };

    function Polyline(uuid, points, strokeWidth, paper) {

      this.points = points;

      this.path = [];

      this.anchors = [];

      if (strokeWidth) this.strokeWidth = strokeWidth;

      this.paper = paper;

      this.closePath = false;

      this.init();
    };

    Polyline.prototype = {
      id: null,
      points: [],
      path: [],
      anchors: [],
      strokeWidth: 1,
      radius: 1,
      showDetails: false,
      paper: null,
      element: null,
      isDefaultConditionAvailable: false,
      closePath: false,

      init: function(points) {
        var linesCount = this.getLinesCount();
        if (linesCount < 1)
          return;

        this.normalizeCoordinates();

        // create anchors

        this.pushAnchor(ANCHOR_TYPE.first, this.getLine(0).x1, this.getLine(0).y1);

        for (var i = 1; i < linesCount; i++)
        {
          var line1 = this.getLine(i-1);
          this.pushAnchor(ANCHOR_TYPE.main,  line1.x2, line1.y2);
        }

        this.pushAnchor(ANCHOR_TYPE.last, this.getLine(linesCount-1).x2, this.getLine(linesCount-1).y2);

        this.rebuildPath();
      },

      normalizeCoordinates: function(){
        for(var i=0; i < this.points.length; i++){
          this.points[i].x = parseFloat(this.points[i].x);
          this.points[i].y = parseFloat(this.points[i].y);
        }
      },

      getLinesCount: function(){
        return this.points.length-1;
      },

      _getLine: function(i){
        if (this.points.length > i && this.points[i]) {
          return {x1: this.points[i].x, y1: this.points[i].y, x2: this.points[i+1].x, y2: this.points[i+1].y};
        } else {
          return undefined;
        }
      },

      getLine: function(i){
        var line = this._getLine(i);
        if (line != undefined) {
          line.angle = this.getLineAngle(i);
        }
        return line;
      },

      getLineAngle: function(i){
        var line = this._getLine(i);
        return Math.atan2(line.y2 - line.y1, line.x2 - line.x1);
      },

      getLineLengthX: function(i){
        var line = this.getLine(i);
        return (line.x2 - line.x1);
      },

      getLineLengthY: function(i){
        var line = this.getLine(i);
        return (line.y2 - line.y1);
      },

      getLineLength: function(i){
        return Math.sqrt(Math.pow(this.getLineLengthX(i), 2) + Math.pow(this.getLineLengthY(i), 2));
      },

      getAnchors: function(){
        return this.anchors;
      },

      getAnchorsCount: function(type){
        if (!type)
          return this.anchors.length;
        else {
          var count = 0;
          for(var i=0; i < this.getAnchorsCount(); i++){
            var anchor = this.anchors[i];
            if (anchor.getType() == type) {
              count++;
            }
          }
          return count;
        }
      },

      pushAnchor: function(type, x, y, index){
        var typeIndex;
        if (type == ANCHOR_TYPE.first) {
          index = 0;
          typeIndex = 0;
        } else if (type == ANCHOR_TYPE.last) {
          index = this.getAnchorsCount();
          typeIndex = 0;
        } else if (!index) {
          index = this.anchors.length;
        } else {
          for(var i=0; i < this.getAnchorsCount(); i++){
            var anchor = this.anchors[i];
            if (anchor.index > index) {
              anchor.index++;
              anchor.typeIndex++;
            }
          }
        }

        var anchor: any = new Anchor(this.id, ANCHOR_TYPE.main, x, y);

        this.anchors.push(anchor);
      },

      getAnchor: function(position){
        return this.anchors[position];
      },

      getAnchorByType: function(type, position){
        if (type == ANCHOR_TYPE.first)
          return this.anchors[0];
        if (type == ANCHOR_TYPE.last)
          return this.anchors[this.getAnchorsCount()-1];

        for(var i=0; i < this.getAnchorsCount(); i++){
          var anchor = this.anchors[i];
          if (anchor.type == type) {
            if( position == anchor.position)
              return anchor;
          }
        }
        return null;
      },

      addNewPoint: function(position, x, y){
        //
        for(var i = 0; i < this.getLinesCount(); i++){
          var line = this.getLine(i);
          if (x > line.x1 && x < line.x2 && y > line.y1 && y < line.y2) {
            this.points.splice(i+1,0,{x: x, y: y});
            break;
          }
        }

        this.rebuildPath();
      },

      rebuildPath: function(){
        var path = [];

        for(var i = 0; i < this.getAnchorsCount(); i++){
          var anchor = this.getAnchor(i);

          var pathType = "";
          if (i == 0)
            pathType = "M";
          else
            pathType = "L";

          // TODO: save previous points and calculate new path just if points are updated, and then save currents values as previous

          var targetX = anchor.x, targetY = anchor.y;
          if (i>0 && i < this.getAnchorsCount()-1) {
            // get new x,y
            var cx = anchor.x, cy = anchor.y;

            // pivot point of prev line
            var AO = this.getLineLength(i-1);
            if (AO < this.radius) {
              AO = this.radius;
            }

            this.isDefaultConditionAvailable = (this.isDefaultConditionAvailable || (i == 1 && AO > 10));

            var ED = this.getLineLengthY(i-1) * this.radius / AO;
            var OD = this.getLineLengthX(i-1) * this.radius / AO;
            targetX = anchor.x - OD;
            targetY = anchor.y - ED;

            if (AO < 2*this.radius && i>1) {
              targetX = anchor.x - this.getLineLengthX(i-1)/2;
              targetY = anchor.y - this.getLineLengthY(i-1)/2;;
            }

            // pivot point of next line
            var AO = this.getLineLength(i);
            if (AO < this.radius) {
              AO = this.radius;
            }
            var ED = this.getLineLengthY(i) * this.radius / AO;
            var OD = this.getLineLengthX(i) * this.radius / AO;
            var nextSrcX = anchor.x + OD;
            var nextSrcY = anchor.y + ED;

            if (AO < 2*this.radius && i<this.getAnchorsCount()-2) {
              nextSrcX = anchor.x + this.getLineLengthX(i)/2;
              nextSrcY = anchor.y + this.getLineLengthY(i)/2;;
            }


            var dx0 = (cx - targetX) / 3,
                dy0 = (cy - targetY) / 3,
                ax = cx - dx0,
                ay = cy - dy0,

                dx1 = (cx - nextSrcX) / 3,
                dy1 = (cy - nextSrcY) / 3,
                bx = cx - dx1,
                by = cy - dy1,

                zx=nextSrcX, zy=nextSrcY;

          } else if (i==1 && this.getAnchorsCount() == 2){
            var AO = this.getLineLength(i-1);
            if (AO < this.radius) {
              AO = this.radius;
            }
            this.isDefaultConditionAvailable = (this.isDefaultConditionAvailable || (i == 1 && AO > 10));
          }

          // anti smoothing
          if (this.strokeWidth%2 == 1) {
            targetX += 0.5;
            targetY += 0.5;
          }

          path.push([pathType, targetX, targetY]);

          if (i>0 && i < this.getAnchorsCount()-1) {
            path.push(["C", ax, ay, bx, by, zx, zy]);
          }
        }

        if (this.closePath)
        {
          path.push(["Z"]);
        }

        this.path = path;
      },

      transform: function(transformation) {
        this.element.transform(transformation);
      },

      attr: function(attrs) {
        // TODO: foreach and set each
        this.element.attr(attrs);
      }
    };

    function Polygone(points, strokeWidth) {
      /* Array on coordinates:
         * points: [{x: 410, y: 110}, 1
         *			{x: 570, y: 110}, 1 2
         *			{x: 620, y: 240},   2 3
         *			{x: 750, y: 270},     3 4
         *			{x: 650, y: 370}];      4
         */
      this.points = points;

      /*
         * path for graph
         * [["M", x1, y1], ["L", x2, y2], ["C", ax, ay, bx, by, x3, y3], ["L", x3, y3]]
         */
      this.path = [];

      this.anchors = [];

      if (strokeWidth) this.strokeWidth = strokeWidth;

      this.closePath = true;
      this.init();
    };

    var Foo = function () { };

    Foo.prototype = Polyline.prototype;

    Polygone.prototype = new Foo();

    Polygone.prototype.rebuildPath = function(){
      var path = [];
      for(var i = 0; i < this.getAnchorsCount(); i++){
        var anchor = this.getAnchor(i);

        var pathType = "";
        if (i == 0)
          pathType = "M";
        else
          pathType = "L";

        var targetX = anchor.x, targetY = anchor.y;

        // anti smoothing
        if (this.strokeWidth%2 == 1) {
          targetX += 0.5;
          targetY += 0.5;
        }

        path.push([pathType, targetX, targetY]);
      }
      if (this.closePath)
        path.push(["Z"]);

      this.path = path;
    };


    const polyline = new Polyline(flow.id, flow.waypoints, this.SEQUENCEFLOW_STROKE, this.paper);

    const strokeColor = this._bpmnGetColor(flow, this.MAIN_STROKE_COLOR);

    polyline.element = this.paper.path(polyline.path);

    if(flow.completed){
      polyline.element.attr({'stroke-width': this.SEQUENCEFLOW_STROKE + 1});
    }else{
      polyline.element.attr({'stroke-width': this.SEQUENCEFLOW_STROKE});
    }
    polyline.element.attr({'stroke': strokeColor});

    polyline.element.id = flow.id;

    const lastLineIndex = polyline.getLinesCount() - 1;
    const line = polyline.getLine(lastLineIndex);

    if (line === undefined) {return; }

    if (flow.type === 'connection' && flow.conditions) {
      const middleX = (line.x1 + line.x2) / 2;
      const middleY = (line.y1 + line.y2) / 2;
      const image = this.paper.image('../editor/images/condition-flow.png', middleX - 8, middleY - 8, 16, 16);
    }

    const polylineInvisible = new Polyline(flow.id, flow.waypoints, this.SEQUENCEFLOW_STROKE, this.paper);

    polylineInvisible.element = this.paper.path(polyline.path);
    polylineInvisible.element.attr({
      'opacity': 0,
      'stroke-width': 8,
      'stroke' : '#000000'
    });

    if (flow.name) {
      const firstLine = polyline.getLine(0);

      let angle;
      if (firstLine.x1 !== firstLine.x2) {
        angle = Math.atan((firstLine.y2 - firstLine.y1) / (firstLine.x2 - firstLine.x1));
      } else if (firstLine.y1 < firstLine.y2) {
        angle = Math.PI / 2;
      } else {
        angle = -Math.PI / 2;
      }
      const flowName = this.paper.text(firstLine.x1, firstLine.y1, flow.name).attr({
        'text-anchor': 'middle',
        'font-family' : 'Arial',
        'font-size' : '12',
        'fill' : '#000000'
      });

      let offsetX = (flowName.getBBox().width / 2 + 5);
      const offsetY = -(flowName.getBBox().height / 2 + 5);

      if (firstLine.x1 > firstLine.x2) {
        offsetX = -offsetX;
      }
      const rotatedOffsetX = offsetX * Math.cos(angle) - offsetY * Math.sin(angle);
      const rotatedOffsetY = offsetX * Math.sin(angle) + offsetY * Math.cos(angle);

      flowName.attr({
        x: firstLine.x1 + rotatedOffsetX,
        y: firstLine.y1 + rotatedOffsetY
      });

      flowName.transform('r' + ((angle) * 180) / Math.PI);
    }


    this._showTip(jQuery(polylineInvisible.element.node), flow);

    polylineInvisible.element.mouseover(() => {
      this.paper.getById(polyline.element.id).attr({'stroke': 'blue' });
    });

    polylineInvisible.element.mouseout(() => {
      this.paper.getById(polyline.element.id).attr({'stroke': strokeColor});
    });

    this._drawArrowHead(line, null);
  }

  _drawArrowHead(line, connectionType) {
    const doubleArrowWidth = 2 * this.ARROW_WIDTH;

    const arrowHead = this.paper.path('M0 0L-' + (this.ARROW_WIDTH / 2 + .5) + ' -' + doubleArrowWidth + 'L' + (this.ARROW_WIDTH / 2 + .5) + ' -' + doubleArrowWidth + 'z');

    // anti smoothing this.strokeWidth replaced by this.TASK_STROKE
    if ((this.TASK_STROKE % 2) === 1) {
      line.x2 += .5, line.y2 += .5;
    }

    arrowHead.transform('t' + line.x2 + ',' + line.y2 + '');
    arrowHead.transform('...r' + Raphael.deg(line.angle - Math.PI / 2) + ' ' + 0 + ' ' + 0);

    arrowHead.attr('fill', '#585858');

    arrowHead.attr('stroke-width', this.SEQUENCEFLOW_STROKE);
    arrowHead.attr('stroke', '#585858');

    return arrowHead;
  }

  _determineCustomFillColor(element, defaultColor) {

    let color;

    // By name
    if (this.customActivityColors && this.customActivityColors[element.name]) {
      color = this.customActivityColors[element.name];
    }

    if (color !== null && color !== undefined) {
      return color;
    }

    // By id
    if (this.customActivityColors && this.customActivityColors[element.id]) {
      color = this.customActivityColors[element.id];
    }

    if (color !== null && color !== undefined) {
      return color;
    }

    return defaultColor;
  }











  /**
   * @Base javascrypt & jQuery
   *
   * @role drawing all icons of process bpmn
   *
   * @module bpmn-icons.js
   */

  _drawEventIcon(paper, element) {
    if (element.eventDefinition && element.eventDefinition.type) {
      if ('timer' === element.eventDefinition.type) {
        this._drawTimerIcon(paper, element);
      } else if ('conditional' === element.eventDefinition.type) {
        this._drawConditionalIcon(paper, element);
      } else if ('error' === element.eventDefinition.type) {
        this._drawErrorIcon(paper, element);
      } else if ('escalation' === element.eventDefinition.type) {
        this._drawEscalationIcon(paper, element);
      } else if ('signal' === element.eventDefinition.type) {
        this._drawSignalIcon(paper, element);
      } else if ('message' === element.eventDefinition.type) {
        this._drawMessageIcon(paper, element);
      }
    }
  }

  _drawMessageIcon(paper, element) {
    let fill = 'none';
    if (element.type === 'ThrowEvent') {
      fill = 'black';
    }
    const path = paper.path('M 1 3 L 9 11 L 17 3 L 1 3 z M 1 5 L 1 13 L 5 9 L 1 5 z M 17 5 L 13 9 L 17 13 L 17 5 z M 6 10 L 1 15 L 17 15 L 12 10 L 9 13 L 6 10 z');
    path.attr({
      'stroke': 'black',
      'stroke-width': 1,
      'fill': fill
    });
    path.transform('T' + (element.x + 6) + ',' + (element.y + 6));
    return path;
  }

  _drawSignalIcon(paper, element) {
    let fill = 'none';
    if (element.type === 'ThrowEvent') {
      fill = 'black';
    }

    const path = paper.path('M 8.7124971,21.247342 L 23.333334,21.247342 L 16.022915,8.5759512 L 8.7124971,21.247342 z');
    path.attr({
      'stroke': 'black',
      'stroke-width': 1,
      'fill': fill
    });
    path.transform('T' + (element.x - 1) + ',' + (element.y - 1));
    return path;
  }

  _drawEscalationIcon(paper, element) {
    let fill = 'none';
    if (element.type === 'ThrowEvent') {
      fill = 'black';
    }

    const path = paper.path('M 16,8.75 L22,23.75 L16,17 L10,23.75z');
    path.attr({
      'stroke': 'black',
      'stroke-width': 1,
      'fill': fill
    });
    path.transform('T' + (element.x - 1) + ',' + (element.y - 1));
    return path;
  }

  _drawErrorIcon(paper, element) {
    const path = paper.path('M 22.820839,11.171502 L 19.36734,24.58992 L 13.54138,14.281819 L 9.3386512,20.071607 L 13.048949,6.8323057 L 18.996148,16.132659 L 22.820839,11.171502 z');

    let fill = 'none';
    let x = element.x - 1;
    let y = element.y - 1;
    if (element.type === 'EndEvent') {
      fill = 'black';
      x -= 1;
      y -= 1;
    }

    path.attr({
      'stroke': 'black',
      'stroke-width': 1,
      'fill': fill
    });

    path.transform('T' + x + ',' + y);
    return path;
  }

  _drawConditionalIcon(paper, element) {
    const fill = 'none';

    const path = paper.path('M 10 10 L 22 10 M 10 14 L 22 14 M 10 18 L 22 18 M 10 22 L 22 22');
    path.attr({
      'stroke': 'black',
      'stroke-width': 1,
      'fill': fill
    });
    path.transform('T' + (element.x - 1) + ',' + (element.y - 1));
    return path;
  }

  _drawTimerIcon(paper, element) {
    const x = element.x + (element.width / 2);
    const y = element.y + (element.height / 2);

    const circle = paper.circle(x, y, 10);

    circle.attr({'stroke-width': 1,
      'stroke': 'black',
      'fill': 'none'
    });

    const path = paper.path('M 10 0 C 4.4771525 0 0 4.4771525 0 10 C 0 15.522847 4.4771525 20 10 20 C 15.522847 20 20 15.522847 20 10 C 20 4.4771525 15.522847 1.1842379e-15 10 0 z M 9.09375 1.03125 C 9.2292164 1.0174926 9.362825 1.0389311 9.5 1.03125 L 9.5 3.5 L 10.5 3.5 L 10.5 1.03125 C 15.063526 1.2867831 18.713217 4.9364738 18.96875 9.5 L 16.5 9.5 L 16.5 10.5 L 18.96875 10.5 C 18.713217 15.063526 15.063526 18.713217 10.5 18.96875 L 10.5 16.5 L 9.5 16.5 L 9.5 18.96875 C 4.9364738 18.713217 1.2867831 15.063526 1.03125 10.5 L 3.5 10.5 L 3.5 9.5 L 1.03125 9.5 C 1.279102 5.0736488 4.7225326 1.4751713 9.09375 1.03125 z M 9.5 5 L 9.5 8.0625 C 8.6373007 8.2844627 8 9.0680195 8 10 C 8 11.104569 8.8954305 12 10 12 C 10.931981 12 11.715537 11.362699 11.9375 10.5 L 14 10.5 L 14 9.5 L 11.9375 9.5 C 11.756642 8.7970599 11.20294 8.2433585 10.5 8.0625 L 10.5 5 L 9.5 5 z');
    path.attr({
      'stroke': 'none',
      'fill': '#585858'
    });
    path.transform('T' + (element.x + 5) + ',' + (element.y + 5));
    return path;
  }

  _drawHttpTaskIcon(paper, startX, startY) {
    const path = paper.path('m 16.704699,5.9229055 q 0.358098,0 0.608767,0.2506681 0.250669,0.250668 0.250669,0.6087677 0,0.3580997 -0.250669,0.6087677 -0.250669,0.2506679 -0.608767,0.2506679 -0.358098,0 -0.608767,-0.2506679 -0.250669,-0.250668 -0.250669,-0.6087677 0,-0.3580997 0.250669,-0.6087677 0.250669,-0.2506681 0.608767,-0.2506681 z m 2.578308,-2.0053502 q -2.229162,0 -3.854034,0.6759125 -1.624871,0.6759067 -3.227361,2.2694472 -0.716197,0.725146 -1.575633,1.7457293 L 7.2329969,8.7876913 Q 7.0897576,8.8055849 7.000233,8.9309334 L 4.9948821,12.368677 q -0.035811,0.06267 -0.035811,0.143242 0,0.107426 0.080572,0.205905 l 0.5729577,0.572957 q 0.125334,0.116384 0.2864786,0.07162 l 2.4708789,-0.760963 2.5156417,2.515645 -0.76096,2.470876 q -0.009,0.02687 -0.009,0.08057 0,0.125338 0.08058,0.205905 l 0.572957,0.572958 q 0.170096,0.152194 0.349146,0.04476 l 3.437744,-2.005351 q 0.125335,-0.08953 0.143239,-0.232763 l 0.17905,-3.392986 q 1.02058,-0.859435 1.745729,-1.575629 1.67411,-1.6830612 2.309735,-3.2049805 0.635625,-1.5219191 0.635625,-3.8585111 0,-0.1253369 -0.08505,-0.2148575 -0.08505,-0.089526 -0.201431,-0.089526 z');
    path.attr({
      'opacity': 1,
      'stroke': 'none',
      'fill': '#16964d'
    });

    startX += -2;
    startY += -2;

    path.transform('T' + startX + ',' + startY);

  }

  _drawScriptTaskIcon(paper, startX, startY) {
    const path1 = paper.path('m 5,2 0,0.094 c 0.23706,0.064 0.53189,0.1645 0.8125,0.375 0.5582,0.4186 1.05109,1.228 1.15625,2.5312 l 8.03125,0 1,0 1,0 c 0,-3 -2,-3 -2,-3 l -10,0 z M 4,3 4,13 2,13 c 0,3 2,3 2,3 l 9,0 c 0,0 2,0 2,-3 L 15,6 6,6 6,5.5 C 6,4.1111 5.5595,3.529 5.1875,3.25 4.8155,2.971 4.5,3 4.5,3 L 4,3 z');
    path1.attr({
      'opacity': 1,
      'stroke': 'none',
      'fill': '#72a7d0'
    });

    const scriptTaskIcon = paper.set();
    scriptTaskIcon.push(path1);

    scriptTaskIcon.transform('T' + startX + ',' + startY);
  }

  _drawUserTaskIcon(paper, startX, startY) {
    const path1 = paper.path('m 1,17 16,0 0,-1.7778 -5.333332,-3.5555 0,-1.7778 c 1.244444,0 1.244444,-2.3111 1.244444,-2.3111 l 0,-3.0222 C 12.555557,0.8221 9.0000001,1.0001 9.0000001,1.0001 c 0,0 -3.5555556,-0.178 -3.9111111,3.5555 l 0,3.0222 c 0,0 0,2.3111 1.2444443,2.3111 l 0,1.7778 L 1,15.2222 1,17 17,17');
    path1.attr({
      'opacity': 1,
      'stroke': 'none',
      'fill': '#d1b575'
    });

    const userTaskIcon = paper.set();
    userTaskIcon.push(path1);

    userTaskIcon.transform('T' + startX + ',' + startY);
  }

  _drawSendTaskIcon(paper, startX, startY) {
    const path1 = paper.path('M 1 3 L 9 11 L 17 3 L 1 3 z M 1 5 L 1 13 L 5 9 L 1 5 z M 17 5 L 13 9 L 17 13 L 17 5 z M 6 10 L 1 15 L 17 15 L 12 10 L 9 13 L 6 10 z');
    path1.attr({
      'stroke': 'none',
      'fill': '#16964d'
    });

    const sendTaskIcon = paper.set();
    sendTaskIcon.push(path1);

    sendTaskIcon.transform('T' + startX + ',' + startY);
  }

  _drawCamelTaskIcon(paper, startX, startY) {
    const path = paper.path('m 8.1878027,15.383782 c -0.824818,-0.3427 0.375093,-1.1925 0.404055,-1.7743 0.230509,-0.8159 -0.217173,-1.5329 -0.550642,-2.2283 -0.106244,-0.5273 -0.03299,-1.8886005 -0.747194,-1.7818005 -0.712355,0.3776 -0.9225,1.2309005 -1.253911,1.9055005 -0.175574,1.0874 -0.630353,2.114 -0.775834,3.2123 -0.244009,0.4224 -1.741203,0.3888 -1.554386,-0.1397 0.651324,-0.3302 1.13227,-0.9222 1.180246,-1.6705 0.0082,-0.7042 -0.133578,-1.3681 0.302178,-2.0083 0.08617,-0.3202 0.356348,-1.0224005 -0.218996,-0.8051 -0.694517,0.2372 -1.651062,0.6128 -2.057645,-0.2959005 -0.696769,0.3057005 -1.102947,-0.611 -1.393127,-1.0565 -0.231079,-0.6218 -0.437041,-1.3041 -0.202103,-1.9476 -0.185217,-0.7514 -0.39751099,-1.5209 -0.35214999,-2.301 -0.243425,-0.7796 0.86000899,-1.2456 0.08581,-1.8855 -0.76078999,0.1964 -1.41630099,-0.7569 -0.79351899,-1.2877 0.58743,-0.52829998 1.49031699,-0.242 2.09856399,-0.77049998 0.816875,-0.3212 1.256619,0.65019998 1.923119,0.71939998 0.01194,0.7333 -0.0031,1.5042 -0.18417,2.2232 -0.194069,0.564 -0.811196,1.6968 0.06669,1.9398 0.738382,-0.173 1.095723,-0.9364 1.659041,-1.3729 0.727298,-0.3962 1.093982,-1.117 1.344137,-1.8675 0.400558,-0.8287 1.697676,-0.6854 1.955367,0.1758 0.103564,0.5511 0.9073983,1.7538 1.2472763,0.6846 0.121868,-0.6687 0.785541,-1.4454 1.518183,-1.0431 0.813587,0.4875 0.658233,1.6033 1.285504,2.2454 0.768715,0.8117 1.745394,1.4801 2.196633,2.5469 0.313781,0.8074 0.568552,1.707 0.496624,2.5733 -0.35485,0.8576005 -1.224508,-0.216 -0.64725,-0.7284 0.01868,-0.3794 -0.01834,-1.3264 -0.370249,-1.3272 -0.123187,0.7586 -0.152778,1.547 -0.10869,2.3154 0.270285,0.6662005 1.310741,0.7653005 1.060553,1.6763005 -0.03493,0.9801 0.294343,1.9505 0.148048,2.9272 -0.320479,0.2406 -0.79575,0.097 -1.185062,0.1512 -0.165725,0.3657 -0.40138,0.921 -1.020848,0.6744 -0.564671,0.1141 -1.246404,-0.266 -0.578559,-0.7715 0.679736,-0.5602 0.898618,-1.5362 0.687058,-2.3673 -0.529674,-1.108 -1.275984,-2.0954005 -1.839206,-3.1831005 -0.634619,-0.1004 -1.251945,0.6779 -1.956789,0.7408 -0.6065893,-0.038 -1.0354363,-0.06 -0.8495673,0.6969005 0.01681,0.711 0.152396,1.3997 0.157345,2.1104 0.07947,0.7464 0.171287,1.4944 0.238271,2.2351 0.237411,1.0076 -0.687542,1.1488 -1.414811,0.8598 z m 6.8675483,-1.8379 c 0.114364,-0.3658 0.206751,-1.2704 -0.114466,-1.3553 -0.152626,0.5835 -0.225018,1.1888 -0.227537,1.7919 0.147087,-0.1166 0.265559,-0.2643 0.342003,-0.4366 z');
    path.attr({
      'opacity': 1,
      'stroke': 'none',
      'fill': '#bd4848'
    });

    startX += 4;
    startY += 2;

    path.transform('T' + startX + ',' + startY);

  }

  _drawMuleTaskIcon(paper, startX, startY) {
    const path = paper.path('M 8,0 C 3.581722,0 0,3.5817 0,8 c 0,4.4183 3.581722,8 8,8 4.418278,0 8,-3.5817 8,-8 L 16,7.6562 C 15.813571,3.3775 12.282847,0 8,0 z M 5.1875,2.7812 8,7.3437 10.8125,2.7812 c 1.323522,0.4299 2.329453,1.5645 2.8125,2.8438 1.136151,2.8609 -0.380702,6.4569 -3.25,7.5937 -0.217837,-0.6102 -0.438416,-1.2022 -0.65625,-1.8125 0.701032,-0.2274 1.313373,-0.6949 1.71875,-1.3125 0.73624,-1.2317 0.939877,-2.6305 -0.03125,-4.3125 l -2.75,4.0625 -0.65625,0 -0.65625,0 -2.75,-4 C 3.5268433,7.6916 3.82626,8.862 4.5625,10.0937 4.967877,10.7113 5.580218,11.1788 6.28125,11.4062 6.063416,12.0165 5.842837,12.6085 5.625,13.2187 2.755702,12.0819 1.238849,8.4858 2.375,5.625 2.858047,4.3457 3.863978,3.2112 5.1875,2.7812 z');
    path.attr({
      'opacity': 1,
      'stroke': 'none',
      'fill': '#bd4848'
    });

    startX += 4;
    startY += 2;

    path.transform('T' + startX + ',' + startY);

  }

  _drawShellTaskIcon(paper, startX, startY) {
    const path = paper.path('m 1,2 0,14 16,0 0,-14 z m 1.4,3 12.7,0 0,10 -12.7,0 z');
    path.attr({
      'opacity': 1,
      'stroke': 'none',
      'fill': '#16964d'
    });
    const text = paper.text(3, 9, '>_').attr({
      'font-size': '5px',
      'fill': '#16964d'
    });

    startY += -2;
    text.transform('T' + startX + ',' + startY);
    startX += -2;
    path.transform('T' + startX + ',' + startY);
  }

  _drawDecisionTaskIcon(paper, startX, startY) {
    const path1 = paper.path('m 1,2 0,14 16,0 0,-14 z m 1.9,2.4000386 3.7,0 0,2.7999224 -3.7,0 z m 4.36364,0 3.7,0 0,2.7999224 -3.7,0 z m 4.36364,0 3.7,0 0,2.7999224 -3.7,0 z m -8.67364,3.9 3.7,0 0,2.7999224 -3.7,0 z m 4.36364,0 3.7,0 0,2.7999224 -3.7,0 z m 4.36364,0 3.7,0 0,2.7999224 -3.7,0 z m -8.67364,3.9 3.7,0 0,2.7999224 -3.7,0 z m 4.36364,0 3.7,0 0,2.7999224 -3.7,0 z m 4.36364,0 3.7,0 0,2.7999224 -3.7,0 z');
    path1.attr({
      'opacity': 1,
      'stroke': '#000000',
      'fill': '#F4F6F7'
    });

    const decisionTaskIcon = paper.set();
    decisionTaskIcon.push(path1);

    decisionTaskIcon.translate(startX, startY);
    decisionTaskIcon.scale(0.7, 0.7);
  }

  _drawServiceTaskIcon(paper, startX, startY) {
    const path1 = paper.path('M 8,1 7.5,2.875 c 0,0 -0.02438,0.250763 -0.40625,0.4375 C 7.05724,3.330353 7.04387,3.358818 7,3.375 6.6676654,3.4929791 6.3336971,3.6092802 6.03125,3.78125 6.02349,3.78566 6.007733,3.77681 6,3.78125 5.8811373,3.761018 5.8125,3.71875 5.8125,3.71875 l -1.6875,-1 -1.40625,1.4375 0.96875,1.65625 c 0,0 0.065705,0.068637 0.09375,0.1875 0.002,0.00849 -0.00169,0.022138 0,0.03125 C 3.6092802,6.3336971 3.4929791,6.6676654 3.375,7 3.3629836,7.0338489 3.3239228,7.0596246 3.3125,7.09375 3.125763,7.4756184 2.875,7.5 2.875,7.5 L 1,8 l 0,2 1.875,0.5 c 0,0 0.250763,0.02438 0.4375,0.40625 0.017853,0.03651 0.046318,0.04988 0.0625,0.09375 0.1129372,0.318132 0.2124732,0.646641 0.375,0.9375 -0.00302,0.215512 -0.09375,0.34375 -0.09375,0.34375 L 2.6875,13.9375 4.09375,15.34375 5.78125,14.375 c 0,0 0.1229911,-0.09744 0.34375,-0.09375 0.2720511,0.147787 0.5795915,0.23888 0.875,0.34375 0.033849,0.01202 0.059625,0.05108 0.09375,0.0625 C 7.4756199,14.874237 7.5,15.125 7.5,15.125 L 8,17 l 2,0 0.5,-1.875 c 0,0 0.02438,-0.250763 0.40625,-0.4375 0.03651,-0.01785 0.04988,-0.04632 0.09375,-0.0625 0.332335,-0.117979 0.666303,-0.23428 0.96875,-0.40625 0.177303,0.0173 0.28125,0.09375 0.28125,0.09375 l 1.65625,0.96875 1.40625,-1.40625 -0.96875,-1.65625 c 0,0 -0.07645,-0.103947 -0.09375,-0.28125 0.162527,-0.290859 0.262063,-0.619368 0.375,-0.9375 0.01618,-0.04387 0.04465,-0.05724 0.0625,-0.09375 C 14.874237,10.52438 15.125,10.5 15.125,10.5 L 17,10 17,8 15.125,7.5 c 0,0 -0.250763,-0.024382 -0.4375,-0.40625 C 14.669647,7.0572406 14.641181,7.0438697 14.625,7 14.55912,6.8144282 14.520616,6.6141566 14.4375,6.4375 c -0.224363,-0.4866 0,-0.71875 0,-0.71875 L 15.40625,4.0625 14,2.625 l -1.65625,1 c 0,0 -0.253337,0.1695664 -0.71875,-0.03125 l -0.03125,0 C 11.405359,3.5035185 11.198648,3.4455201 11,3.375 10.95613,3.3588185 10.942759,3.3303534 10.90625,3.3125 10.524382,3.125763 10.5,2.875 10.5,2.875 L 10,1 8,1 z m 1,5 c 1.656854,0 3,1.3431458 3,3 0,1.656854 -1.343146,3 -3,3 C 7.3431458,12 6,10.656854 6,9 6,7.3431458 7.3431458,6 9,6 z');
    path1.attr({
      'opacity': 1,
      'stroke': 'none',
      'fill': '#72a7d0'
    });

    const serviceTaskIcon = paper.set();
    serviceTaskIcon.push(path1);

    serviceTaskIcon.transform('T' + startX + ',' + startY);
  }

  _drawBusinessRuleTaskIcon(paper, startX, startY) {
    const path1 = paper.path('m 1,2 0,14 16,0 0,-14 z m 1.45458,5.6000386 2.90906,0 0,2.7999224 -2.90906,0 z m 4.36364,0 8.72718,0 0,2.7999224 -8.72718,0 z m -4.36364,4.1998844 2.90906,0 0,2.800116 -2.90906,0 z m 4.36364,0 8.72718,0 0,2.800116 -8.72718,0 z');
    path1.attr({
      'stroke': 'none',
      'fill': '#72a7d0'
    });

    const businessRuleTaskIcon = paper.set();
    businessRuleTaskIcon.push(path1);

    businessRuleTaskIcon.transform('T' + startX + ',' + startY);
  }

  _drawManualTaskIcon(paper, startX, startY) {
    const path1 = paper.path('m 17,9.3290326 c -0.0069,0.5512461 -0.455166,1.0455894 -0.940778,1.0376604 l -5.792746,0 c 0.0053,0.119381 0.0026,0.237107 0.0061,0.355965 l 5.154918,0 c 0.482032,-0.0096 0.925529,0.49051 0.919525,1.037574 -0.0078,0.537128 -0.446283,1.017531 -0.919521,1.007683 l -5.245273,0 c -0.01507,0.104484 -0.03389,0.204081 -0.05316,0.301591 l 2.630175,0 c 0.454137,-0.0096 0.872112,0.461754 0.866386,0.977186 C 13.619526,14.554106 13.206293,15.009498 12.75924,15 L 3.7753054,15 C 3.6045812,15 3.433552,14.94423 3.2916363,14.837136 c -0.00174,0 -0.00436,0 -0.00609,0 C 1.7212035,14.367801 0.99998255,11.458641 1,11.458641 L 1,7.4588393 c 0,0 0.6623144,-1.316333 1.8390583,-2.0872584 1.1767614,-0.7711868 6.8053358,-2.40497 7.2587847,-2.8052901 0.453484,-0.40032 1.660213,1.4859942 0.04775,2.4010487 C 8.5332315,5.882394 8.507351,5.7996113 8.4370292,5.7936859 l 6.3569748,-0.00871 c 0.497046,-0.00958 0.952273,0.5097676 0.94612,1.0738232 -0.0053,0.556126 -0.456176,1.0566566 -0.94612,1.0496854 l -4.72435,0 c 0.01307,0.1149374 0.0244,0.2281319 0.03721,0.3498661 l 5.952195,0 c 0.494517,-0.00871 0.947906,0.5066305 0.940795,1.0679848 z');
    path1.attr({
      'opacity': 1,
      'stroke': 'none',
      'fill': '#d1b575'
    });

    const manualTaskIcon = paper.set();
    manualTaskIcon.push(path1);

    manualTaskIcon.transform("T" + startX + "," + startY);
  }

  _drawReceiveTaskIcon(paper, startX, startY) {
    var path = paper.path('m 0.5,2.5 0,13 17,0 0,-13 z M 2,4 6.5,8.5 2,13 z M 4,4 14,4 9,9 z m 12,0 0,9 -4.5,-4.5 z M 7.5,9.5 9,11 10.5,9.5 15,14 3,14 z');
    path.attr({
      'opacity': 1,
      'stroke': 'none',
      'fill': '#16964d'
    });

    startX += 4;
    startY += 2;

    path.transform('T' + startX + ',' + startY);

  }



}
