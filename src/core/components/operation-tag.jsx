import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import Im from "immutable"
import { createDeepLinkPath, escapeDeepLinkPath, sanitizeUrl } from "core/utils"
import { buildUrl } from "core/utils/url"
import { isFunc } from "core/utils"

export default class OperationTag extends React.Component {

  static defaultProps = {
    tagObj: Im.fromJS({}),
    tag: "",
  }

  static propTypes = {
    tagObj: ImPropTypes.map.isRequired,
    tag: PropTypes.string.isRequired,

    oas3Selectors: PropTypes.func.isRequired,
    layoutSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired,

    getConfigs: PropTypes.func.isRequired,
    getComponent: PropTypes.func.isRequired,

    specUrl: PropTypes.string.isRequired,

    children: PropTypes.element,
  }

  render() {
    const {
      tagObj,
      tag,
      children,
      oas3Selectors,
      layoutSelectors,
      layoutActions,
      getConfigs,
      getComponent,
      specUrl,
      firstOperation, 
      apisLength,
      singleLayout
    } = this.props

    let {
      docExpansion,
      deepLinking,
    } = getConfigs()

    const isDeepLinkingEnabled = deepLinking && deepLinking !== "false"

    const Collapse = getComponent("Collapse")
    const Markdown = getComponent("Markdown", true)
    const DeepLink = getComponent("DeepLink")
    const Link = getComponent("Link")

    let tagDescription = tagObj.getIn(["tagDetails", "description"], null)
    let tagExternalDocsDescription = tagObj.getIn(["tagDetails", "externalDocs", "description"])
    let rawTagExternalDocsUrl = tagObj.getIn(["tagDetails", "externalDocs", "url"])
    let tagExternalDocsUrl
    if (isFunc(oas3Selectors) && isFunc(oas3Selectors.selectedServer)) {
      tagExternalDocsUrl = buildUrl( rawTagExternalDocsUrl, specUrl, { selectedServer: oas3Selectors.selectedServer() } )
    } else {
      tagExternalDocsUrl = rawTagExternalDocsUrl
    }
    // gives the unique operations tag id
    let isShownKey = ["operations-tag", tag]
    // checks if the tag can be shown or not based on the docExpansion config value
    // let showTag = layoutSelectors.isShown(isShownKey, docExpansion === "full" || docExpansion === "list")
    let showTag = layoutSelectors.isShown(isShownKey, false || firstOperation)
    // console.log(isShownKey,showTag)
    // console.log(docExpansion,deepLinking)


      if(!singleLayout){

      return (
      <div className={showTag ? "opblock-tag-section is-open" : "opblock-tag-section"} >
        <h4
          onClick={() => layoutActions.show(isShownKey, !showTag)}
          className={!tagDescription ? "opblock-tag no-desc" : "opblock-tag" }
          id={isShownKey.map(v => escapeDeepLinkPath(v)).join("-")}
          data-tag={tag}
          data-is-open={showTag}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`arrow ${showTag ? "arrow-direction-down" : "arrow-direction-right"}`} width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M17.2892 9.00002C16.8992 8.61002 16.2692 8.61002 15.8792 9.00002L11.9992 12.88L8.11925 9.00002C7.72925 8.61002 7.09925 8.61002 6.70925 9.00002C6.31925 9.39002 6.31925 10.02 6.70925 10.41L11.2992 15C11.6892 15.39 12.3192 15.39 12.7092 15L17.2992 10.41C17.6792 10.03 17.6792 9.39002 17.2892 9.00002Z" fill="#4A59D9"/>
            </svg>
          {/* <svg className="arrow" width="20" height="20">
                <use href={showTag ? "#large-arrow-down" : "#large-arrow"} xlinkHref={showTag ? "#large-arrow-down" : "#large-arrow"} />
          </svg> */}
          <DeepLink
            enabled={isDeepLinkingEnabled}
            isShown={showTag}
            path={createDeepLinkPath(tag)}
            text={tag} />

          { !tagDescription ? '' :
            <small>
                <Markdown source={tagDescription} />
              </small>
          }

              { !tagExternalDocsDescription ? null :
                <div>
                <small>
                    { tagExternalDocsDescription }
                      { tagExternalDocsUrl ? ": " : null }
                      { tagExternalDocsUrl ?
                        <Link
                            href={sanitizeUrl(tagExternalDocsUrl)}
                            onClick={(e) => e.stopPropagation()}
                            target="_blank"
                            >{tagExternalDocsUrl}</Link> : null
                          }
                  </small>
                  </div>
                }
               <p>({apisLength} APIs)</p>
            {/* <button
              className="expand-operation"
              title={showTag ? "Collapse operation": "Expand operation"}
              onClick={() => layoutActions.show(isShownKey, !showTag)}>
              
              
            </button> */}
        </h4>

        <Collapse isOpened={showTag}>
          {children}
        </Collapse>
      </div>
        )

      }

      else {
        return children
      }
  }
}
