import React from "react"
import PropTypes from "prop-types"
import Im from "immutable"

const SWAGGER2_OPERATION_METHODS = [
  "get", "put", "post", "delete", "options", "head", "patch"
]

const OAS3_OPERATION_METHODS = SWAGGER2_OPERATION_METHODS.concat(["trace"])


export default class Operations extends React.Component {

  static propTypes = {
    specSelectors: PropTypes.object.isRequired,
    specActions: PropTypes.object.isRequired,
    oas3Actions: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    oas3Selectors: PropTypes.func.isRequired,
    layoutSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
    authSelectors: PropTypes.object.isRequired,
    getConfigs: PropTypes.func.isRequired,
    fn: PropTypes.func.isRequired
  };

  

  render() {
    
    let {
      specSelectors,
    } = this.props

    const taggedOps = specSelectors.taggedOperations()

    if(taggedOps.size === 0) {
      return <h3> No operations defined in spec!</h3>
    }

    // console.log(taggedOps.map((currElement) => { console.log(currElement.toJS().operations,Object.keys(taggedOps.toJS())[0])  }))
    
    const {

      getComponent,
      oas3Selectors,
      layoutSelectors,
      layoutActions,
      getConfigs,
    } = this.props
    // console.log(tagObj,tag,layoutSelectors, 'ls', layoutActions, 'la', getComponent, 'gc', specSelectors.url(), 'url' )
    const OperationContainer = getComponent("OperationContainer", true)
    const OperationTag = getComponent("OperationTag")

    // console.log(layoutSelectors, 'ls',oas3Selectors, 'os',layoutActions,'la' )
    const firstOperationTag = Object.keys(specSelectors.taggedOperations().toJS())[0]

    let result 

    if(window.singleLayout) {

      taggedOps.map( (tagObj, tag) => {
        const operations = tagObj.get("operations")
        
        tagObj.get("operations").map( operation => {
  
        if(operation.get("operation").get("operationId") == "createSchemaVersion") {
  
        console.log(operation.get("operation").get("operationId"))
  
        result = <OperationTag
            key={"operation-" + tag}
            tagObj={tagObj}
            tag={tag}
            oas3Selectors={oas3Selectors}
            layoutSelectors={layoutSelectors}
            layoutActions={layoutActions}
            getConfigs={getConfigs}
            getComponent={getComponent}
            specUrl={specSelectors.url()}
            firstOperation={false }
            // apisLength={Object.keys(operations).length}>
            apisLength={operations.size}
            singleLayout={singleLayout}
            >        
            <div className={`operation-tag-content`}>
              {
                operations.map( (op, index) => {
                  const path = op.get("path")
                  const method = op.get("method")
                  const specPath = Im.List(["paths", path, method])
                  // console.warn(specPath, path, method)
                  // FIXME: (someday) this logic should probably be in a selector,
                  // but doing so would require further opening up
                  // selectors to the plugin system, to allow for dynamic
                  // overriding of low-level selectors that other selectors
                  // rely on. --KS, 12/17
                  const validMethods = specSelectors.isOAS3() ?
                    OAS3_OPERATION_METHODS : SWAGGER2_OPERATION_METHODS
    
                  if (validMethods.indexOf(method) === -1) {
                    return null
                  }              
    
                  if( op.get("operation").get("operationId") == "createSchemaVersion" ) {
    
                  return (
            
                    <OperationContainer
                      key={`${path}-${method}`}
                      specPath={specPath}
                      op={op}
                      path={path}
                      method={method}
                      tag={tag}
                      apisLength={operations}
                      methodIndex={index}
                      />
                  
                  )
    
                  }
    
                  else {
                    return null
                  }
    
    
                }).toArray()
              }
            </div>
          </OperationTag>
  
        }
  
      })  
  
      })
    }

    else {
  
      result = <div>
          { taggedOps.map(this.renderOperationTag).toArray() }
          { taggedOps.size < 1 ? <h3> No operations defined in spec! </h3> : null }
        </div>
      
    }

    return result

  }

   renderOperationTag = (tagObj, tag) => {
    const {
      specSelectors,
      getComponent,
      oas3Selectors,
      layoutSelectors,
      layoutActions,
      getConfigs,
    } = this.props
    // console.log(tagObj,tag,layoutSelectors, 'ls', layoutActions, 'la', getComponent, 'gc', specSelectors.url(), 'url' )
    const OperationContainer = getComponent("OperationContainer", true)
    const OperationTag = getComponent("OperationTag")
    const operations = tagObj.get("operations")

    // console.log(layoutSelectors, 'ls',oas3Selectors, 'os',layoutActions,'la' )
    const firstOperationTag = Object.keys(specSelectors.taggedOperations().toJS())[0]

    return (
      <OperationTag
        key={"operation-" + tag}
        tagObj={tagObj}
        tag={tag}
        oas3Selectors={oas3Selectors}
        layoutSelectors={layoutSelectors}
        layoutActions={layoutActions}
        getConfigs={getConfigs}
        getComponent={getComponent}
        specUrl={specSelectors.url()}
        firstOperation={false }
        // apisLength={Object.keys(operations).length}>
        apisLength={operations.size}>
        <div className={`operation-tag-content`}>
          {
            operations.map( (op, index) => {
              const path = op.get("path")
              const method = op.get("method")
              const specPath = Im.List(["paths", path, method])
              // console.warn(specPath, path, method)
              // FIXME: (someday) this logic should probably be in a selector,
              // but doing so would require further opening up
              // selectors to the plugin system, to allow for dynamic
              // overriding of low-level selectors that other selectors
              // rely on. --KS, 12/17
              const validMethods = specSelectors.isOAS3() ?
                OAS3_OPERATION_METHODS : SWAGGER2_OPERATION_METHODS

              if (validMethods.indexOf(method) === -1) {
                return null
              }              

              return (
        
                <OperationContainer
                  key={`${path}-${method}`}
                  specPath={specPath}
                  op={op}
                  path={path}
                  method={method}
                  tag={tag}
                  apisLength={operations}
                  methodIndex={index}
                  />
              
              )

            }).toArray()
          }
        </div>
      </OperationTag>
    )
  }

}

Operations.propTypes = {
  layoutActions: PropTypes.object.isRequired,
  specSelectors: PropTypes.object.isRequired,
  specActions: PropTypes.object.isRequired,
  layoutSelectors: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired,
  fn: PropTypes.object.isRequired
}
