import React from "react"
import { fromJS, Iterable } from "immutable"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import { defaultStatusCode, getAcceptControllingResponse } from "core/utils"

export default class Responses extends React.Component {
  static propTypes = {
    tryItOutResponse: PropTypes.instanceOf(Iterable),
    responses: PropTypes.instanceOf(Iterable).isRequired,
    produces: PropTypes.instanceOf(Iterable),
    producesValue: PropTypes.any,
    displayRequestDuration: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    method: PropTypes.string.isRequired,
    getComponent: PropTypes.func.isRequired,
    getConfigs: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    specActions: PropTypes.object.isRequired,
    oas3Actions: PropTypes.object.isRequired,
    oas3Selectors: PropTypes.object.isRequired,
    specPath: ImPropTypes.list.isRequired,
    fn: PropTypes.object.isRequired
  }

  static defaultProps = {
    tryItOutResponse: null,
    produces: fromJS(["application/json"]),
    displayRequestDuration: false
  }

  state = {
    ResponseCodeVisible: 0,
    ResponseCodeDropdown : false,
  }

  // These performance-enhancing checks were disabled as part of Multiple Examples
  // because they were causing data-consistency issues
  //
  // shouldComponentUpdate(nextProps) {
  //   // BUG: props.tryItOutResponse is always coming back as a new Immutable instance
  //   let render = this.props.tryItOutResponse !== nextProps.tryItOutResponse
  //   || this.props.responses !== nextProps.responses
  //   || this.props.produces !== nextProps.produces
  //   || this.props.producesValue !== nextProps.producesValue
  //   || this.props.displayRequestDuration !== nextProps.displayRequestDuration
  //   || this.props.path !== nextProps.path
  //   || this.props.method !== nextProps.method
  //   return render
  // }

	onChangeProducesWrapper = ( val ) => this.props.specActions.changeProducesValue([this.props.path, this.props.method], val)

  onResponseContentTypeChange = ({ controlsAcceptHeader, value }) => {
    const { oas3Actions, path, method } = this.props
    if(controlsAcceptHeader) {
      oas3Actions.setResponseContentType({
        value,
        path,
        method
      })
    }
  }

  toggleDropdown = ( event ) => {
    this.setState({
      ResponseCodeDropdown: !this.state.ResponseCodeDropdown
    })
  }
  onClickDropdown = ( index ) => {
    this.setState({
      ResponseCodeVisible: index
    })
    this.toggleDropdown()

  }

  render() {
    let {
      responses,
      tryItOutResponse,
      getComponent,
      getConfigs,
      specSelectors,
      fn,
      producesValue,
      displayRequestDuration,
      specPath,
      path,
      method,
      oas3Selectors,
      oas3Actions,
      tryItOutEnabled,
      showServerResponse
    } = this.props
    let defaultCode = defaultStatusCode( responses )

    const ContentType = getComponent( "contentType" )
    const LiveResponse = getComponent( "liveResponse" )
    const Response = getComponent( "response" )
    const ResponseCodeVisible = this.state.ResponseCodeVisible;

    let produces = this.props.produces && this.props.produces.size ? this.props.produces : Responses.defaultProps.produces

    const isSpecOAS3 = specSelectors.isOAS3()

    const acceptControllingResponse = isSpecOAS3 ?
      getAcceptControllingResponse(responses) : null

    return (
      <div className="responses-wrapper">
        {/* <div className="opblock-section-header">
          <h4>Response Codes</h4>
            { specSelectors.isOAS3() ? null : <label>
              <span>Response content type</span>
              <ContentType value={producesValue}
                         onChange={this.onChangeProducesWrapper}
                         contentTypes={produces}
                         className="execute-content-type"
                         ariaLabel="Response content type" />
                     </label> }
        </div> */}
        <div className="responses-inner">
          {
            !tryItOutResponse ? null
                              : <div>
                                  <LiveResponse response={ tryItOutResponse }
                                                tryItOutEnabled= { tryItOutEnabled }
                                                showServerResponse = {showServerResponse}
                                                tryItOutResponse= {tryItOutResponse}
                                                getComponent={ getComponent }
                                                getConfigs={ getConfigs }
                                                specSelectors={ specSelectors }
                                                path={ this.props.path }
                                                method={ this.props.method }
                                                displayRequestDuration={ displayRequestDuration } />
                                  <h4>Response Codes</h4>
                                </div>

          }

          <div className={`response-codes ${this.state.ResponseCodeDropdown ? "active" : ""}`}>

            <div onClick={ this.toggleDropdown } className="response-codes-selected">
                  {responses.entrySeq().map(([code, response1], index) => {
                    if(index == this.state.ResponseCodeVisible) {
                      return <span ><b>{code}</b> - { response1.get( "description" )}</span>
                    }
                  })}

          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M13.2292 7.49996L9.99583 10.7333L6.7625 7.49996C6.60681 7.34392 6.39543 7.25623 6.175 7.25623C5.95457 7.25623 5.74319 7.34392 5.5875 7.49996C5.2625 7.82496 5.2625 8.34996 5.5875 8.67496L9.4125 12.5C9.7375 12.825 10.2625 12.825 10.5875 12.5L14.4125 8.67496C14.7375 8.34996 14.7375 7.82496 14.4125 7.49996C14.0875 7.1833 13.5542 7.17496 13.2292 7.49996Z" fill="#999999"/>
          </svg>

            </div>

            <div className="response-codes-dropdown">
            {responses.entrySeq().map( ([code, response], index) => { 
                return (<li onClick={() => { this.onClickDropdown(index) }}
                className={`${this.state.ResponseCodeVisible == index ? "active" : ""}`}
                ><b>{code}</b> <br></br> { response.get( "description" )}</li>)
            })}
            </div>

           </div>
         
          {/* <table className="responses-table"> */}
            <thead>
              {/* <tr className="responses-header">
                <td className="col_header response-col_status">Code {this.state.ResponseCodeVisible}</td>
                <td className="col_header response-col_description">Description</td>
                { specSelectors.isOAS3() ? <td className="col col_header response-col_links">Links</td> : null }
              </tr> */}
            </thead>
            {/* <tbody> */}
              {
                responses.entrySeq().map( ([code, response], index) => {                 
              
                  let className = tryItOutResponse && tryItOutResponse.get("status") == code ? "response_current" : ""
                  return (
    
                    <div className={this.state.ResponseCodeVisible == index ? 'visible' : 'hidden'}>
                   
                    <Response key={ code }
                              path={path}
                              method={method}
                              specPath={specPath.push(code)}
                              isDefault={defaultCode === code}
                              fn={fn}
                              className={ className }
                              code={ code }
                              response={ response }
                              specSelectors={ specSelectors }
                              controlsAcceptHeader={response === acceptControllingResponse}
                              onContentTypeChange={this.onResponseContentTypeChange}
                              contentType={ producesValue }
                              getConfigs={ getConfigs }
                              activeExamplesKey={oas3Selectors.activeExamplesMember(
                                path,
                                method,
                                "responses",
                                code
                              )}
                              oas3Actions={oas3Actions}
                              getComponent={ getComponent }/>
                    </div>
                   
                  )
                }
                ).toArray()
              }
            {/* </tbody> */}
          {/* </table> */}
        </div>
      </div>
    )
  }
}
