import moment from 'moment'

export const timeline = [{
  icon: 'fa-user',
  color: 'yellow',
  title: 'Meet Carlson Lau for an emergency appointment!',
  time: moment().endOf('month').fromNow()
},
{
  icon: 'fa-envelope',
  color: 'blue',
  title: 'Review Carlson\'s lab report',
  time: moment().endOf('day').fromNow(),
  body: 'Abnormalities found'
},
{
  icon: 'fa-user',
  color: 'yellow',
  title: 'Meet Ziqi Liu for a monthly appointment',
  time: moment().endOf('month').fromNow()
}]
