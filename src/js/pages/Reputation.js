/*** IMPORTS ***/
// Module imports
import React, { Component } from "react"
import { Link } from "react-router-dom"
import Cookies from "js-cookie"
import Icon from "@fortawesome/react-fontawesome"
import { faCheck, faSmile, faFrown } from "@fortawesome/fontawesome-free-solid"

// Components
import Page from "./Page"
// import MiniScenario from "../components/MiniScenario"
import Main from "../components/Main"

// Utilities
import Database from "../resources/Database"
import { toFirstCap } from "../resources/Util"

// Icons
import catRed from "../../img/cat-red.svg"
import catGreen from "../../img/cat-green.svg"
/*** [end of imports] ***/

export default class Reputation extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userDonations: null,
      userDos: null,
      userRequests: null,
      userVerifications: null,
      currentUserData: null,
      userId: this.props.match.params.otherUserId || Cookies.get("userId") || 1
    }
  }

  componentDidMount = () => {
    this.userDataMount()
    this.userDonationsMount()
    this.userDosMount()
    this.userRequestsMount()
    this.userVerificationsMount()
  }

  userDataMount = () => {
    Database.getUserById({ id: this.state.userId })
      .then(result => {
        // console.log("User successfully found:", result)
        this.setState({
          currentUserData: result.body.data.attributes
        })
      })
      .catch(error => {
        // console.error("Error getting user:", error)
        this.setState({
          currentUserData: null
        })
      })
  }
  userDonationsMount = () => {
    const json = { id: this.state.userId }

    Database.getUserDonations(json)
      .then(result => {
        const { data } = result.body
        // console.info("Donations call complete:", data)

        this.setState({
          userDonations: data
        })
      })
      .catch(error => {
        // console.error("Error getting donations:", error)
        this.setState({
          userDonations: null
        })
      })
  }
  userDosMount = () => {
    const json = { id: this.state.userId }

    Database.getUserDos(json)
      .then(result => {
        const { data } = result.body
        // console.info("Dos call complete:", data)

        this.setState({
          userDos: data
        })
      })
      .catch(error => {
        // console.error("Error getting dos:", error)
        this.setState({
          userDos: null
        })
      })
  }
  userRequestsMount = () => {
    const json = { id: this.state.userId }

    Database.getUserRequests(json)
      .then(result => {
        const { data } = result.body
        // console.info("Requests call complete:", data)

        this.setState({
          userRequests: data
        })
      })
      .catch(error => {
        // console.error("Error getting requests:", error)
        this.setState({
          userRequests: null
        })
      })
  }
  userVerificationsMount = () => {
    const json = { id: this.state.userId }

    Database.getUserVerifications(json)
      .then(result => {
        const { data } = result.body
        // console.info("Verifications call complete:", data)

        this.setState({
          userVerifications: data
        })
      })
      .catch(error => {
        // console.error("Error getting verifications:", error)
        this.setState({
          userVerifications: null
        })
      })
  }

  createMiniList = proofs => {
    return (
      <div className="profile-proofs-wrap">
        {proofs &&
          proofs.map((proof, index) => {
            if (index < 9) {
              let positive = Math.random() > 0.1 // TODO: currently random, will be scenario.attributes.is_complete
              return (
                <div
                  key={proof.id}
                  className={positive ? "proof positive" : "proof negative"}
                >
                <img src={positive ? catGreen : catRed} alt="cat" />
                  {/* <Icon icon={positive ? faSmile : faFrown} /> */}
                </div>
              )
            } else if (index === 9) {
              return <span className="rest" key="last">...</span>
            }
          })}
      </div>
    )
  }

  render() {
    const {
      currentUserData,
      userDonations,
      userDos,
      userRequests,
      userVerifications
    } = this.state

    return (
      <Page clas="profile-page">
        <Main>
          <header className="settings-header">
            <h3>Reputation</h3>
          </header>
          {currentUserData && currentUserData.firstname !== "" ? (
            <div className="user-info-area">
              {currentUserData.avatar ? (
                <div
                  className="user-image"
                  style={{
                    backgroundImage: `url("${currentUserData.avatar}")`
                  }}
                >
                  <img
                    src={currentUserData.avatar}
                    alt={currentUserData.firstname}
                  />
                </div>
              ) : (
                <Icon className="user-icon" icon="user" />
              )}

              <div className="user-name">
                <span>{toFirstCap(currentUserData.firstname)}</span>
                <span className="user-verified-icon">
                  <Icon icon={faCheck} />
                </span>
              </div>
            </div>
          ) : (
            <div className="user-info-area">
              <Icon className="user-icon" icon="question" />
              <Link className="user-name not-signed-in" to="/login/">
                Please sign in
              </Link>
            </div>
          )}
          <section className="profile">
            <article className="profile-article">
              <header className="profile-article-header">
                <h4>Honey</h4>
              </header>
            </article>
            <article className="profile-article">
              <header className="profile-article-header">
                <h4>Donations ({userDonations ? userDonations.length : 0})</h4>
              </header>
              {userDonations && this.createMiniList(userDonations)}
            </article>
            <article className="profile-article">
              <header className="profile-article-header">
                <h4>Tasks ({userDos ? userDos.length : 0})</h4>
              </header>
              {userDos && this.createMiniList(userDos)}
            </article>
            <article className="profile-article">
              <header className="profile-article-header">
                <h4>Requests ({userRequests ? userRequests.length : 0})</h4>
              </header>
              {userRequests && this.createMiniList(userRequests)}
            </article>
            <article className="profile-article">
              <header className="profile-article-header">
                <h4>
                  Verifications ({userVerifications
                    ? userVerifications.length
                    : 0})
                </h4>
              </header>
              {userVerifications && this.createMiniList(userVerifications)}
            </article>
          </section>
        </Main>
      </Page>
    )
  }
}