/*** IMPORTS ***/
// Module imports
import React, { Component, Fragment } from "react"
import createHistory from "history/createBrowserHistory"
import Icon from "@fortawesome/react-fontawesome"
import {
  faCaretUp,
  faCaretRight,
  faCaretLeft,
  faHandPointUp,
  faArrowAltCircleDown,
  faCheck,
  faMapMarkerAlt
} from "@fortawesome/fontawesome-free-solid"

// Local JS
import Database from "../resources/Database"
import { toFirstCap, moneyfy, gradientStyle } from "../resources/Util"
/*** [end of imports] ***/

const history = createHistory()

export default class Scenario extends Component {
  constructor(props) {
    super(props)

    this.state = {
      xTransform: 0,
      yTransform: 0,
      touchStartX: 0,
      touchStartY: 0,
      lastTouchX: 0,
      lastTouchY: 0,
      style: {
        transform: `translateX(0) translateY(0) scale(${
          this.props.first ? 1 : 0.9
        })`
      },
      previewStyle: {
        opacity: 1,
        zIndex: 5
      },
      upStyle: {
        opacity: 0,
        zIndex: 0
      },
      leftStyle: {
        opacity: 0,
        zIndex: 0
      },
      rightStyle: {
        opacity: 0,
        zIndex: 0
      },
      upThreshold: -64,
      swipeThreshold: 128,
      transitionTiming: 100
    }

    this.handleTouchStart = this.handleTouchStart.bind(this)
    this.handleTouchMove = this.handleTouchMove.bind(this)
    this.handleTouchEnd = this.handleTouchEnd.bind(this)
  }

  componentDidMount = () => {
    this.setState({
      xTransform: 0,
      yTransform: 0,
      touchStartX: 0,
      touchStartY: 0,
      lastTouchX: 0,
      lastTouchY: 0,
      style: {
        transform: `translateX(0) translateY(0) scale(${
          this.props.first ? 1 : 0.9
        })`
      },
      upStyle: {
        opacity: 0,
        zIndex: 0
      },
      leftStyle: {
        opacity: 0,
        zIndex: 0
      },
      rightStyle: {
        opacity: 0,
        zIndex: 0
      },
      firstChecked: false
    })
  }

  actionsBuild = () => {
    const { previewStyle, upStyle, leftStyle, rightStyle } = this.state
    const { first, previewDismissed, feedType, dismissPreview } = this.props

    if (feedType === "donator") {
      return (
        <Fragment>
          {first &&
            !previewDismissed && (
              <div className="pseudo-preview" style={previewStyle}>
                <div className="action up-action">
                  <div className="pseudo-main-text">Fund</div>
                  <div className="pseudo-sub-text">full amount</div>
                  <div className="arrow arrow-up">
                    <Icon icon={faCaretUp} />
                  </div>
                </div>
                <div className="action right-action">
                  <div className="pseudo-main-text">Donate</div>
                  <div className="pseudo-sub-text">$0.20</div>
                  <div className="arrow arrow-right">
                    <Icon icon={faCaretRight} />
                  </div>
                </div>
                <div className="action left-action">
                  <div className="pseudo-main-text">Dismiss</div>
                  <div className="pseudo-sub-text">don't fund</div>
                  <div className="arrow arrow-left">
                    <Icon icon={faCaretLeft} />
                  </div>
                </div>
                <div className="touch-icon">
                  <Icon icon={faHandPointUp} />
                </div>
                <div className="action down-action">
                  <button
                    className="btn preview-dismiss-btn"
                    onClick={() => this.props.dismissPreview()}
                  >
                    Got it
                  </button>
                </div>
              </div>
            )}
          <div className="pseudo-up" style={upStyle}>
            <div className="action down-action">
              <div className="pseudo-main-text">Fund</div>
              <div className="pseudo-sub-text">full amount</div>
              <div className="arrow arrow-up">
                <Icon icon={faCaretUp} />
              </div>
            </div>
          </div>
          <div className="pseudo-before" style={leftStyle}>
            <div className="action left-action">
              <div className="pseudo-main-text">Donate</div>
              <div className="pseudo-sub-text">$0.20</div>
              <div className="arrow arrow-right">
                <Icon icon={faCaretRight} />
              </div>
            </div>
          </div>
          <div className="pseudo-after" style={rightStyle}>
            <div className="action right-action">
              <div className="pseudo-main-text">Dismiss</div>
              <div className="pseudo-sub-text">don't fund</div>
              <div className="arrow arrow-left">
                <Icon icon={faCaretLeft} />
              </div>
            </div>
          </div>
        </Fragment>
      )
    } else if (feedType === "doer") {
      return (
        <Fragment>
          {first &&
            !previewDismissed && (
              <div className="pseudo-preview" style={previewStyle}>
                <div className="action right-action">
                  <div className="pseudo-main-text">Accept</div>
                  <div className="pseudo-sub-text">do this job</div>
                  <div className="arrow arrow-right">
                    <Icon icon={faCaretRight} />
                  </div>
                </div>
                <div className="action left-action">
                  <div className="pseudo-main-text">Dismiss</div>
                  <div className="pseudo-sub-text">don't do job</div>
                  <div className="arrow arrow-left">
                    <Icon icon={faCaretLeft} />
                  </div>
                </div>
                <div className="touch-icon">
                  <Icon icon={faHandPointUp} />
                </div>
                <div className="action down-action">
                  <button
                    className="btn preview-dismiss-btn"
                    onClick={() => dismissPreview()}
                  >
                    Got it
                  </button>
                </div>
              </div>
            )}
          <div className="pseudo-before" style={leftStyle}>
            <div className="action left-action">
              <div className="pseudo-main-text">Accept</div>
              <div className="pseudo-sub-text">do this job</div>
              <div className="arrow arrow-right">
                <Icon icon={faCaretRight} />
              </div>
            </div>
          </div>
          <div className="pseudo-after" style={rightStyle}>
            <div className="action right-action">
              <div className="pseudo-main-text">Dismiss</div>
              <div className="pseudo-sub-text">don't do job</div>
              <div className="arrow arrow-left">
                <Icon icon={faCaretLeft} />
              </div>
            </div>
          </div>
        </Fragment>
      )
    } else if (feedType === "verifier") {
      return <Fragment />
    } else {
      return <Fragment />
    }
  }
  footerBuild = () => {
    const { feedType, scenario } = this.props
    const { event, donated, funding_goal } = scenario.attributes

    let fundingGoalSliderStyle = gradientStyle({
      dividend: donated,
      divisor: funding_goal,
      endColor: "#fff"
    })

    if (feedType === "donator") {
      return (
        <footer className="scenario-footer">
          <div className="funding-goal-label">
            <span>To fully fund </span>
            <span className="dollar-amount">
              {moneyfy(funding_goal - donated)}
            </span>
          </div>
          <div
            className="funding-progress-slider"
            id={`${event}_fundingGoal`}
            style={fundingGoalSliderStyle}
          />
          <div className="funding-goal-label">
            Target{" "}
            <span className="dollar-amount">{moneyfy(funding_goal)}</span>
          </div>
          <div className="funding-goal-summary">
            1 donator(s), {moneyfy(donated)} donated
          </div>
        </footer>
      )
    } else if (feedType === "doer") {
      return (
        <footer className="scenario-footer">
          <div className="tag-list-wrap">
            <span className="tag-list-label">Work needed:</span>
            <ul className="tag-list">
              <li className="tag active-tag">#Roofing</li>
              <li className="tag inactive-tag">#Labor</li>
              <li className="tag inactive-tag">#Painting</li>
              <li className="tag inactive-tag">#Transport</li>
              <li className="tag inactive-tag">#Building</li>
            </ul>
          </div>
        </footer>
      )
    } else if (feedType === "verifier") {
      return <footer className="scenario-footer" />
    } else {
      return <footer className="scenario-footer" />
    }
  }

  handleTouchStart = e => {
    this.setState({
      touchStartX: e.targetTouches[0].clientX,
      touchStartY: e.targetTouches[0].clientY,
      style: {
        transform: `translateX(0) translateY(0) scale(${
          this.props.first ? 1 : 0.9
        })`,
        zIndex: 10
      }
    })
  }
  handleTouchMove = e => {
    const { touchStartX, touchStartY, upThreshold } = this.state
    const { first, previewDismissed } = this.props

    if (previewDismissed) {
      let currentTouchX = e.targetTouches[0].clientX
      let currentTouchY = e.targetTouches[0].clientY
      let xDif = currentTouchX - touchStartX
      let yDif = currentTouchY - touchStartY

      if (yDif < upThreshold) {
        this.setState({
          xTransform: xDif,
          yTransform: yDif,
          lastTouchX: currentTouchX,
          lastTouchY: currentTouchY,
          style: {
            transform: `translateX(${xDif}px) translateY(${yDif}px) scale(${
              first ? 1 : 0.9
            })`
          },
          upStyle: {
            opacity: 1,
            zIndex: 5
          },
          leftStyle: {
            opacity: 0,
            zIndex: 0
          },
          rightStyle: {
            opacity: 0,
            zIndex: 0
          }
        })
      } else {
        if (xDif > 0) {
          this.setState({
            xTransform: xDif,
            yTransform: yDif,
            lastTouchX: currentTouchX,
            lastTouchY: currentTouchY,
            style: {
              transform: `translateX(${xDif}px) translateY(${yDif}px) scale(${
                first ? 1 : 0.9
              })`
            },
            upStyle: {
              opacity: 0,
              zIndex: 0
            },
            leftStyle: {
              opacity: 1,
              zIndex: 5
            },
            rightStyle: {
              opacity: 0,
              zIndex: 0
            }
          })
        } else {
          this.setState({
            xTransform: xDif,
            yTransform: yDif,
            lastTouchX: currentTouchX,
            lastTouchY: currentTouchY,
            style: {
              transform: `translateX(${xDif}px) translateY(${yDif}px) scale(${
                first ? 1 : 0.9
              })`
            },
            upStyle: {
              opacity: 0,
              zIndex: 0
            },
            leftStyle: {
              opacity: 0,
              zIndex: 0
            },
            rightStyle: {
              opacity: 1,
              zIndex: 5
            }
          })
        }
      }
    }
  }
  handleTouchEnd = e => {
    const {
      touchStartX,
      touchStartY,
      lastTouchX,
      lastTouchY,
      swipeThreshold,
      upThreshold
    } = this.state

    let xDif = lastTouchX === 0 ? 0 : lastTouchX - touchStartX
    let yDif = lastTouchY === 0 ? 0 : lastTouchY - touchStartY

    if (Math.abs(xDif) > swipeThreshold || yDif < upThreshold) {
      if (yDif < upThreshold) {
        this.swipedUp()
      } else {
        if (touchStartX < lastTouchX) this.swipedRight()
        else this.swipedLeft()
      }
    } else {
      this.resetSwipePos()
    }
  }

  swipedUp = () => {
    const { transitionTiming } = this.state
    const { scenario } = this.props
    const { donated, funding_goal } = scenario.attributes

    let json = {
      scenarioId: scenario.id
    }

    if (this.adType() === "3") json["amount"] = funding_goal - donated

    this.setState({
      style: {
        transitionProperty: "transform margin, opacity, top, filter",
        transform: `translateX(0) translateY(-80vh) scale(${
          this.props.first ? 1 : 0.9
        })`,
        opacity: 0
      }
    })
    if (this.props.nextItem) {
      this.props.nextItem({
        directionSwiped: "up",
        fullFundAmount: funding_goal - donated
      })
    }

    setTimeout(() => {
      this.acceptScenario(json)
    }, transitionTiming)
  }
  swipedRight = () => {
    const { transitionTiming } = this.state
    const { scenario, feedType, standardAmount } = this.props

    let json = {
      scenarioId: scenario.id
    }

    if (this.adType() === "3") json["amount"] = standardAmount

    this.setState({
      style: {
        transitionProperty: "transform margin, opacity, top, filter",
        transform: `translateX(100%) translateY(0) scale(${
          this.props.first ? 1 : 0.9
        })`,
        opacity: 0
      }
    })

    if (this.props.nextItem) this.props.nextItem({ directionSwiped: "right" })

    if (feedType === "doer") {
      setTimeout(() => {
        history.push(`/${scenario.id}/doer/Instructions`)
        window.location = `/${scenario.id}/doer/Instructions`
      }, transitionTiming)
    } else {
      setTimeout(() => {
        this.acceptScenario(json)
      }, transitionTiming)
    }
  }
  swipedLeft = () => {
    const { scenario, first } = this.props
    const { id } = scenario

    this.setState({
      style: {
        transitionProperty: "transform margin, opacity, top, filter",
        transform: `translateX(-100%) translateY(0) scale(${first ? 1 : 0.9})`,
        opacity: 0
      }
    })

    if (this.props.nextItem) {
      this.props.nextItem({ directionSwiped: "left" })
    }

    this.dismissScenario({ scenarioId: id })
  }
  resetSwipePos = () => {
    this.setState({
      style: {
        transform: `translateX(0) translateY(0) scale(${
          this.props.first ? 1 : 0.9
        })`,
        zIndex: 10
      },
      upStyle: {
        opacity: 0,
        zIndex: 0
      },
      leftStyle: {
        opacity: 0,
        zIndex: 0
      },
      rightStyle: {
        opacity: 0,
        zIndex: 0
      }
    })
  }

  adType = () => {
    const { feedType } = this.props

    if (feedType === "doer") return "1"
    else if (feedType === "requester") return "2"
    else if (feedType === "donator") return "3"
    else if (feedType === "verifier") return "4"
    return "3"
  }
  dismissScenario = params => {
    let json = {
      data: {
        type: "user_ad_interactions",
        attributes: {},
        relationships: {
          user: {
            data: {
              type: "users",
              id: "1"
            }
          },
          scenario: {
            data: {
              id: params.scenarioId,
              type: "scenarios"
            }
          },
          ad_type: {
            data: {
              id: this.adType(),
              type: "ad_types"
            }
          },
          interaction_type: {
            data: {
              id: "2", // dismissal
              type: "interaction_types"
            }
          }
        }
      }
    }

    Database.createUserAdInteraction(json)
      .then(result => {
        // console.log("User ad interaction successfully created:", result)
        this.props.removeFromFeed()
      })
      .catch(error => {
        // console.error("Error creating user ad interaction:", error)
      })
  }
  acceptScenario = params => {
    let json = {
      data: {
        type: "user_ad_interactions",
        attributes: {},
        relationships: {
          user: {
            data: {
              type: "users",
              id: "1"
            }
          },
          scenario: {
            data: {
              id: params.scenarioId,
              type: "scenarios"
            }
          },
          ad_type: {
            data: {
              id: this.adType(),
              type: "ad_types"
            }
          },
          interaction_type: {
            data: {
              id: "1", // Positive interaction
              type: "interaction_types"
            }
          }
        }
      }
    }

    Database.createUserAdInteraction(json)
      .then(result => {
        // console.log("User ad interaction successfully created:", result)
        if (this.adType() === "3") {
          this.donate({
            amount: params.amount,
            scenarioId: params.scenarioId
          })
        }
      })
      .catch(error => {
        // console.error("Error creating user ad interaction:", error)
      })
  }
  donate = params => {
    let json = {
      data: {
        type: "donations",
        attributes: {
          amount: params.amount
        },
        relationships: {
          scenario: {
            data: {
              id: params.scenarioId,
              type: "scenarios"
            }
          },
          donator: {
            data: {
              type: "users",
              id: "1"
            }
          }
        }
      }
    }

    Database.createDonation(json)
      .then(result => {
        // console.log("Donation successfully created:", result)
      })
      .catch(error => {
        // console.error("Error creating donation:", error)
      })
  }

  render() {
    const { style, firstChecked } = this.state
    const { first, scenario } = this.props
    const { id, attributes } = scenario
    const {
      event,
      image,
      requester_firstname,
      requester_lastname,
      noun,
      verb,
      customMessage
    } = attributes

    if (first && !firstChecked) {
      this.setState({
        firstChecked: true,
        style: {
          transform: "translateX(0) translateY(0) scale(1)"
        }
      })
    }

    return (
      <article
        className={first ? "scenario first" : "scenario"}
        id={`scenario_${id}`}
        style={style}
        onTouchStart={e => this.handleTouchStart(e)}
        onTouchMove={e => this.handleTouchMove(e)}
        onTouchEnd={e => this.handleTouchEnd(e)}
      >
        {this.actionsBuild()}
        <figure className="scenario-image-wrap">
          <img src={image} alt={event} className="scenario-image" />
        </figure>
        <div className="scenario-body">
          <header className="scenario-header">
            <h4 className="scenario-title">
              {`${toFirstCap(verb)} ${toFirstCap(
                requester_firstname
              )}'s ${noun}`}
            </h4>
          </header>

          <section className="scenario-subheader">
            <div className="user-info">
              <figure className="user-avatar" />
              <div className="user-name">
                {requester_firstname} {requester_lastname}
              </div>
              <div className="user-verified-status">
                <Icon icon={faCheck} />
              </div>
            </div>
            <div className="scenario-location">
              <div className="location-name">Pearlington, Louisiana</div>
              <div className="location-icon">
                <Icon icon={faMapMarkerAlt} />
              </div>
            </div>
          </section>

          <div className="scenario-description">
            {customMessage ||
              "My roof was blown off in Hurricane Katrina. I need your help to fix it. Can have more info here to help tell the story and convince people to do this."}
          </div>

          <section className="scenario-tags">
            <div className="scenario-event-location">{event}</div>
            <div className="scenario-severity">Urgent</div>
          </section>

          {this.footerBuild()}
        </div>
        <a className="btn accept-scenario-btn" href={`/${id}/donator/`}>
          <Icon icon={faArrowAltCircleDown} />
        </a>
      </article>
    )
  }
}
