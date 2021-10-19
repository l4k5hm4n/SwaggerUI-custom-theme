import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { set } from "lodash"

export default class ModelExample extends React.Component {
  static propTypes = {
    getComponent: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    schema: PropTypes.object.isRequired,
    example: PropTypes.any.isRequired,
    isExecute: PropTypes.bool,
    getConfigs: PropTypes.func.isRequired,
    specPath: ImPropTypes.list.isRequired,
    includeReadOnly: PropTypes.bool,
    includeWriteOnly: PropTypes.bool,
  }

  constructor(props, context) {
    super(props, context)
    let { getConfigs, isExecute } = this.props
    let { defaultModelRendering } = getConfigs()

    let activeTab = defaultModelRendering

    if (defaultModelRendering !== "example" && defaultModelRendering !== "model") {
      activeTab = "example"
    }

    if(isExecute) {
      activeTab = "example"
    }

    this.state = {
      activeTab: activeTab,
      copyText: '',
      uniqueID: Math.floor((Math.random()*Math.random())*100000)
    }

  }

  copyToast = () => { 
    let uniqueID = Math.floor((Math.random()*Math.random())*100000);
    let toast = document.createElement("div");
    toast.className = `copyToast toast-${uniqueID}`;
    toast.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M9.00033 0.666992C4.41699 0.666992 0.666992 4.41699 0.666992 9.00033C0.666992 13.5837 4.41699 17.3337 9.00033 17.3337C13.5837 17.3337 17.3337 13.5837 17.3337 9.00033C17.3337 4.41699 13.5837 0.666992 9.00033 0.666992ZM7.33366 13.167L3.16699 9.00033L4.34199 7.82533L7.33366 10.8087L13.6587 4.48366L14.8337 5.66699L7.33366 13.167Z" fill="white"/>
    </svg>
    <span>Code Copied.</span>
    `;

    document.querySelector('body').insertAdjacentHTML('beforeend', toast.outerHTML)
    
    setTimeout( () => {
      document.querySelector(`.toast-${uniqueID}`).remove()
    }, 3000)
    
  } 

  activeTab =( e ) => {
    let { target : { dataset : { name } } } = e

    this.setState({
      activeTab: name,
    })

    setTimeout( () => {
      let text = document.querySelector(`.code-snippet-${this.state.uniqueID}`) !== null ? document.querySelector(`.code-snippet-${this.state.uniqueID}`).innerText : ''
      this.setState({
        copyText: text
      })
    }, 200)
    
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.isExecute &&
      !this.props.isExecute &&
      this.props.example
    ) {

      this.setState(
        { 
          activeTab: "example",
        })
    }

  }

  componentDidMount() {

    this.setState({
      activeTab: "example",
    })

    setTimeout( () => {
      let text = document.querySelector(`.code-snippet-${this.state.uniqueID}`) !== null ? document.querySelector(`.code-snippet-${this.state.uniqueID}`).innerText : ''
      this.setState({
        copyText: text
      })
    }, 200)

  }

  render() {
    let { getComponent, specSelectors, schema, example, isExecute, getConfigs, specPath, includeReadOnly, includeWriteOnly } = this.props
    let { defaultModelExpandDepth } = getConfigs()
    const ModelWrapper = getComponent("ModelWrapper")
    const HighlightCode = getComponent("highlightCode")

    let isOAS3 = specSelectors.isOAS3()

    return <div className="model-example">
      <div className="model-example-header">

      <ul className="tab">
        <li className={ "tabitem" + ( this.state.activeTab === "example" ? " active" : "") }>
          <a className="tablinks" data-name="example" onClick={ this.activeTab }>{isExecute ? "Edit Value" : "Example Value1"}</a>
        </li>
        { schema ? <li className={ "tabitem" + ( this.state.activeTab === "model" ? " active" : "") }>
          <a className={ "tablinks" + ( isExecute ? " inactive" : "" )} data-name="model" onClick={ this.activeTab }>
            {isOAS3 ? "Schema" : "Model" }
          </a>
        </li> : null }
      </ul>

      <div className="utility-buttons">
            <CopyToClipboard text={this.state.copyText}><button onClick={ this.copyToast }/></CopyToClipboard>
            <button className="maximize-btn"></button>
      </div>

      </div>

      <div className={`code-snippet-${this.state.uniqueID}`}>
        {
          this.state.activeTab === "example" ? (
            example ? example : (
              <HighlightCode value="(no example available)" getConfigs={ getConfigs } />
            )
          ) : null
        }
        {
          this.state.activeTab === "model" && <ModelWrapper schema={ schema }
                                                     getComponent={ getComponent }
                                                     getConfigs={ getConfigs }
                                                     specSelectors={ specSelectors }
                                                     expandDepth={ defaultModelExpandDepth }
                                                     specPath={specPath}
                                                     includeReadOnly = {includeReadOnly}
                                                     includeWriteOnly = {includeWriteOnly}/>


        }
        
      </div>

    </div>
  }

}
