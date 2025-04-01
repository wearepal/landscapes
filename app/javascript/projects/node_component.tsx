import * as React from 'react'
import { Control, Node, Socket } from 'rete-react-render-plugin'
import $ from 'jquery'

export class NodeComponent extends Node {
  private inputDebounceTimer: any
  props: any // TODO
  state: any // TODO


  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const { node, editor } = this.props

    node.data.name = e.target.value

    const t: any = this // TODO: a little hacky to appease typescript, I'd prefer something a little cleaner 
    t.setState({})

    clearTimeout(this.inputDebounceTimer)

    this.inputDebounceTimer = setTimeout(() => {
      editor.trigger("process")
    }, 1000)
  }

  render() {
    const { node, editor, bindSocket, bindControl } = this.props
    const { outputs, controls, inputs, selected } = this.state

    const select_controls = controls.filter((control: any) => control.type && control.type === "SelectControl")
    const date_controls = controls.filter((control: any) => control.type && control.type === "DateControl")
    const non_select_controls = controls.filter((control: any) => control.type !== "SelectControl" && control.type !== "DateControl")

    setTimeout(() => $('[title]').tooltip('dispose').tooltip())

    return (
      <div className={`node ${selected}`} style={{
        boxShadow:  "0px 0px 8px rgba(0, 0, 0, 0.25)",
        background: "rgba(0, 0, 0, 0.5)",
        color: "white",
        borderRadius: "4px",
        border:  node.meta.errorMessage ? "solid 2px rgba(210, 0, 0, .71)" : "solid 3px transparent",
        cursor: "pointer",
        minWidth: "250px",
        height: "auto",
        boxSizing: "content-box",
        position: "relative",
        userSelect: "none",
      }}>
        <div style={{ padding: "calc(.5rem - 3px)" }} className="d-flex align-items-center">
          <input
            type="text"
            className="form-control bg-dark text-light border-0"
            style={{ boxShadow: "none", width: "0px", flexGrow: "1" }}
            placeholder={node.name}
            value={node.data.name}
            onChange={this.handleInputChange}
            onPointerDown={e => e.stopPropagation()}
            onDoubleClick={e => e.stopPropagation()}
          />
          {
            node.meta.toolTip &&
            <i
              className="fas fa-question-circle text-secondary"
              style={{ marginLeft: -26, paddingRight: 10 }}
              onClick={() => { node.meta.toolTipLink ? window.open(node.meta.toolTipLink) : null }}
              title={node.meta.toolTip}
            />
          }

          {
            node.meta.errorMessage &&
            <i
              className="fas fa-exclamation-triangle ml-2 mb-1 text-danger"
              title={node.meta.errorMessage}
            />
          }
        </div>

        {select_controls.map(control => (
          <Control className="control" key={control.key} control={control} innerRef={bindControl} />
        ))}   
        {date_controls.map(control => (
          <Control className="control" key={control.key} control={control} innerRef={bindControl} />
        ))}

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            {inputs.map(input => (
              <div className="input" key={input.key}>
                <Socket type="input" socket={input.socket} io={input} innerRef={bindSocket} />
                {!input.showControl() && <div className="input-title">{input.name}</div>}
                {input.showControl() && <Control className="input-control" control={input.control} innerRef={bindControl} />}
              </div>
            ))}
          </div>
          <div>
            {outputs.map((output) => {
              const [name, units] = output.name.split(/(?=\[\[)/)
              return (
                <div className="output" key={output.key}>
                  <div className="output-title">
                    {name}
                    {units && <span className="badge badge-info bg-dark text-secondary" style={{ fontSize: '.7rem', fontWeight: 'normal'}}>{units.replace(/[\[\]]/g, '')}</span>}
                  </div>
                  <Socket type="output" socket={output.socket} io={output} innerRef={bindSocket} />
                </div>
              )
            })}
          </div>
        </div>
        {non_select_controls.map(control => (
          <Control className="control" key={control.key} control={control} innerRef={bindControl} />
        ))}
      </div>
    )
  }
}
