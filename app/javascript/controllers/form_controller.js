import { Controller } from "stimulus"
import { isSymbolNode, parse, isFunctionNode } from "mathjs"
import { customFns, definedFnsCnsts } from "../projects/modelling/components/expression_component"
import * as d3 from "d3"

function badgeFor(errors) {
  return errors ? `<span class="badge badge-danger mr-1">${errors[0]}</span>` : "";
}

function setClass(element, valid) {
  element.classList.toggle("is-valid", valid)
  element.classList.toggle("is-invalid", !valid)
}

export default class extends Controller {
  static targets = [
    "error",
    "field",
    "expression",
    "inputContainer", 
    "result"
  ]

  updateInputs() {
    const expression = this.expressionTarget.value

    let uniqueSymbols

    try {

      let fns = parse(expression).filter(isFunctionNode).map(n => n.name)

      uniqueSymbols = new Set<String>(
        parse(expression)
            .filter(isSymbolNode)
            .filter(n => !fns.includes(n.name))
            .filter(n => !definedFnsCnsts.includes(n.name))
            .map(n => n.name)
      )

    } catch (error) {
    }

    if(uniqueSymbols) {
      this.populateInputs(uniqueSymbols)
    }

  }

  calculateResult() {
    if(this.resultTarget){
      const expression = this.expressionTarget.value
      const variables = this.inputContainerTarget.querySelectorAll("input")
      const scope = {}

      let graphMode = false
      let graphVariable = null
      let graphRangeStart = null
      let graphRangeEnd = null

      variables.forEach(variable => {
        let value = variable.value
        if(value.match(/^(\d+)-(\d+)$/)){
          graphMode = true
          graphVariable = variable.dataset.variable
          graphRangeStart = parseFloat(value.split("-")[0])
          graphRangeEnd = parseFloat(value.split("-")[1])
          value = graphRangeStart
        }
        

        scope[variable.dataset.variable] = parseFloat(value)
      })
      
      if(graphMode){
        this.resultTarget.innerHTML = ""
        this.produceGraph(scope, graphVariable, graphRangeStart, graphRangeEnd, expression)
        return
      }


      try {
        const result = parse(expression).evaluate(scope)
        this.resultTarget.innerHTML = !isNaN(result) ? result : "..."
      } catch (error) {
        this.resultTarget.innerHTML = "Error"
      }
    }
  }

  produceGraph(scope, variable, rangeStart, rangeEnd, expression) {


    if (rangeEnd === rangeStart) {
        // Avoid trying to generate a graph when the user is still typing (rangeStart equals rangeEnd)
        return;
    }

    const step = (rangeEnd - rangeStart) / 25;
    const labels = [];
    const data = [];
  
    for (let value = rangeStart; value <= rangeEnd; value += step) {
        scope[variable] = value;
        try {
            const result = parse(expression).evaluate(scope);
            labels.push(value.toFixed(2));
            data.push(result);
        } catch (error) {
            data.push(null);
        }
    }

    const margin = {top: 10, right: 10, bottom: 30, left: 50},
          width = 400 - margin.left - margin.right,
          height = 350 - margin.top - margin.bottom;

    d3.select(this.resultTarget).selectAll("svg").remove();

    const svg = d3.select(this.resultTarget)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("overflow", "visible")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3.scaleLinear()
        .domain([rangeStart, rangeEnd]) 
        .range([0, width]); 

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    const y = d3.scaleLinear()
        .domain([d3.min(data), d3.max(data)])
        .range([height, 0]);  

    svg.append("g")
        .call(d3.axisLeft(y));

    const line = d3.line()
        .x((d, i) => x(+labels[i]))
        .y(d => y(d))
        .defined(d => d !== null);  

    svg.append("path")
        .datum(data) 
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line)
    
  }

  populateInputs(uniqueSymbols) {

    if (this.inputContainerTarget) {
      this.inputContainerTarget.innerHTML = "";
  
      let row = document.createElement("div");
      row.className = "row";
  
      uniqueSymbols.forEach((variable, index) => {
        const col = document.createElement("div");
        col.className = "col-md-6"
  
        const div = document.createElement("div");
        div.className = "form-group";
  
        const label = document.createElement("label");
        label.textContent = `${variable}`;
  
        const isConstant = customFns.find(fn => fn.name === variable)
        const input = document.createElement("input");
        input.value = isConstant !== undefined ? isConstant.valueAtZ20 : 0;
        input.disabled = isConstant !== undefined;
        input.title = isConstant !== undefined ? `Est Value at Zoom 20. ${isConstant.desc}`: variable;
        //input.type = "number";
        input.className = "form-control";
        input.name = `variable_${variable}`;
        input.placeholder = `${variable}`;
        input.dataset.variable = variable;
  
        input.addEventListener('input', () => this.calculateResult());
  
        div.appendChild(label);
        div.appendChild(input);
        col.appendChild(div);
  
        row.appendChild(col);
  
        if ((index + 1) % 2 === 0) {
          this.inputContainerTarget.appendChild(row);
          row = document.createElement("div");
          row.className = "row";
        }
      });
  
      if (row.children.length > 0) {
        this.inputContainerTarget.appendChild(row);
      }
  
      this.calculateResult();
    }
  }
  
  onError(event) {
    const [errors] = event.detail
    this.errorTargets.forEach(target => target.innerHTML = badgeFor(errors[target.dataset.field]))
    this.fieldTargets.forEach(target => setClass(target, errors[target.dataset.field] == null))
  }
}
