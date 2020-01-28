const utils = require( './utils')
const validators = require( './validators')
const events = require( '../events')
const connector = require( '../connector')
const state = require( '../state')
const Cards = require( '../../utils/cards')
// export single middleware for each type
module.exports = function(req,res,next){
  switch (req.body.type){
      case 'member-created':
           specMemberCreated(req, res, next)
           break
      case 'member-paid':
          specMemberPaid(req, res, next)
          break
      case 'member-charged':
          specMemberCharged(req, res, next)
          break
      case 'member-activated':
          specMemberActivated(req, res, next)
          break
      case 'member-deactivated':
          specMemberDeactivated(req, res, next)
          break
      case 'member-purged':
          specMemberPurged(req, res, next)
          break
      case 'member-field-updated':
          specMemberFieldUpdated(req, res, next)
          break
      case 'badge-added':
          specBadgeAdded(req, res, next)
          break
      case 'badge-removed':
          specBadgeRemoved(req, res, next)
          break
      case 'badge-hidden':
          specBadgeHidden(req, res, next)
          break
      case 'doge-barked':
          specDogeBarked(req, res, next)
          break
      case 'doge-muted':
          specDogeMuted(req, res, next)
          break
      case 'doge-unmuted':
          specDogeUnmuted(req, res, next)
          break
      case 'doge-migrated':
          specDogeMigrated(req, res, next)
          break
      default:
          next()
  }
}

function specMemberFieldUpdated(req, res, next){
  let errRes = []
  if (
    validators.isMemberId(req.body.memberId, errRes) &&
    validators.isField(req.body.field, errRes) &&
    validators.isNotes(req.body.newfield, errRes)
  ){
    events.memberFieldUpdated(
        req.body.memberId,
        req.body.field,
        req.body.newfield,
        utils.buildResCallback(res)
    )
  } else {
    res.status(400).send(errRes)
  }
}

function specMemberCreated(req, res, next){
  let errRes = []
  if (
    validators.isName(req.body.name, errRes) &&
    validators.isFob(req.body.fob, errRes) &&
    validators.isNotes(req.body.secret)
  ){
    events.memberCreated(
      req.body.name,
      req.body.fob,
      req.body.secret,
      utils.buildResCallback(res)
    )
  } else {
    res.status(400).send(errRes)
  }
}

function specMemberPaid(req, res, next){
  let errRes = []
  if (
    validators.isMemberId(req.body.memberId, errRes) &&
    validators.isAmount(req.body.paid, errRes) &&
    validators.isBool(req.body.isCash, errRes) &&
    validators.isNotes(req.body.fob, errRes)
  ){
    events.memberPaid(
      req.body.memberId,
      req.body.paid,
      req.body.isCash,
      req.body.notes,
      utils.buildResCallback(res)
    )
  } else {
    res.status(400).send(errRes)
  }
}

function specMemberCharged(req, res, next){
  let errRes = []
  if (
    validators.isMemberId(req.body.memberId, errRes) &&
    validators.isAmount(req.body.charged, errRes) &&
    validators.isNotes(req.body.notes, errRes)
  ){
    events.memberCharged(
      req.body.memberId,
      req.body.charged,
      req.body.notes,
      utils.buildResCallback(res)
    )
  } else {
    res.status(400).send(errRes)
  }
}

function specMemberDeactivated(req, res, next){
  let errRes = []
  if (
    validators.isMemberId(req.body.memberId, errRes)
  ){
    events.memberDeactivated(
      req.body.memberId,
      utils.buildResCallback(res)
    )
  } else {
    res.status(400).send(errRes)
  }
}

function specMemberPurged(req, res, next){
  let errRes = []
  if (
    validators.isMemberId(req.body.memberId, errRes)
  ){
    events.memberPurged(
      req.body.memberId,
      req.body.blame,
      utils.buildResCallback(res)
    )
  } else {
    res.status(400).send(errRes)
  }
}

function specMemberActivated(req, res, next){
  let errRes = []
  if (
    validators.isMemberId(req.body.memberId, errRes)
  ){
    events.memberActivated(
      req.body.memberId,
      utils.buildResCallback(res)
    )
  } else {
    res.status(400).send(errRes)
  }
}

function specBadgeAdded(req, res, next){
    let errRes = []
    if (
      validators.isMemberId(req.body.memberId, errRes) &&
      validators.isNotes( req.body.badge )
    ){
      events.badgeAdded(
        req.body.memberId,
        req.body.badge,
        utils.buildResCallback(res)
      )
    } else {
      res.status(400).send(errRes)
    }
}

function specBadgeRemoved(req, res, next){
    let errRes = []
    if (
      validators.isMemberId(req.body.memberId, errRes) &&
      validators.isNotes( req.body.badge )
    ){
      events.badgeRemoved(
        req.body.memberId,
        req.body.badge,
        utils.buildResCallback(res)
      )
    } else {
      res.status(400).send(errRes)
    }
}

function specBadgeHidden(req, res, next){
    let errRes = []
    if (
      validators.isMemberId(req.body.memberId, errRes) &&
      validators.isNotes( req.body.badge )
    ){
      events.badgeHidden(
        req.body.memberId,
        req.body.badge,
        utils.buildResCallback(res)
      )
    } else {
      res.status(400).send(errRes)
    }
}

function specDogeBarked(req, res, next) {
    let errRes = []
    if (
      validators.isMemberId(req.body.memberId, errRes)
    ){
      events.dogeBarked(
        req.body.memberId,
        utils.buildResCallback(res)
      )
    } else {
      res.status(400).send(errRes)
    }

}

function specDogeMuted(req, res, next) {
    let errRes = []
    if (validators.isMemberId(req.body.memberId, errRes)){
      events.dogeMuted(
        req.body.memberId,
        utils.buildResCallback(res)
      )
    } else {
      res.status(400).send(errRes)
    }

}

function specDogeUnmuted(req, res, next) {
    let errRes = []
    if (validators.isMemberId(req.body.memberId, errRes)){
      events.dogeUnmuted(
        req.body.memberId,
        utils.buildResCallback(res)
      )
    } else {
      res.status(400).send(errRes)
    }
}

function specDogeMigrated(req, res, next){
    let tasks = []
    let memberCard
    let taskIds = []
    state.serverState.tasks.forEach(t => {
        if(t.taskId === req.body.memberId) {
            memberCard = t
        }
        if(t.deck.indexOf(req.body.memberId) >= 0) {
            taskIds.push(t.taskId)
            taskIds = [...taskIds, ...t.subTasks, ...t.priorities, ...t.completed]
        }
    })

    let name = "migrated doge"
    let memberObject = state.serverState.members.some(m => {
        if(m.memberId === req.body.memberId) {
            let name = m.name
        }
    })
    let envelope = Cards.blankCard(name)
    envelope.name = memberCard.name
    envelope.subTasks = [...new Set(taskIds)]
    envelope.passed = [[req.body.address, req.body.toMemberId]]

    tasks = state.serverState.tasks.filter(t => taskIds.indexOf(t.taskId) >= 0)
    tasks.push(envelope)

    let serverAddress
    let serverSecret
    state.serverState.ao.forEach(a => {
        if (a.address === req.body.address) {
            serverAddress = a.address
            serverSecret = a.secret
          }
    })
    console.log("tasks to be sent: ", tasks.length)
    let next100 = tasks.splice(0, 50)
    let delay = 0
    while(next100.length > 0) {
        let newEvent = {
            type: 'tasks-received',
            tasks: next100,
        }
        setTimeout(() => {
            connector.postEvent(serverAddress, serverSecret, newEvent, (err, state) => {
                if (err){
                    return events.aoRelayAttempted(serverAddress, false)
                }
                events.aoRelayAttempted(serverAddress, true)
            })
        }, delay)
        next100 = tasks.splice(0, 50)
        delay += 500
    }
}
