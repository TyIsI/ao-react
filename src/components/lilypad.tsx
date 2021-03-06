import * as React from 'react'
import { observer } from 'mobx-react'
import { computed } from 'mobx'
import aoStore from '../client/store'
import api from '../client/api'
import AoMemberIcon from './memberIcon'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/translucent.css'

interface Props {
  taskId: string
}

interface State {
  show?: boolean
  now: number
}

@observer
export default class AoChatroom extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = { show: false, now: Date.now() }
    this.hopHere = this.hopHere.bind(this)
    this.joinChat = this.joinChat.bind(this)
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({ now: Date.now() })
    }, 5000)
  }

  hopHere() {
    api.visitCard(this.props.taskId, false)
    aoStore.setCurrentChatroom(null)
  }

  joinChat() {
    console.log('showing chatroom')
    aoStore.setCurrentChatroom(this.props.taskId)
    api.visitCard(this.props.taskId, true)
  }

  @computed get renderAvatarList() {
    const taskId = this.props.taskId
    const card = aoStore.hashMap.get(taskId)
    if (!card || !card.hasOwnProperty('avatars') || card.avatars.length <= 0) {
      return null
    }

    const renderedAvatars = card.avatars.map(avatarLocation => {
      const { memberId, timestamp, area } = avatarLocation
      const member = aoStore.memberById.get(memberId)
      const name = member ? member.name : 'deleted member'

      const now = this.state.now
      const msSince = now - avatarLocation.timestamp
      const seconds = msSince / 1000

      return (
        <div key={memberId}>
          <AoMemberIcon memberId={memberId} /> {name}{' '}
          {area === 1 && seconds <= 70 && <small>in chat</small>}
        </div>
      )
    })

    if (renderedAvatars.length <= 0) {
      return null
    }

    return (
      <div className="infoTooltip">
        <h4>Who's Here</h4>
        {renderedAvatars}
      </div>
    )
  }

  render() {
    const card = aoStore.hashMap.get(this.props.taskId)
    if (!card) {
      console.log('Attempt to access chatroom on missing card.')
      return null
    }

    const cardPop = card.avatars ? card.avatars.length : 0

    const now = this.state.now

    const chatroomPop = card.avatars
      ? card.avatars.filter(avatarLocation => {
          const msSince = now - avatarLocation.timestamp
          const seconds = msSince / 1000
          return avatarLocation.area === 1 && seconds <= 70
        }).length
      : 0

    const youAreHere = card.avatars
      ? card.avatars.some(avatarLocation => {
          const msSince = now - avatarLocation.timestamp
          const seconds = msSince / 1000
          return (
            avatarLocation.memberId === aoStore.member.memberId &&
            avatarLocation.area === 1 &&
            seconds <= 70
          )
        })
      : false

    let button
    let altMessage
    if (!card.guild || card.guild.length <= 1) {
      return null
      // let message = youAreHere ? 'You Are Here' : 'Move Here'
      // button = (
      //   <div className="lilypad action" onClick={this.hopHere}>
      //     {message}
      //     {cardPop >= 1 && ' (' + cardPop + ')'}
      //   </div>
      // )
      // altMessage = 'Move your avatar here'
    } else {
      let message = youAreHere
        ? 'In Chat'
        : chatroomPop >= 1
        ? 'Join Chat'
        : 'Start Chat'
      button = (
        <div className="lilypad action" onClick={this.joinChat}>
          {message}
          {cardPop >= 1 && ' (' + chatroomPop + '/' + cardPop + ')'}
        </div>
      )
      altMessage = (chatroomPop >= 1 ? 'Join' : 'Start') + ' mission video call'
    }

    return (
      <Tippy
        zIndex={4}
        theme="translucent"
        content={this.renderAvatarList || altMessage}
        delay={[625, 200]}>
        {button}
      </Tippy>
    )
  }
}
