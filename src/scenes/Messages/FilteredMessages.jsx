import React from 'react'
import {EmptyTableBody} from "../../components/shared"

import MessageRow from './MessageRow'
import {translateSubject} from '../../utils/language'


const filterByQuery = query => ({
  name, content, subject, tel, email
}) =>
  query.some(word =>
    [name, content, translateSubject(subject), tel, email]
      .map(e => e.toLowerCase())
      .join(" ")
      .includes(word)
  )


const FilteredMessages = ({messages, query}) => {
  messages = messages
    .filter(filterByQuery(query))
    .sort((a,b) => a.accepted - b.accepted)
    .map(message => <MessageRow key={message.id} {...message}/>)
  return (
    messages.length ? messages : <EmptyTableBody/>
  )
}

export default FilteredMessages